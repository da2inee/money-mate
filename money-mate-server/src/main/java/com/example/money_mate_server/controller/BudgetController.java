package com.example.money_mate_server.controller;

import com.example.money_mate_server.dto.BudgetUpdateRequest;
import com.example.money_mate_server.model.Budget;
import com.example.money_mate_server.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/budget")
@CrossOrigin(origins = "http://localhost:3000") // 프론트와 CORS 설정
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    // 예산 생성
    @PostMapping
    public ResponseEntity<Budget> createBudget(@RequestBody Budget budget) {
        System.out.println("budget" + budget);
        try {
            // 예산 생성 서비스 호출
            Budget savedBudget = budgetService.saveBudget(budget);
            System.out.println("budget" + budget);
            return ResponseEntity.ok(savedBudget);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null); // 예외 발생 시 500 에러 반환
        }
    }

    // 예산 조회 (카테고리별)
    @GetMapping("/{category}")
    public ResponseEntity<Budget> getBudgetByCategory(@PathVariable String category) {
        try {
            Budget budget = budgetService.getBudgetByCategory(category);
            return ResponseEntity.ok(budget);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    // 예산 업데이트
   @PutMapping("/{category}")
    public ResponseEntity<String> updateBudget(
            @PathVariable String category,
            @RequestBody BudgetUpdateRequest request) {
        
        Budget budget = new Budget();
        budget.setCategory(category);
        budget.setTotalAmount(request.getInputAmount());

        budgetService.saveBudget(budget);

        return ResponseEntity.ok("예산 업데이트 완료");
    }
}
