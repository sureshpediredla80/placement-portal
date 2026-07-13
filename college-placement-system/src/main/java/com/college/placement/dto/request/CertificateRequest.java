package com.college.placement.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CertificateRequest {
    @NotBlank(message = "Certificate name is required")
    private String certificateName;

    private String certificateType;
    private String provider;
    private LocalDate issueDate;

    @NotBlank(message = "Certificate URL is required")
    private String certificateUrl;

    @NotEmpty(message = "At least one skill is required")
    private Set<String> skillNames;
}
