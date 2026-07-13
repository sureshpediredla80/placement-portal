package com.college.placement.dto.response;
import lombok.*;

import com.college.placement.entity.PlacementStatus;
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentListResponse {

    private Long id;

    private String fullName;

    private String rollNumber;

    private Integer year;

    private Double cgpa;

    private PlacementStatus placementStatus;
}
