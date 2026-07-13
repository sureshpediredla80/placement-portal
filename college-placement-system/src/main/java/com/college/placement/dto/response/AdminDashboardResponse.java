package com.college.placement.dto.response;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public class AdminDashboardResponse {

        private long totalUsers;

        private long totalStudents;

        private long totalCoordinators;

        private long totalAdmins;
    }

