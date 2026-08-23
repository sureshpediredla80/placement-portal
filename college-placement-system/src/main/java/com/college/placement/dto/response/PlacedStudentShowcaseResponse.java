package com.college.placement.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

/**
 * Outbound DTO exposing placed student profiles, multi-company offer details,
 * verified certifications, and technical skills for campus motivation and career guidance.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlacedStudentShowcaseResponse {

    private Long studentId;

    private String studentName;

    private String rollNumber;

    private String branchName;

    private Integer academicYear;

    private Integer placementYear;

    private BigDecimal highestPackageLpa;

    private Integer totalOffersCount;

    private List<PlacedCompanyOfferResponse> placedCompanies;

    private List<PlacedStudentCertificateResponse> certifications;

    private Set<String> skills;

    private String linkedinLink;

    private String githubLink;
}
