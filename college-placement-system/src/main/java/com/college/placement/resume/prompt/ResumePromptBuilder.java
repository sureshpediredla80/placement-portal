package com.college.placement.resume.prompt;

import com.college.placement.resume.dto.*;
import org.springframework.stereotype.Component;

@Component
public class ResumePromptBuilder {

    public String buildPrompt(ResumeGenerationRequest request) {

        StringBuilder prompt = new StringBuilder();

        buildSystemInstructions(prompt);

        buildPersonalInfo(prompt, request.getPersonalInfo());

        buildEducation(prompt, request.getEducation());

        buildExperience(prompt, request.getExperience());

        buildProjects(prompt, request.getProjects());

        buildSkills(prompt, request.getSkills());

        buildCertificates(prompt, request.getCertificates());

        buildAchievements(prompt, request.getAchievements());

        buildTargetCompany(prompt, request);
        appendFinalInstructions(prompt);
        buildJobDescription(prompt, request);

        return prompt.toString();
    }
    private void appendFinalInstructions(
            StringBuilder prompt
    ) {

        prompt.append("""

==========================================================
FINAL RESUME GENERATION RULES
==========================================================

Generate a modern ATS-friendly resume.

Use this exact order:

# Candidate Name

Contact Information

## Professional Summary

## Technical Skills

## Projects

## Education

## Certifications

## Achievements

## Experience

General Rules

• Return ONLY Markdown.

• Never return explanations.

• Never return ```markdown.

• Never return ```.

• Never invent information.

• Never invent skills.

• Never invent certifications.

• Never invent projects.

• Never invent achievements.

• Never invent companies.

• Never invent technologies.

• Ignore empty fields.

• Ignore "skip" values.

• Keep the resume concise.

• Keep the resume recruiter-friendly.

• ATS Score should be above 90.

• Use professional grammar.

• Use impactful language.

• Make the resume look like it was written by an experienced technical recruiter.

==========================================================
==========================================================
SECTION FORMAT (MANDATORY)
==========================================================

Generate ALL of these sections in the exact order.

# Candidate Name

Contact Information

## Professional Summary

Write a professional summary between 60–80 words.

Do NOT exceed 80 words.

----------------------------------------------------------

## Technical Skills

Group skills into:

Programming Languages

Frameworks

Databases

Tools

Soft Skills

----------------------------------------------------------

## Projects

This section is MANDATORY whenever project information is provided.

For EVERY project:

Display:

Project Name

Tech Stack

Role

Then write EXACTLY 3 bullet points.

Each bullet point should:

• Start with a strong action verb.

• Mention technical implementation.

• Mention problem solving.

• Mention technologies naturally.

• Be ATS friendly.

Never invent features.

Never invent technologies.

Never invent achievements.

----------------------------------------------------------

## Education

Keep concise.

----------------------------------------------------------

## Certifications

Keep one line for each certification.

----------------------------------------------------------

## Achievements

Maximum 2 bullet points.

----------------------------------------------------------

## Experience

If Fresher

Display only

Fresher

Do NOT invent experience.

==========================================================

""");

    }

    private void buildSystemInstructions(
            StringBuilder prompt
    ) {

        prompt.append("""
You are an expert ATS Resume Writer and Senior Technical Recruiter.

Your responsibility is to create a world-class professional resume.

STRICT RULES:

1. Never invent any information.

2. Never add skills that the user did not provide.

3. Never add projects.

4. Never add certifications.

5. Never add achievements.

6. Never add experience.

7. Never change dates.

8. Never change CGPA.

9. Never guess technologies.

10. Use ONLY the information provided.

11. Write powerful, recruiter-friendly content.

12. Optimize for ATS score above 90.

13. Use strong action verbs.

14. Improve grammar.

15. Improve readability.

16. Keep Professional Summary under 80 words.

17. Highlight technical strengths.

18. Keep formatting clean.

19. Return ONLY Markdown.

20. Do NOT return explanations.

21. Do NOT wrap the output inside ```markdown.

22. Do NOT wrap inside ```.

23. Start directly with the candidate name.

24. Use proper Markdown headings.

25. Use bullet points wherever appropriate.

26. Make the resume look like it was written by a professional resume writer.

================================================

""");

    }

    private void buildPersonalInfo(
            StringBuilder prompt,
            PersonalInfo info
    ) {

        if (info == null) {
            return;
        }

        prompt.append("## PERSONAL INFORMATION\n");

        prompt.append("Full Name: ")
                .append(info.getFullName())
                .append("\n");

        prompt.append("Email: ")
                .append(info.getEmail())
                .append("\n");

        prompt.append("Phone: ")
                .append(info.getPhone())
                .append("\n");

        prompt.append("Location: ")
                .append(info.getLocation())
                .append("\n");

        prompt.append("LinkedIn: ")
                .append(info.getLinkedin())
                .append("\n");

        prompt.append("GitHub: ")
                .append(info.getGithub())
                .append("\n");

        prompt.append("Portfolio: ")
                .append(info.getPortfolio())
                .append("\n\n");

    }

    private void buildEducation(
            StringBuilder prompt,
            Education education
    ) {

        if (education == null) {
            return;
        }

        prompt.append("## EDUCATION\n");

        prompt.append("College: ")
                .append(education.getCollege())
                .append("\n");

        prompt.append("Degree: ")
                .append(education.getDegree())
                .append("\n");

        prompt.append("Specialization: ")
                .append(education.getSpecialization())
                .append("\n");

        prompt.append("CGPA: ")
                .append(education.getCgpa())
                .append("\n");

        prompt.append("Graduation Year: ")
                .append(education.getGraduationYear())
                .append("\n\n");

    }

    private void buildExperience(
            StringBuilder prompt,
            Experience experience
    ) {

        if (experience == null) {
            return;
        }

        prompt.append("## EXPERIENCE\n");

        prompt.append("Experience Level: ")
                .append(experience.getExperienceLevel())
                .append("\n");

        if (experience.getCompany() != null) {

            prompt.append("Company: ")
                    .append(experience.getCompany())
                    .append("\n");

        }

        if (experience.getDesignation() != null) {

            prompt.append("Designation: ")
                    .append(experience.getDesignation())
                    .append("\n");

        }

        if (experience.getYears() != null) {

            prompt.append("Years: ")
                    .append(experience.getYears())
                    .append("\n");

        }

        if (experience.getResponsibilities() != null) {

            prompt.append("Responsibilities:\n")
                    .append(experience.getResponsibilities())
                    .append("\n");

        }

        prompt.append("If experience level is Fresher\n" +
                "\n" +
                "Print only\n" +
                "\n" +
                "Fresher\n" +
                "\n" +
                "Do not create fake internships.\n" +
                "\n" +
                "Do not create fake companies.\n" +
                "\n" +
                "Do not create fake responsibilities.");

    }

    private void buildProjects(
            StringBuilder prompt,
            java.util.List<Project> projects
    ) {

        if (projects == null || projects.isEmpty()) {
            return;
        }

        prompt.append("""

=========================
PROJECT DETAILS
=========================

""");

        for (Project project : projects) {

            prompt.append("Project Title : ")
                    .append(project.getTitle())
                    .append("\n");

            prompt.append("Project Description : ")
                    .append(project.getDescription())
                    .append("\n");

            prompt.append("Problem Solved : ")
                    .append(project.getProblem())
                    .append("\n");

            prompt.append("Solution : ")
                    .append(project.getSolution())
                    .append("\n");

            prompt.append("Role : ")
                    .append(project.getRole())
                    .append("\n");

            prompt.append("Challenges : ")
                    .append(project.getChallenges())
                    .append("\n");

            prompt.append("Technology Stack : ")
                    .append(project.getTechStack())
                    .append("\n");

            prompt.append("GitHub : ")
                    .append(project.getGithub())
                    .append("\n");

            prompt.append("Live Demo : ")
                    .append(project.getLiveDemo())
                    .append("\n\n");
        }

        prompt.append("""

Resume Writing Rules for Projects

• Create an ATS-friendly project section.

• Keep every project concise.

• Write exactly 3 professional bullet points for each project.

• Use strong action verbs.

• Highlight technical impact.

• Mention technologies naturally.

• Mention the candidate's role.

• Mention problem-solving ability.

• Never invent features.

• Never invent technologies.

• Never invent achievements.

• Never invent metrics.

• Use ONLY the information provided above.
IMPORTANT

Projects section MUST always appear in the final resume.

If projects are provided, never skip them.

Write exactly 3 bullet points per project.

Return the project in this format:

Project Name

Tech Stack: ...

Role: ...

• ...

• ...

• ...

""");
    }

    private void buildSkills(
            StringBuilder prompt,
            Skills skills
    ) {

        if (skills == null) {
            return;
        }

        prompt.append("""

=========================
TECHNICAL SKILLS
=========================

""");

        prompt.append("Programming Languages : ")
                .append(skills.getProgramming())
                .append("\n");

        prompt.append("Frameworks : ")
                .append(skills.getFrameworks())
                .append("\n");

        prompt.append("Databases : ")
                .append(skills.getDatabases())
                .append("\n");

        prompt.append("Tools : ")
                .append(skills.getTools())
                .append("\n");

        prompt.append("Soft Skills : ")
                .append(skills.getSoftSkills())
                .append("\n\n");

        prompt.append("""

Resume Writing Rules for Skills

• Never add new skills.

• Never invent technologies.

• Never add programming languages.

• Never add frameworks.

• Never add databases.

• Never add tools.

• Use ONLY the skills provided.

• Organize skills into clean ATS-friendly categories.

• Ignore empty values.
Never convert skills into paragraphs.

Display them category-wise.

Keep formatting clean.

Do not merge categories.

""");

    }

    private void buildCertificates(
            StringBuilder prompt,
            java.util.List<Certificate> certificates
    ) {

        if (certificates == null || certificates.isEmpty()) {
            return;
        }

        prompt.append("""

=========================
CERTIFICATIONS
=========================

""");

        for (Certificate certificate : certificates) {

            prompt.append("Certificate Name : ")
                    .append(certificate.getCertificateName())
                    .append("\n");

            prompt.append("Issuing Organization : ")
                    .append(certificate.getIssuingOrganization())
                    .append("\n");

            prompt.append("Issue Date : ")
                    .append(certificate.getIssueDate())
                    .append("\n");

            prompt.append("Credential ID : ")
                    .append(certificate.getCredentialId())
                    .append("\n");

            prompt.append("Certificate URL : ")
                    .append(certificate.getCertificateUrl())
                    .append("\n\n");

        }

        prompt.append("""

Resume Writing Rules for Certifications

• Include ONLY the certifications listed above.

• Never invent certifications.

• Never invent organizations.

• Never invent issue dates.

• Never invent credential IDs.

• Never invent certificate URLs.

• Improve formatting only.

• Keep each certification on one clean professional line.

• Ignore empty or "skip" values.

""");

    }
    private void buildAchievements(
            StringBuilder prompt,
            java.util.List<Achievement> achievements
    ) {

        if (achievements == null || achievements.isEmpty()) {
            return;
        }

        prompt.append("""

=========================
ACHIEVEMENTS
=========================

""");

        for (Achievement achievement : achievements) {

            prompt.append("Achievement Title : ")
                    .append(achievement.getTitle())
                    .append("\n");

            prompt.append("Achievement Description : ")
                    .append(achievement.getDescription())
                    .append("\n");

            prompt.append("Achievement Date : ")
                    .append(achievement.getDate())
                    .append("\n\n");

        }

        prompt.append("""

Resume Writing Rules for Achievements

• Include ONLY the achievements listed above.

• Do NOT create new achievements.

• Do NOT invent competitions.

• Do NOT invent rankings.

• Do NOT invent awards.

• Do NOT invent certifications.

• Improve grammar only.

• Expand the description professionally.

• Keep each achievement to 1-2 concise bullet points.

• Focus on measurable impact only if it is explicitly provided.

• Never guess numbers, rankings, or results.

• Use professional ATS-friendly language.

""");

    }

    private void buildTargetCompany(
            StringBuilder prompt,
            ResumeGenerationRequest request
    ) {

        if (request.getTargetCompany() == null ||
                request.getTargetCompany().isBlank() ||
                request.getTargetCompany().equalsIgnoreCase("skip")) {
            return;
        }

        prompt.append("""

=========================
TARGET COMPANY
=========================

Target Company :
""");

        prompt.append(request.getTargetCompany());

        prompt.append("""

Resume Writing Rules

• Tailor the resume for the target company.

• Highlight the most relevant technical skills.

• Align the professional summary with the company's expectations.

• Do NOT invent company requirements.

• Do NOT mention the company repeatedly.

• Keep the resume ATS-friendly.

""");

    }

    private void buildJobDescription(
            StringBuilder prompt,
            ResumeGenerationRequest request
    ) {

        if (request.getJobDescription() == null ||
                request.getJobDescription().isBlank() ||
                request.getJobDescription().equalsIgnoreCase("skip")) {
            return;
        }

        prompt.append("""

=========================
JOB DESCRIPTION
=========================

Job Description

""");

        prompt.append(request.getJobDescription());

        prompt.append("""

Resume Writing Rules

• Optimize the resume according to this Job Description.

• Match technical keywords naturally.

• Improve ATS score.

• Do NOT copy the Job Description.

• Do NOT fabricate experience.

• Use only the user's information.

""");

    }

}