package com.budgetproj.project.services;

import com.budgetproj.project.models.Expenses;
import com.budgetproj.project.repositories.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    // ExpenseService.java

    @Transactional
    public Expenses updateExpense(Long id, Expenses updatedExpense) {
        Optional<Expenses> existingOpt = expenseRepository.findById(id);
        if (existingOpt.isEmpty())
            throw new RuntimeException("Expense not found with id: " + id);

        Expenses existing = existingOpt.get();

        existing.setAmount(updatedExpense.getAmount());
        existing.setCategory(updatedExpense.getCategory());
        existing.setDescription(updatedExpense.getDescription());
        existing.setDate(updatedExpense.getDate());
        existing.setTitle(updatedExpense.getTitle());

        // Preserve original user association!
        existing.setUser(existing.getUser());

        return expenseRepository.save(existing);
    }

}
