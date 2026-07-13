package com.college.placement.resume.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class Experience {

    private String experienceLevel;
    private String company;
    private String designation;
    private String years;
    private String responsibilities;

    public Experience() {
    }

}