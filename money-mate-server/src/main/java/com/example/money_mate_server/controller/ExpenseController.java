package com.example.money_mate_server.controller;

import com.example.money_mate_server.model.Expense;
import com.example.money_mate_server.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/expenses")
@CrossOrigin(origins = "http://localhost:3000")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    // (1) 전체 지출 혹은 카테고리별 지출 조회
    @GetMapping
    public List<Expense> getExpenses(
        @RequestParam(required = false) String category
        ) {
        System.out.println(category);
        if (category != null ) {
            //System.out.println("ㅇㄴ"+category);
            return expenseService.getExpensesByCategory(category);
        }
        System.out.println("호ㅏㄱ이니런ㅇㄹsc");
        return expenseService.getAllExpenses();
    }

    // (2) 지출 추가
    @PostMapping
    public ResponseEntity<Expense> createExpense(@RequestBody Expense expense) {
        System.out.println("📥 새 지출 요청 수신:");
        System.out.println("Category: " + expense.getCategory());
        System.out.println("Title: " + expense.getTitle());
        System.out.println("Amount: " + expense.getAmount());
        System.out.println("Payer: " + expense.getPayer());
    
        Expense savedExpense = expenseService.saveExpense(expense);
        return ResponseEntity.ok(savedExpense);
    }

    // (3) 지출 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable int id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build(); // 204 응답
    }

        // (3) 지출 삭제
    @DeleteMapping("/category/{id}")
    public ResponseEntity<Void> deleteName(@PathVariable int id) {
        expenseService.deleteName(id);
        return ResponseEntity.noContent().build(); // 204 응답
    }

}
 