package com.expensetracker.dto;

import com.expensetracker.entity.Transaction.TransactionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class TransactionDTO {

    @Data
    public static class Request {
        @NotNull(message = "Type is required")
        private TransactionType type;

        @NotNull(message = "Amount is required")
        @Positive(message = "Amount must be positive")
        private BigDecimal amount;

        @NotBlank(message = "Category is required")
        private String category;

        private String description;

        @NotNull(message = "Date is required")
        private LocalDate date;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Response {
        private Long id;
        private TransactionType type;
        private BigDecimal amount;
        private String category;
        private String description;
        private LocalDate date;
        private LocalDateTime createdAt;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Summary {
        private BigDecimal totalIncome;
        private BigDecimal totalExpense;
        private BigDecimal balance;
    }
}
