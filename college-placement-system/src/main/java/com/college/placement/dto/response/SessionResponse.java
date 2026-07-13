package com.college.placement.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionResponse {
    private Long id;
    private String title;
    private String description;
    private String speakerName;
    private String speakerOrganization;
    private String speakerDesignation;
    private String liveLink;
    private String recordingLink;
    private LocalDateTime sessionDate;
    private UserResponse createdBy;
}
