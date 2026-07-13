package com.college.placement.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopicRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "isGlobal flag is required")
    private Boolean isGlobal;

    private Set<Long> applicableBranchIds;

    @NotBlank(message = "Difficulty level is required")
    private String difficultyLevel;

    private List<String> resourceLinks;
}
