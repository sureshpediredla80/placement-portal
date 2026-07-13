package com.college.placement.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CoordinatorProfileUpdateRequest {
    @NotBlank(message = "Department is required")
    private String department;
}
