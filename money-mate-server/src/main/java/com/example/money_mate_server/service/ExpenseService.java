package com.example.money_mate_server.service;

import com.example.money_mate_server.mapper.ExpenseMapper;
import com.example.money_mate_server.model.Expense;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseMapper expenseMapper;

    public List<Expense> getAllExpenses() {
        return expenseMapper.getAllExpenses();
    }

    public List<Expense> getExpensesByCategory(String category) {

        
        return expenseMapper.getExpensesByCategory(category);
    }

    public Expense saveExpense(Expense expense) {
        expenseMapper.insertExpense(expense);
        return expense;
    }

    public void deleteExpense(int id) {
        expenseMapper.deleteExpense(id);
    }

}
