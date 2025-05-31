package com.example.money_mate_server.model;

public class Expense {

    private Long id;
    private String category;
    private String title;
    private double amount;
    private String payer;

    public Expense() {
    }

    public Expense(Long id, String category, String title, double amount, String payer) {
        this.id = id;
        this.category = category;
        this.title = title;
        this.amount = amount;
        this.payer = payer;
    }

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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getPayer() {
        return payer;
    }

    public void setPayer(String payer) {
        this.payer = payer;
    }
}
