package com.college.placement.resume.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class PersonalInfo {

    private String fullName;
    private String email;
    private String phone;
    private String location;
    private String linkedin;
    private String github;
    private String portfolio;

    public PersonalInfo() {
    }

}