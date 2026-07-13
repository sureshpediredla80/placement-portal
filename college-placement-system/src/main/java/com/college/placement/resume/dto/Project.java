package com.college.placement.resume.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class Project {

    private String title;
    private String description;
    private String problem;
    private String solution;
    private String role;
    private String challenges;
    private String techStack;
    private String github;
    private String liveDemo;

    public Project() {
    }

}