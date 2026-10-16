package com.college.placement.dto.response;

import lombok.*;

import java.time.LocalDate;
import java.util.Set;

/**
 * Outbound DTO representing an approved academic or professional certificate completed by a student.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlacedStudentCertificateResponse {

    private Long id;

    private String certificateName;

    private String certificateType;

    private String provider;

    private LocalDate issueDate;

    private Set<String> skillsLearned;
}