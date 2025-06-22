package com.example.money_mate_server.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.money_mate_server.dto.TravelerRequest;
import com.example.money_mate_server.service.TravelerService;




@RestController
@RequestMapping("/category")
@CrossOrigin(origins = "http://localhost:3000") // 프론트와 CORS 설정
public class TravelerController {

    @Autowired
    private TravelerService travelerService;

    @PostMapping
    public ResponseEntity<String> createTraveler(@RequestBody TravelerRequest request) {
        String name=request.getName();
        String category=request.getCategory();

        String savedName = travelerService.saveTravelerName(name,category );
        System.out.println("savedName: " + savedName);
        System.out.println("category: " + category);
        return ResponseEntity.ok(savedName);
    }

    @GetMapping
    public ResponseEntity<List<String>> getTravelerNames(@RequestParam String category) {
        List<String> names = travelerService.getTravelerNamesByCategory(category);
        return ResponseEntity.ok(names);
    }

    
}