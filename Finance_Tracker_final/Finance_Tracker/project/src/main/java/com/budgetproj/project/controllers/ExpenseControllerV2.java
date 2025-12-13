package com.budgetproj.project.controllers;

import com.budgetproj.project.models.Expenses;
import com.budgetproj.project.models.User;
import com.budgetproj.project.repositories.ExpenseRepository;
import com.budgetproj.project.repositories.UserRepository;
import com.budgetproj.project.services.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin("*")
public class ExpenseControllerV2 {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExpenseService expenseService;

    // ✅ CREATE expense (this is the main fix)
    @PostMapping
    public ResponseEntity<?> createExpense(Authentication authentication, @RequestBody Expenses expense) {
        try {
            if (authentication == null || authentication.getPrincipal() == null) {
                return ResponseEntity.status(401).body("Unauthorized: No authentication");
            }

            // principal from JWTAuthFilter is the email (String)
            String email = authentication.getPrincipal().toString();

            Optional<User> userOpt = userRepository.findById(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(401).body("User not found");
            }

            User user = userOpt.get();
            expense.setUser(user); // ✅ attach user before saving

            // set default date if frontend doesn’t send it
            if (expense.getDate() == null) {
                expense.setDate(new Date());
            }

            Expenses saved = expenseRepository.save(expense);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error saving expense: " + e.getMessage());
        }
    }

    // ✅ READ all user’s expenses
    @GetMapping
    public ResponseEntity<?> getExpenses(Authentication authentication) {
        try {
            if (authentication == null || authentication.getPrincipal() == null) {
                return ResponseEntity.status(401).body("Unauthorized: No authentication");
            }

            String email = authentication.getPrincipal().toString();
            List<Expenses> list = expenseRepository.findByUser_Email(email);
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching expenses: " + e.getMessage());
        }
    }

    // ✅ UPDATE existing expense
    // ExpenseControllerV2.java

    @PutMapping("/{id}")
    public ResponseEntity<?> updateExpense(Authentication authentication, @PathVariable Long id, @RequestBody Expenses expense) {
        try {
            String email = authentication.getPrincipal().toString();
            Optional<User> userOpt = userRepository.findById(email);
            if (userOpt.isEmpty())
                return ResponseEntity.status(401).body("User not found");

            User user = userOpt.get();
            // Attach authenticated user to the expense object
            expense.setUser(user);

            Expenses updated = expenseService.updateExpense(id, expense);

            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error updating expense: " + e.getMessage());
        }
    }


    // ✅ DELETE expense
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long id) {
        expenseRepository.deleteById(id);
        return ResponseEntity.ok("Deleted successfully");
    }
}
