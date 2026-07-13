package com.college.placement.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NewsResponse {
    private Long id;
    private String title;
    private String description;
    private String category;
    private UserResponse createdBy;
    private LocalDateTime createdAt;
}
