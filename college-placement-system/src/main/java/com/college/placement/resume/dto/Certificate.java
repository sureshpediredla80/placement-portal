package com.college.placement.resume.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class Certificate {

    private String certificateName;
    private String issuingOrganization;
    private String issueDate;
    private String credentialId;
    private String certificateUrl;

    public Certificate() {
    }

}