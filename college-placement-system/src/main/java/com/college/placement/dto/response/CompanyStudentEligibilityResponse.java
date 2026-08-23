package com.college.placement.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyStudentEligibilityResponse {

    private Long sid;

    private String studentName;

    private String email;

    private String roll;

    private String status;

    public static CompanyStudentEligibilityResponse buildResponse(Long sid, String studentName, String email, String roll, String status) {
        return CompanyStudentEligibilityResponse.builder()
                .sid(sid)
                .studentName(studentName)
                .email(email)
                .roll(roll)
                .status(status)
                .build();
    }
}