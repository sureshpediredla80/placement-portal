package com.college.placement.controller;
import com.college.placement.dto.response.AdminDashboardResponse;
import com.college.placement.service.AdminDashboardService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

    @RestController
    @RequestMapping("/api/admin/dashboard")
    @RequiredArgsConstructor
    @Tag(name = "AdminDashboardController", description = "APIs for AdminDashboardController")
    public class AdminDashboardController {

        private final AdminDashboardService adminDashboardService;

        @GetMapping
        @PreAuthorize("hasRole('ADMIN')")
        @Operation(summary = "Get endpoint")
        @SecurityRequirement(name = "Bearer Authentication")
        public ResponseEntity<AdminDashboardResponse> getDashboard() {

            return ResponseEntity.ok(
                    adminDashboardService.getDashboard()
            );
        }
    }


