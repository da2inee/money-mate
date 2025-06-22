package com.example.money_mate_server.service;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.money_mate_server.mapper.TravelerMapper;

@Service
public class TravelerService {

    @Autowired
    private TravelerMapper travelerMapper;

    public String saveTravelerName(String name, String category ) {
        travelerMapper.saveName(name, category);
    return name;
    }

    public List<String> getTravelerNamesByCategory(String category) {
    // 예: DB에서 category 기준으로 이름들 가져오기
    return travelerMapper.findNamesByCategory(category);
    }

}