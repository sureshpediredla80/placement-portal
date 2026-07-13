package com.college.placement.service;

import com.college.placement.dto.response.AdminDashboardResponse;
import com.college.placement.entity.Role;
import com.college.placement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


    @Service
    @Transactional(readOnly = true)
    @RequiredArgsConstructor
    public class AdminDashboardService {

        private final UserRepository userRepository;

        public AdminDashboardResponse getDashboard() {

            return AdminDashboardResponse.builder()
                    .totalUsers(userRepository.count())
                    .totalStudents(userRepository.countByRole(Role.ROLE_STUDENT))
                    .totalCoordinators(userRepository.countByRole(Role.ROLE_COORDINATOR))
                    .totalAdmins(userRepository.countByRole(Role.ROLE_ADMIN))
                    .build();
        }
    }



