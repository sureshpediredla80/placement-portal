package com.college.placement.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentProfileUpdateRequest {
    @Min(value = 1)
    @Max(value = 5)
    private Integer year;
    
    @Positive
    @Max(value = 10)
    private Double cgpa;
    
    private String phone;
    private String githubLink;
    private String linkedinLink;
    private String resumeUrl;
}
