package com.college.placement.resume.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class ResumeGenerationRequest {

    private String resumeType;

    private String targetCompany;

    private String jobDescription;

    private PersonalInfo personalInfo;

    private Education education;

    private Experience experience;

    private Skills skills;

    private List<Project> projects;

    private List<Certificate> certificates;

    private List<Achievement> achievements;

}