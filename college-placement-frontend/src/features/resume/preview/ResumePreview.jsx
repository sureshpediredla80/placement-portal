import { Box } from "@mui/material";
import ResumeToolbar
    from "../components/ResumeToolbar";

import { useRef } from "react";
import html2pdf from "html2pdf.js";
import ReactMarkdown from "react-markdown";
import {
    printStyles,
    resumeContainerStyle,
    markdownStyles,
} from "./styles/resumeStyles";

const ResumePreview = ({
                           resume,
                           resumeRequest,
                           onRegenerate,
                           onBack,
                       }) => {
    const resumeRef = useRef(null);

    const handlePrint = () => {

        window.print();

    };

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

        <>

            <ResumeToolbar
                onDownload={handleDownload}
                onPrint={handlePrint}
                onBack={onBack}
                onRegenerate={onRegenerate}
            />

            <Box
                ref={resumeRef}
                sx={{
                    ...resumeContainerStyle,
                    ...printStyles,
                }}
            >

                <Box
                    sx={{
                        p: 5,
                        ...markdownStyles,
                    }}
                >
                    <ReactMarkdown>
                        {resume}
                    </ReactMarkdown>
                </Box>

            </Box>

        </>

    );

};

export default ResumePreview;