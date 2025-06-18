package com.example.money_mate_server.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.money_mate_server.mapper.TravelerMapper;

@Service
public class TravelerService {

    @Autowired
    private TravelerMapper travelerMapper;

    public String saveTravelerName(String name ) {
        travelerMapper.saveName(name);
    return name;
    }
}