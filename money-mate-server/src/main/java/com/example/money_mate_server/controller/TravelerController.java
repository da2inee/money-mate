package com.example.money_mate_server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.money_mate_server.model.Expense;
import com.example.money_mate_server.service.TravelerService;



@RestController
@RequestMapping("/category")
@CrossOrigin(origins = "http://localhost:3000") // 프론트와 CORS 설정
public class TravelerController {

    @Autowired
    private TravelerService travelerService;

    @PostMapping
    public ResponseEntity<String> createExpense(@RequestBody String name, String category) {
        String savedName = travelerService.saveName(name);
        return ResponseEntity.ok(savedName);
    }
}