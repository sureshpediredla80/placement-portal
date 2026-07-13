package com.college.placement.resume.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ResumeGenerationResponse {

    private String resume;

    public ResumeGenerationResponse() {
    }

    public ResumeGenerationResponse(String resume) {
        this.resume = resume;
    }

}