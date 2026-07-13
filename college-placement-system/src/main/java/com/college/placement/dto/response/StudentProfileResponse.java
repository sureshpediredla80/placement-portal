package com.college.placement.dto.response;

import com.college.placement.entity.PlacementStatus;
import lombok.*;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentProfileResponse {
    private Long id;
    private UserResponse user;
    private BranchResponse branch;
    private String rollNumber;
    private Integer year;
    private Double cgpa;
    private String phone;
    private String githubLink;
    private String linkedinLink;
    private String resumeUrl;
    private PlacementStatus placementStatus;
    private Set<SkillResponse> skills;
}
