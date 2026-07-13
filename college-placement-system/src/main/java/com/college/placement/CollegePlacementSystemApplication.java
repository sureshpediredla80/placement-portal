package com.college.placement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
/**
 * Main Entry Point for the College Placement Management System (CPMS) Backend.
 *
 * This Spring Boot application initializes the servlet engine, boots up Hibernate context,
 * configures filters and dependency injection (IOC Container), and mounts security configurations.
 */
@EnableScheduling
@SpringBootApplication
public class CollegePlacementSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(CollegePlacementSystemApplication.class, args);
    }
}
