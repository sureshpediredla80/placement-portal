import { Box } from "@mui/material";
import ResumeToolbar
    from "../components/ResumeToolbar";
import ResumeHeader from "./components/ResumeHeader";
import SummarySection from "./components/SummarySection";
import SkillsSection from "./components/SkillsSection";
import ProjectsSection from "./components/ProjectsSection";
import EducationSection from "./components/EducationSection";
import ExperienceSection from "./components/ExperienceSection";
import CertificatesSection from "./components/CertificatesSection";
import AchievementsSection from "./components/AchievementsSection";
import { useRef } from "react";
import html2pdf from "html2pdf.js";
import { extractSection } from "../utils/resumeParser";
import {
    printStyles,
    resumeContainerStyle,
} from "./styles/resumeStyles";

const ResumePreview = ({
                           resume,
                           resumeRequest,
                       }) => {
    const resumeRef = useRef(null);

    const handlePrint = () => {

        window.print();

    };
    const summary = extractSection(
        resume,
        "Professional Summary"
    );

    const projects = extractSection(
        resume,
        "Projects"
    );

    const achievements = extractSection(
        resume,
        "Achievements"
    );

    const experience = extractSection(
        resume,
        "Experience"
    );
    const handleDownload = () => {

        const options = {

            margin: 0,

            filename: `${resumeRequest.personalInfo.fullName}_Resume.pdf`,

            image: {
                type: "jpeg",
                quality: 1,
            },

            html2canvas: {

                scale: 2,

                useCORS: true,

            },

            jsPDF: {

                unit: "mm",

                format: "a4",

                orientation: "portrait",

            },

            pagebreak: {

                mode: [
                    "css",
                    "legacy",
                ],

            },

        };

        html2pdf()

            .set(options)

            .from(resumeRef.current)

            .save();

    };

    return (

        <Box
            ref={resumeRef}
            sx={{

                ...resumeContainerStyle,

                ...printStyles,

            }}

        >
            <ResumeToolbar

                onDownload={handleDownload}

                onPrint={handlePrint}

                onBack={() => {}}

                onRegenerate={() => {}}

            />
            <ResumeHeader
                personalInfo={resumeRequest.personalInfo}
                resumeType={resumeRequest.resumeType}
            />

            <SummarySection
                summary={summary}
            />

            <SkillsSection
                skills={resumeRequest.skills}
            />

            <ProjectsSection
                projects={resumeRequest.projects}
                aiContent={projects}
            />

            <EducationSection
                education={resumeRequest.education}
            />

            <ExperienceSection
                experience={resumeRequest.experience}
                aiContent={experience}
            />

            <CertificatesSection
                certificates={resumeRequest.certificates}
            />

            <AchievementsSection
                achievements={resumeRequest.achievements}
                aiContent={achievements}
            />

        </Box>

    );

};

export default ResumePreview;