package com.college.placement.dto.response;

import com.college.placement.entity.CertificateStatus;
import lombok.*;
import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CertificateResponse {
    private Long id;
    private Long studentId;
    private String certificateName;
    private String certificateType;
    private String provider;
    private LocalDate issueDate;
    private String certificateUrl;
    private CertificateStatus status;
    private Set<SkillResponse> skills;
}
