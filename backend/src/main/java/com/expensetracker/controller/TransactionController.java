package com.expensetracker.controller;

import com.expensetracker.dto.TransactionDTO;
import com.expensetracker.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping
    public ResponseEntity<TransactionDTO.Response> add(@Valid @RequestBody TransactionDTO.Request request) {
        return ResponseEntity.ok(transactionService.addTransaction(request));
    }

    @GetMapping
    public ResponseEntity<List<TransactionDTO.Response>> getAll() {
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }

    @GetMapping("/monthly")
    public ResponseEntity<List<TransactionDTO.Response>> getMonthly(
            @RequestParam int month, @RequestParam int year) {
        return ResponseEntity.ok(transactionService.getMonthlyTransactions(month, year));
    }

    @GetMapping("/summary")
    public ResponseEntity<TransactionDTO.Summary> getSummary() {
        return ResponseEntity.ok(transactionService.getSummary());
    }

    @GetMapping("/category-breakdown")
    public ResponseEntity<Map<String, BigDecimal>> getCategoryBreakdown() {
        return ResponseEntity.ok(transactionService.getCategoryBreakdown());
    }

    @GetMapping("/monthly-summary")
    public ResponseEntity<List<Map<String, Object>>> getMonthlySummary() {
        return ResponseEntity.ok(transactionService.getMonthlySummary());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        transactionService.deleteTransaction(id);
        return ResponseEntity.ok("Deleted successfully");
    }
}
