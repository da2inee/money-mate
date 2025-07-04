package com.example.money_mate_server.dto;

public class TravelerDto {
    private Long id;
    private String name;

    public TravelerDto(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    // Getter, Setter
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}
