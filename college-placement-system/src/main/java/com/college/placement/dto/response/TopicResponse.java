package com.college.placement.dto.response;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopicResponse {
    private Long id;
    private String title;
    private String description;
    private String category;
    private Boolean isGlobal;
    private Set<BranchResponse> applicableBranches;
    private String difficultyLevel;
    private UserResponse createdBy;
    private LocalDateTime createdAt;
    private List<String> resourceLinks;
}
