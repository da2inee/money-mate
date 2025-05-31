package com.example.money_mate_server.service;

import com.example.money_mate_server.mapper.BudgetMapper;
import com.example.money_mate_server.model.Budget;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BudgetService {

    @Autowired
    private BudgetMapper budgetMapper;

    // 예산 저장
    public Budget saveBudget(Budget budget) {
        // 카테고리가 이미 존재하는지 확인
        Budget existingBudget = budgetMapper.getBudgetByCategory(budget.getCategory());
        System.out.println("카테고리"+budget.getTotalAmount());
        if (existingBudget != null) {
            // 카테고리가 존재하면 예산 수정
            existingBudget.setTotalAmount(budget.getTotalAmount());
            budgetMapper.updateBudget(existingBudget);  // 예산 수정
            System.out.println(existingBudget);
            return existingBudget;
        } else {
            // 카테고리가 없으면 새로 예산 생성
            budgetMapper.insertBudget(budget);  // 예산 삽입
            return budget;
        }
    }

    // 카테고리별 예산 조회
    public Budget getBudgetByCategory(String category) {
        return budgetMapper.getBudgetByCategory(category);
    }
}
