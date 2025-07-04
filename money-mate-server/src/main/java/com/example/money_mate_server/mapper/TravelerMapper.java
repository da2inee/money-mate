package com.example.money_mate_server.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.money_mate_server.dto.TravelerDto;


@Mapper
public interface TravelerMapper {
    void saveName(@Param("name") String name, String category);
    List<TravelerDto> findNamesByCategory(@Param("category") String category);

}


