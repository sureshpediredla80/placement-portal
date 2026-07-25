package com.college.placement.resume.prompt;

import com.college.placement.resume.dto.*;
import org.springframework.stereotype.Component;

@Component
public class ResumePromptBuilder {

    public String buildPrompt(ResumeGenerationRequest request) {

        StringBuilder prompt = new StringBuilder();



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

Generate ONE complete ATS-friendly resume in Markdown.

The Markdown you generate will be rendered directly in the frontend.

Do NOT assume any frontend templates.

Do NOT rely on frontend section rendering.

Return the complete resume exactly as it should appear to a recruiter.

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
==========================================================
FINAL OUTPUT FORMAT
==========================================================

Return ONE complete professional resume in Markdown.

The Markdown itself is the final resume.

Use proper Markdown formatting.

Example structure:

# Full Name

Email | Phone | City

LinkedIn | GitHub | Portfolio

## Professional Summary

(60-80 words)

## Technical Skills

**Programming Languages**
Java, Python

**Frameworks**
React, Spring Boot

**Databases**
MySQL

**Tools**
Git, Docker

**Soft Skills**
Communication, Leadership

## Projects

### Project Name

**Tech Stack:** React, Spring Boot

**Role:** Full Stack Developer

- Bullet Point 1

- Bullet Point 2

- Bullet Point 3

## Education

Bachelor of Technology

College Name

CGPA

Graduation Year

## Certifications

- Certificate Name — Organization (Date)

## Achievements

- Achievement 1

- Achievement 2

## Experience

If Fresher

Print only

Fresher

Do not invent internships.

Do not invent companies.

Do not invent experience.

==========================================================
IMPORTANT

If any value is

Skip

skip

SKIP

N/A

NA

null

empty

""

Do NOT display it anywhere in the resume.

Never print empty labels.

Never print

GitHub : Skip

Portfolio : Skip

LinkedIn : Skip

Instead completely remove those fields.
================================================

==========================================================
REGENERATION RULES (VERY IMPORTANT)
==========================================================

Every time this resume is generated or regenerated:

Rewrite ONLY the wording.

Do NOT rewrite the structure.

Do NOT remove any section.

Do NOT add any section.

Do NOT change the section order.

Do NOT rename headings.

Do NOT change formatting.

Keep exactly the same Markdown structure.

The only thing allowed to change is:

• wording
• sentence quality
• grammar
• readability
• ATS optimization

Everything else must remain identical.

==========================================================
==========================================================
STRICT VALIDATION CHECKLIST
==========================================================

Before returning the resume verify:

✓ Name preserved

✓ Contact preserved

✓ Professional Summary exists

✓ Technical Skills exists

✓ Projects exists if project list is not empty

✓ Education exists

✓ Certifications exists if certificates are provided

✓ Achievements exists if achievements are provided

✓ Experience exists

If any mandatory section is missing,

REGENERATE THE RESPONSE INTERNALLY

until every section is present.

Never return an incomplete resume.

Return ONLY the final Markdown.

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

Projects section is MANDATORY.

If at least ONE project is provided:

You MUST include the Projects section.

Never omit it.

Never summarize it into one paragraph.

Never merge it into Professional Summary.

For every project display:

Project Name

Tech Stack

Role

Exactly THREE bullet points.

Never produce two bullet points.

Never produce four bullet points.

Never omit the project.

Never invent additional projects.

Use ONLY the information provided.

This rule is mandatory.
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

Return the project exactly like this:

### Project Name

**Tech Stack:** React, Spring Boot

**Role:** Full Stack Developer

- Designed ...

- Developed ...

- Implemented ...

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