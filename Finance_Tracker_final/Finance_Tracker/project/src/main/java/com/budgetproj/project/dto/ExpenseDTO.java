package com.budgetproj.project.dto;
import lombok.Data;
@Data
public class ExpenseDTO {
    private Long id;
    private String title;
    private String description;
    private String category;
    private Double amount;
    private String date; // ISO date string yyyy-MM-dd
    private String userEmail;

}
