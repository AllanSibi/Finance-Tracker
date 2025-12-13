package com.budgetproj.project.repositories;

import com.budgetproj.project.models.Expenses;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expenses, Long> {
    List<Expenses> findByUser_Email(String email);
}
