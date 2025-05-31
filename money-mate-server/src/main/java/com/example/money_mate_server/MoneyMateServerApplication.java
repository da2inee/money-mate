package com.example.money_mate_server;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.example.money_mate_server.mapper")
public class MoneyMateServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(MoneyMateServerApplication.class, args);
	}

}
