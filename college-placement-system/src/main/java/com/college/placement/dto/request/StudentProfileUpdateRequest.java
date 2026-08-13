package com.college.placement.dto.request;

import com.college.placement.entity.BloodGroup;
import com.college.placement.entity.Gender;
import com.college.placement.entity.ResidenceType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentProfileUpdateRequest {

    private Gender gender;

    private LocalDate dateOfBirth;

    @Email(message = "Invalid personal email")
    @Size(max = 100, message = "Personal email cannot exceed 100 characters")
    private String personalEmail;

    @Pattern(
            regexp = "^[6-9]\\d{9}$",
            message = "Whatsapp number must be a valid 10-digit Indian mobile number"
    )
    private String whatsappNumber;

    @Pattern(
            regexp = "^[6-9]\\d{9}$",
            message = "Parent contact number must be a valid 10-digit Indian mobile number"
    )
    private String parentContactNumber;

    @Email(message = "Invalid parent email")
    @Size(max = 100, message = "Parent email cannot exceed 100 characters")
    private String parentEmail;

    private ResidenceType residenceType;

    @Pattern(
            regexp = "^\\d{12}$",
            message = "Aadhaar number must contain exactly 12 digits"
    )
    private String aadhaarNumber;

    @Pattern(
            regexp = "^[A-Z]{5}[0-9]{4}[A-Z]$",
            message = "Invalid PAN number"
    )
    private String panNumber;

    @Size(max = 1000, message = "Residential address cannot exceed 1000 characters")
    private String residentialAddress;

    private BloodGroup bloodGroup;

    @Size(max = 255)
    private String githubLink;

    @Size(max = 255)
    private String linkedinLink;

    @Size(max = 255)
    private String resumeUrl;
}