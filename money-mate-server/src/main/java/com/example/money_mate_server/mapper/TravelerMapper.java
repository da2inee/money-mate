package com.example.money_mate_server.mapper;

import org.apache.ibatis.annotations.Mapper;


@Mapper
public interface TravelerMapper {
    void saveName(String name);
}
