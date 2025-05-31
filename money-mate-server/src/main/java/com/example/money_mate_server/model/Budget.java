package com.example.money_mate_server.model;

public class Budget {
    private Long id;
    private String category;
    private int totalAmount;

    // 기본 생성자
    public Budget() {}

    // 전체 생성자
    public Budget(Long id, String category, int totalAmount) {
        this.id = id;
        this.category = category;
        this.totalAmount = totalAmount;
    }

    // Getter / Setter
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getTotalAmount() {

        return totalAmount;
    }

    public void setTotalAmount(int totalAmount) {
        this.totalAmount = totalAmount;
    }
}
