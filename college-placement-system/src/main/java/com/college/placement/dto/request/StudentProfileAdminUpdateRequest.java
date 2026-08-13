package com.college.placement.dto.request;

import com.college.placement.entity.AdmissionType;
import com.college.placement.entity.EntranceExam;
import com.college.placement.entity.PlacementStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentProfileAdminUpdateRequest {

    @PositiveOrZero(message = "SSC percentage cannot be negative")
    @Max(value = 100, message = "SSC percentage cannot exceed 100")
    private Double sscPercentage;

    @PositiveOrZero(message = "Intermediate percentage cannot be negative")
    @Max(value = 100, message = "Intermediate percentage cannot exceed 100")
    private Double intermediatePercentage;

    @PositiveOrZero(message = "Diploma CGPA cannot be negative")
    @Max(value = 10, message = "Diploma CGPA cannot exceed 10")
    private Double diplomaCgpa;

    @PositiveOrZero(message = "B.Tech CGPA cannot be negative")
    @Max(value = 10, message = "B.Tech CGPA cannot exceed 10")
    private Double cgpa;

    @PositiveOrZero(message = "Backlogs cannot be negative")
    private Integer backlogs;

    private AdmissionType admissionType;

    private EntranceExam entranceExam;

    @PositiveOrZero(message = "Entrance rank cannot be negative")
    private Integer entranceRank;

    private PlacementStatus placementStatus;

    private Boolean graduated;
}