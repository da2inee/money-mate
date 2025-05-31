package com.example.money_mate_server.mapper;

import com.example.money_mate_server.model.Budget;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface BudgetMapper {
    void insertBudget(Budget budget);
    void updateBudget(Budget budget);
    Budget getBudgetByCategory(String category);
}
