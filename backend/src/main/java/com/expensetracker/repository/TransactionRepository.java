package com.expensetracker.repository;

import com.expensetracker.entity.Transaction;
import com.expensetracker.entity.Transaction.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserIdOrderByDateDesc(Long userId);

    List<Transaction> findByUserIdAndTypeOrderByDateDesc(Long userId, TransactionType type);

    // Monthly transactions
    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId " +
           "AND MONTH(t.date) = :month AND YEAR(t.date) = :year ORDER BY t.date DESC")
    List<Transaction> findByUserIdAndMonthAndYear(
            @Param("userId") Long userId,
            @Param("month") int month,
            @Param("year") int year);

    // Total income
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
           "WHERE t.user.id = :userId AND t.type = 'INCOME'")
    BigDecimal getTotalIncome(@Param("userId") Long userId);

    // Total expense
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
           "WHERE t.user.id = :userId AND t.type = 'EXPENSE'")
    BigDecimal getTotalExpense(@Param("userId") Long userId);

    // Category-wise expense
    @Query("SELECT t.category, SUM(t.amount) FROM Transaction t " +
           "WHERE t.user.id = :userId AND t.type = 'EXPENSE' GROUP BY t.category")
    List<Object[]> getExpenseByCategory(@Param("userId") Long userId);

    // Monthly summary
    @Query("SELECT MONTH(t.date), YEAR(t.date), t.type, SUM(t.amount) FROM Transaction t " +
           "WHERE t.user.id = :userId GROUP BY MONTH(t.date), YEAR(t.date), t.type " +
           "ORDER BY YEAR(t.date) DESC, MONTH(t.date) DESC")
    List<Object[]> getMonthlySummary(@Param("userId") Long userId);
}
