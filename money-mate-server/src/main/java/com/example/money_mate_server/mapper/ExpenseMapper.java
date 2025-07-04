package com.example.money_mate_server.mapper;

import com.example.money_mate_server.model.Expense;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ExpenseMapper {
    List<Expense> getAllExpenses();
    List<Expense> getExpensesByCategory(@Param("category") String category);
    void insertExpense(Expense expense);
    void deleteExpense(int id);
    void updateExpense(Expense expense);
    void deleteName(int id);
}
