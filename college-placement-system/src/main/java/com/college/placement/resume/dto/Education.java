package com.college.placement.resume.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class Education {

    private String college;
    private String degree;
    private String specialization;
    private String cgpa;
    private String graduationYear;

    public Education() {
    }

}