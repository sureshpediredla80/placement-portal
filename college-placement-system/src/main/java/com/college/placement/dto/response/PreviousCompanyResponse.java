package com.college.placement.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PreviousCompanyResponse {

    private Long id;

    private String companyName;

    private LocalDateTime driveDate;
}