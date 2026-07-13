package com.college.placement.dto.response;

import lombok.*;

import java.time.LocalDateTime;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TopicListResponse {

    private Long id;
    private String title;
    private String category;
    private String difficultyLevel;
    private Boolean isGlobal;
    private LocalDateTime createdAt;



}
