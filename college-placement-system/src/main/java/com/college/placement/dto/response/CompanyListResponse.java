package com.college.placement.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class CompanyListResponse {

    private Long id;
    private String companyName;
    private String roleOffered;
    private BigDecimal packageOffered;
    private LocalDateTime applyDeadline;
}