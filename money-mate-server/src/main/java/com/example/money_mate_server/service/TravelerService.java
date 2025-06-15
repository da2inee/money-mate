package com.example.money_mate_server.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.money_mate_server.mapper.TravelerMapper;
import com.example.money_mate_server.model.Expense;

import java.util.List;

@Service
public class TravelerService {

    @Autowired
    private TravelerMapper travelerMapper;

    public String saveName(String name ) {
        travelerMapper.insertTraveler(name);
    return name;
    }
}