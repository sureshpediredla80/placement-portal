package com.college.placement.resume.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class Achievement {

    private String title;
    private String description;
    private String date;

    public Achievement() {
    }

}