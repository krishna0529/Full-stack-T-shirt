package com.tshirtstore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TshirtStoreApplication {

    public static void main(String[] args) {
        SpringApplication.run(TshirtStoreApplication.class, args);
    }
}
