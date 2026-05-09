package com.expensetracker.service;

import com.expensetracker.dto.TransactionDTO;
import com.expensetracker.entity.Transaction;
import com.expensetracker.entity.User;
import com.expensetracker.repository.TransactionRepository;
import com.expensetracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public TransactionDTO.Response addTransaction(TransactionDTO.Request request) {
        User user = getCurrentUser();

        Transaction transaction = Transaction.builder()
                .user(user)
                .type(request.getType())
                .amount(request.getAmount())
                .category(request.getCategory())
                .description(request.getDescription())
                .date(request.getDate())
                .build();

        Transaction saved = transactionRepository.save(transaction);
        return mapToResponse(saved);
    }

    public List<TransactionDTO.Response> getAllTransactions() {
        User user = getCurrentUser();
        return transactionRepository.findByUserIdOrderByDateDesc(user.getId())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<TransactionDTO.Response> getMonthlyTransactions(int month, int year) {
        User user = getCurrentUser();
        return transactionRepository.findByUserIdAndMonthAndYear(user.getId(), month, year)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public TransactionDTO.Summary getSummary() {
        User user = getCurrentUser();
        BigDecimal income = transactionRepository.getTotalIncome(user.getId());
        BigDecimal expense = transactionRepository.getTotalExpense(user.getId());
        BigDecimal balance = income.subtract(expense);
        return new TransactionDTO.Summary(income, expense, balance);
    }

    public Map<String, BigDecimal> getCategoryBreakdown() {
        User user = getCurrentUser();
        List<Object[]> results = transactionRepository.getExpenseByCategory(user.getId());
        Map<String, BigDecimal> breakdown = new HashMap<>();
        for (Object[] row : results) {
            breakdown.put((String) row[0], (BigDecimal) row[1]);
        }
        return breakdown;
    }

    public List<Map<String, Object>> getMonthlySummary() {
        User user = getCurrentUser();
        List<Object[]> results = transactionRepository.getMonthlySummary(user.getId());
        return results.stream().map(row -> {
            Map<String, Object> map = new HashMap<>();
            map.put("month", row[0]);
            map.put("year", row[1]);
            map.put("type", row[2]);
            map.put("total", row[3]);
            return map;
        }).collect(Collectors.toList());
    }

    public void deleteTransaction(Long id) {
        User user = getCurrentUser();
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (!transaction.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        transactionRepository.delete(transaction);
    }

    private TransactionDTO.Response mapToResponse(Transaction t) {
        return new TransactionDTO.Response(
                t.getId(), t.getType(), t.getAmount(),
                t.getCategory(), t.getDescription(), t.getDate(), t.getCreatedAt()
        );
    }
}
