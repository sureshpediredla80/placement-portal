package com.college.placement.dto.response;

import com.college.placement.entity.ApplicationStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationResponse {

    private Long id;
    private LocalDateTime applicationDate;
    private ApplicationStatus status;
    //private String remarks;

    private Long studentId;
    private String fullName;
    private String rollNumber;

    private Long companyId;
    private String companyName;
    private String roleOffered;
    private BigDecimal packageOffered;
    private LocalDateTime driveDate;
}