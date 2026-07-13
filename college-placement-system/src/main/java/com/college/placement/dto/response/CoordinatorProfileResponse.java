package com.college.placement.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CoordinatorProfileResponse {
    private Long id;
    private UserResponse user;
    private BranchResponse branch;
    private String department;
}
