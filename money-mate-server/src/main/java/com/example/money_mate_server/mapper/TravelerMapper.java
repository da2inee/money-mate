package com.example.money_mate_server.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;


@Mapper
public interface TravelerMapper {
    void saveName(String name, String category);
    List<String> findNamesByCategory(@Param("category") String category);

}


