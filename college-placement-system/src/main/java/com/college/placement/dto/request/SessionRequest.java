package com.college.placement.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Speaker name is required")
    private String speakerName;

    private String speakerOrganization;
    private String speakerDesignation;
    
    private String liveLink;
    private String recordingLink;

    @NotNull(message = "Session date is required")
    private LocalDateTime sessionDate;
}
