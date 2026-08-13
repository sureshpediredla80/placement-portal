package com.college.placement.service;

import com.college.placement.entity.*;
import com.college.placement.exception.BadRequestException;
import com.college.placement.repository.PlacementApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompanyEligibilityService {

    private final PlacementApplicationRepository placementApplicationRepository;


    /**
     * Returns true if student is eligible for the company drive.
     *
     * This method contains the SINGLE source of truth
     * for company eligibility rules.
     */
    public CompanyEligibilityResult checkEligibility(
            StudentProfile student,
            Company company
    ) {

        // ============================================================
        // 1. APPLICATION DEADLINE
        // ============================================================

        if (company.getApplyDeadline() == null) {
            return CompanyEligibilityResult.notEligible(
                    "Application deadline is not configured for this company drive."
            );
        }

        if (company.getApplyDeadline().isBefore(LocalDateTime.now())) {
            return CompanyEligibilityResult.notEligible(
                    "The application deadline for this company drive has passed."
            );
        }


        // ============================================================
        // 2. BRANCH
        // ============================================================

        if (student.getBranch() == null) {
            return CompanyEligibilityResult.notEligible(
                    "Your branch is not available in your profile."
            );
        }

        if (company.getAllowedBranches() == null ||
                company.getAllowedBranches().isEmpty()) {

            return CompanyEligibilityResult.notEligible(
                    "No eligible branches have been configured for this company drive."
            );
        }

        boolean branchAllowed =
                company.getAllowedBranches()
                        .stream()
                        .anyMatch(branch ->
                                Objects.equals(
                                        branch.getId(),
                                        student.getBranch().getId()
                                )
                        );

        if (!branchAllowed) {
            return CompanyEligibilityResult.notEligible(
                    "Your branch (" +
                            student.getBranch().getName() +
                            ") is not eligible for this company drive."
            );
        }


        // ============================================================
        // 3. YEAR
        // ============================================================

        if (student.getYear() == null) {
            return CompanyEligibilityResult.notEligible(
                    "Your academic year is not available in your profile."
            );
        }

        if (company.getAllowedYears() == null ||
                company.getAllowedYears().isEmpty()) {

            return CompanyEligibilityResult.notEligible(
                    "No eligible academic years have been configured for this company drive."
            );
        }

        if (!company.getAllowedYears().contains(student.getYear())) {

            return CompanyEligibilityResult.notEligible(
                    "Your academic year (Year " + student.getYear()
                            + ") is not eligible for this company drive."
            );
        }


        // ============================================================
        // 4. MINIMUM CGPA
        // ============================================================

        if (company.getMinimumCgpa() != null) {

            if (student.getCgpa() == null) {
                return CompanyEligibilityResult.notEligible(
                        "Your CGPA is not available in your profile."
                );
            }

            if (student.getCgpa() < company.getMinimumCgpa()) {
                return CompanyEligibilityResult.notEligible(
                        "Your CGPA is " + student.getCgpa()
                                + ", but the minimum required CGPA is "
                                + company.getMinimumCgpa() + "."
                );
            }
        }


        // ============================================================
        // 5. MAXIMUM CGPA
        // ============================================================

        if (company.getMaximumCgpa() != null) {

            if (student.getCgpa() == null) {
                return CompanyEligibilityResult.notEligible(
                        "Your CGPA is not available in your profile."
                );
            }

            if (student.getCgpa() > company.getMaximumCgpa()) {
                return CompanyEligibilityResult.notEligible(
                        "Your CGPA is " + student.getCgpa()
                                + ", but the maximum allowed CGPA is "
                                + company.getMaximumCgpa() + "."
                );
            }
        }


        // ============================================================
// 6. BACKLOGS
// ============================================================

        Integer studentBacklogs = student.getBacklogs();

        if (studentBacklogs == null) {
            return CompanyEligibilityResult.notEligible(
                    "Your backlog information is not available in your profile."
            );
        }

        if (Boolean.FALSE.equals(company.getBacklogsAllowed())) {

            if (studentBacklogs > 0) {

                return CompanyEligibilityResult.notEligible(
                        "You have " + studentBacklogs
                                + " active backlog(s), but this company does not allow backlogs."
                );
            }

        } else {

            Integer maximumAllowed =
                    company.getMaximumAllowedBacklogs();

            if (maximumAllowed == null) {

                return CompanyEligibilityResult.notEligible(
                        "The maximum allowed backlog limit has not been configured for this company drive."
                );
            }

            if (studentBacklogs > maximumAllowed) {

                return CompanyEligibilityResult.notEligible(
                        "You have " + studentBacklogs
                                + " backlog(s), but this company allows a maximum of "
                                + maximumAllowed + " backlog(s)."
                );
            }
        }


        // ============================================================
        // 7. GENDER
        // ============================================================

        GenderEligibility requiredGender =
                company.getGenderEligibility();

        if (requiredGender != null &&
                requiredGender != GenderEligibility.ALL) {

            if (student.getGender() == null) {
                return CompanyEligibilityResult.notEligible(
                        "Your gender is not available in your profile."
                );
            }

            if (!requiredGender.name()
                    .equals(student.getGender().name())) {

                return CompanyEligibilityResult.notEligible(
                        "Your gender (" + student.getGender()
                                + ") does not meet this company's eligibility requirement."
                );
            }
        }

        // ============================================================
        // 8. SSC
        // ============================================================

        if (company.getMinimumSscPercentage() != null) {

            if (student.getSscPercentage() == null) {

                return CompanyEligibilityResult.notEligible(
                        "Your SSC percentage is not available in your profile."
                );
            }

            if (student.getSscPercentage()
                    < company.getMinimumSscPercentage()) {

                return CompanyEligibilityResult.notEligible(
                        "Your SSC percentage is "
                                + student.getSscPercentage()
                                + "%, but the minimum required is "
                                + company.getMinimumSscPercentage() + "%."
                );
            }
        }


        // ============================================================
        // 9. INTERMEDIATE
        // ============================================================

        if (company.getMinimumInterPercentage() != null) {

            if (student.getIntermediatePercentage() == null) {

                return CompanyEligibilityResult.notEligible(
                        "Your Intermediate percentage is not available in your profile."
                );
            }

            if (student.getIntermediatePercentage()
                    < company.getMinimumInterPercentage()) {

                return CompanyEligibilityResult.notEligible(
                        "Your Intermediate percentage is "
                                + student.getIntermediatePercentage()
                                + "%, but the minimum required is "
                                + company.getMinimumInterPercentage() + "%."
                );
            }
        }


        // ============================================================
        // 10. DIPLOMA
        // ============================================================
        if (company.getMinimumDiplomaCgpa() != null) {

            if (student.getDiplomaCgpa() == null) {

                return CompanyEligibilityResult.notEligible(
                        "Your Diploma CGPA is not available in your profile."
                );
            }

            if (student.getDiplomaCgpa()
                    < company.getMinimumDiplomaCgpa()) {

                return CompanyEligibilityResult.notEligible(
                        "Your Diploma CGPA is "
                                + student.getDiplomaCgpa()
                                + ", but the minimum required CGPA is "
                                + company.getMinimumDiplomaCgpa() + "."
                );
            }
        }


        // ============================================================
        // 11. FIRST ATTEMPT
        // ============================================================

        if (Boolean.TRUE.equals(company.getFirstAttemptRequired())) {

            if (!Boolean.TRUE.equals(
                    student.getFirstAttemptInAllSemesters())) {

                return CompanyEligibilityResult.notEligible(
                        "This company requires students to have passed all semesters in their first attempt."
                );
            }
        }


        // ============================================================
        // 12. EAPCET
        // ============================================================

        if (company.getMaximumEmcetRank() != null) {

            if (student.getEntranceExam() != EntranceExam.EAPCET) {

                return CompanyEligibilityResult.notEligible(
                        "This company requires an EAPCET entrance qualification."
                );
            }

            if (student.getEntranceRank() == null) {

                return CompanyEligibilityResult.notEligible(
                        "Your EAPCET rank is not available in your profile."
                );
            }

            if (student.getEntranceRank()
                    > company.getMaximumEmcetRank()) {

                return CompanyEligibilityResult.notEligible(
                        "Your EAPCET rank is "
                                + student.getEntranceRank()
                                + ", but the maximum allowed rank is "
                                + company.getMaximumEmcetRank() + "."
                );
            }
        }


        // ============================================================
        // 13. ECET
        // ============================================================

        if (company.getMaximumEcetRank() != null) {

            if (student.getEntranceExam() != EntranceExam.ECET) {

                return CompanyEligibilityResult.notEligible(
                        "This company requires an ECET entrance qualification."
                );
            }

            if (student.getEntranceRank() == null) {

                return CompanyEligibilityResult.notEligible(
                        "Your ECET rank is not available in your profile."
                );
            }

            if (student.getEntranceRank()
                    > company.getMaximumEcetRank()) {

                return CompanyEligibilityResult.notEligible(
                        "Your ECET rank is "
                                + student.getEntranceRank()
                                + ", but the maximum allowed rank is "
                                + company.getMaximumEcetRank() + "."
                );
            }
        }


        // ============================================================
        // 14. PREVIOUS PLACEMENT
        // ============================================================
        CompanyEligibilityResult previousPlacementResult =
                validatePreviousPlacement(student, company);

        if (!previousPlacementResult.isEligible()) {
            return previousPlacementResult;
        }

        return CompanyEligibilityResult.eligible();


        // ============================================================
        // 15. ALL PASSED
        // ============================================================


    }


    private CompanyEligibilityResult validatePreviousPlacement(
            StudentProfile student,
            Company company
    ) {

        List<PlacementApplication> selectedApplications =
                placementApplicationRepository
                        .findByStudentIdAndStatus(
                                student.getId(),
                                ApplicationStatus.SELECTED
                        );


        // ------------------------------------------------------------
        // Student never selected before
        // ------------------------------------------------------------
        if (selectedApplications.isEmpty()) {
            return CompanyEligibilityResult.eligible();
        }


        // ------------------------------------------------------------
        // Already placed
        // ------------------------------------------------------------

        if (Boolean.FALSE.equals(
                company.getAllowAlreadyPlacedStudents())) {

            return CompanyEligibilityResult.notEligible(
                    "You are already placed, and this company does not allow already placed students."
            );
        }


        // ------------------------------------------------------------
        // Previous selected companies
        // ------------------------------------------------------------

        Set<Long> previousCompanyIds =
                selectedApplications.stream()
                        .map(application ->
                                application.getCompany().getId())
                        .collect(Collectors.toSet());


        Set<Long> includedCompanies =
                company.getIncludedPreviousCompanyIds();

        Set<Long> excludedCompanies =
                company.getExcludedPreviousCompanyIds();


        boolean inclusionConfigured =
                includedCompanies != null &&
                        !includedCompanies.isEmpty();

        boolean exclusionConfigured =
                excludedCompanies != null &&
                        !excludedCompanies.isEmpty();


        // ------------------------------------------------------------
        // INCLUSION
        // ------------------------------------------------------------

        if (inclusionConfigured) {

            boolean hasIncludedCompany =
                    previousCompanyIds.stream()
                            .anyMatch(
                                    includedCompanies::contains
                            );

            if (!hasIncludedCompany) {

                return CompanyEligibilityResult.notEligible(
                        "You are not eligible because none of your previous selected companies are included for this drive."
                );
            }

            // Inclusion has priority.
        }


        // ------------------------------------------------------------
        // EXCLUSION
        // ------------------------------------------------------------

        else if (exclusionConfigured) {

            boolean hasExcludedCompany =
                    previousCompanyIds.stream()
                            .anyMatch(
                                    excludedCompanies::contains
                            );

            if (hasExcludedCompany) {

                return CompanyEligibilityResult.notEligible(
                        "You are not eligible because you were previously selected by a company excluded from this drive."
                );
            }
        }


        // ------------------------------------------------------------
        // MAX PREVIOUS PACKAGE
        // ------------------------------------------------------------

        if (company.getMaximumPreviousPackage() != null) {

            BigDecimal maximumAllowed =
                    company.getMaximumPreviousPackage();

            boolean packageExceeded =
                    selectedApplications.stream()

                            .map(application ->
                                    application.getCompany()
                                            .getMaximumPackage())

                            .filter(Objects::nonNull)

                            .anyMatch(previousPackage ->
                                    previousPackage.compareTo(
                                            maximumAllowed
                                    ) > 0
                            );

            if (packageExceeded) {

                return CompanyEligibilityResult.notEligible(
                        "You are not eligible because your previous placement package exceeds "
                                + maximumAllowed + " LPA."
                );
            }
        }


        return CompanyEligibilityResult.eligible();
    }
}