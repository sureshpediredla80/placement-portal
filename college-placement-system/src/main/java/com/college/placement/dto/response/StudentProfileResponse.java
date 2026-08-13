package com.college.placement.dto.response;

import com.college.placement.entity.*;
import lombok.*;

import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentProfileResponse {

    /* =========================
       Basic Details
       ========================= */

    private Long id;
    private UserResponse user;
    private BranchResponse branch;

    private String rollNumber;
    private Gender gender;
    private LocalDate dateOfBirth;
    private Integer year;

    /* =========================
       Academic Details
       ========================= */

    private Double sscPercentage;
    private Double intermediatePercentage;
    private Double diplomaCgpa;
    private Double cgpa;
    private Integer backlogs;
    private Boolean firstAttemptInAllSemesters;

    /* =========================
       Admission Details
       ========================= */

    private AdmissionType admissionType;
    private EntranceExam entranceExam;
    private Integer entranceRank;

    /* =========================
       Contact Details
       ========================= */

    private String whatsappNumber;
    private String personalEmail;
    private String parentContactNumber;
    private String parentEmail;

    /* =========================
       Personal Details
       ========================= */

    private ResidenceType residenceType;
    private String aadhaarNumber;
    private String panNumber;
    private String residentialAddress;
    private BloodGroup bloodGroup;

    /* =========================
       Professional Details
       ========================= */

    private String githubLink;
    private String linkedinLink;
    private String resumeUrl;

    /* =========================
       Placement Details
       ========================= */

    private PlacementStatus placementStatus;
    private Boolean graduated;

    /* =========================
       Skills
       ========================= */

    private Set<SkillResponse> skills;
}