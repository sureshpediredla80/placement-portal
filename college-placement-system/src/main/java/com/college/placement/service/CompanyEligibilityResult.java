package com.college.placement.service;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CompanyEligibilityResult {

    private final boolean eligible;
    private final String reason;

    public static CompanyEligibilityResult eligible() {
        return new CompanyEligibilityResult(true, null);
    }

    public static CompanyEligibilityResult notEligible(String reason) {
        return new CompanyEligibilityResult(false, reason);
    }
}