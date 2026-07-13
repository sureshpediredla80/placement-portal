package com.college.placement.dto.response;

import com.college.placement.entity.ApplicationStatus;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlacementApplicationResponse {
    private Long id;
    private StudentProfileResponse student;
    private CompanyResponse company;
    private LocalDateTime applicationDate;
    private ApplicationStatus status;
}
