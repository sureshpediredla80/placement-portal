import { useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import ResumePreview from "../preview/ResumePreview.jsx";

import {
    handleConversationFlow,
}
    from "../conversation/handleConversationFlow";
import {
    handleProjectConfirmation,
} from "../conversation/handleProjectConfirmation";
import {
    handleCertificateConfirmation,
} from "../conversation/handleCertificateConfirmation";
import {
    handleAchievementConfirmation,
} from "../conversation/handleAchievementConfirmation";

import { ConversationState }

    from "../constants/conversationStates";
import {
    achievementQuestions,
    skillQuestions,
}
    from "../utils/resumeQuestions";
import ResumeLoading from "./ResumeLoading";
import { generateResume } from "../api/resumeApi";

import { buildResumeRequest } from "../builders/buildResumeRequest";

import {
    Box,
    Paper,
    Typography,
    TextField,
    IconButton,
} from "@mui/material";

const ResumeChat = () => {

    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: "ai",
            text:
                "👋 Hi! Welcome to AI Resume Studio.\n\nI'm going to ask a few questions and build a professional ATS-friendly resume.\n\n💼 First, what type of resume would you like to create?\n\nExamples:\n• Java Full Stack Developer\n• Frontend Developer\n• Data Analyst",
        },
    ]);
    const [input, setInput] = useState("");



    const [conversationState, setConversationState] =
        useState(
            ConversationState.RESUME_TYPE
        );

    const [answers, setAnswers] =
        useState({});
    const [projects, setProjects] =
        useState([]);

    const [currentProject, setCurrentProject] =
        useState({});

    const [personalInfoStep, setPersonalInfoStep] =
        useState(0);
    const [educationStep, setEducationStep] =
        useState(0);
    const [experienceStep, setExperienceStep] =
        useState(0);
    const [projectStep, setProjectStep] =
        useState(0);
    const [skillStep, setSkillStep] =
        useState(0);
    const [certificateStep, setCertificateStep] =
        useState(0);

    const [certificates, setCertificates] =
        useState([]);

    const [currentCertificate, setCurrentCertificate] =
        useState({});
    const [
        achievementStep,
        setAchievementStep,
    ] = useState(0);

    const [
        achievements,
        setAchievements,
    ] = useState([]);

    const [
        currentAchievement,
        setCurrentAchievement,
    ] = useState({});
    const [generatedResume, setGeneratedResume] =
        useState("");
    const [resumeRequest, setResumeRequest] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const addAiMessage = (text) => {

        setMessages((prev) => [

            ...prev,

            {

                id: Date.now(),

                sender: "ai",

                text,

            },

        ]);

    };

    const handleSendMessage = () => {

        if (!input.trim()) return;
        /* -----------------------------
   Project Confirmation
------------------------------ */
        if (
            conversationState ===
            ConversationState.GENERATE_RESUME
        ) {

            const request =
                buildResumeRequest({

                    answers,

                    projects,

                    certificates,

                    achievements,

                });

            setResumeRequest(request);

            setLoading(true);

            generateResume(request)

                .then((response) => {
                    console.log(response.resume);

                    setGeneratedResume(
                        response.resume
                    );

                })

                .catch((error) => {

                    console.error(error);

                })

                .finally(() => {

                    setLoading(false);

                });

            return;

        }


        if (
            conversationState ===
            ConversationState.PROJECT_CONFIRMATION
        ) {

            const handled =
                handleProjectConfirmation({

                    input,

                    currentProject,

                    setProjects,

                    setCurrentProject,

                    setProjectStep,

                    setMessages,

                    setConversationState,

                    setInput,

                    skillQuestions,

                    setSkillStep,

                });

            if (handled) {

                return;

            }

        }

        if (
            conversationState ===
            ConversationState.CERTIFICATE_CONFIRMATION
        ) {

            const handled =
                handleCertificateConfirmation({

                    input,

                    currentCertificate,

                    setCertificates,

                    setCurrentCertificate,

                    setCertificateStep,

                    setMessages,

                    setConversationState,

                    setInput,

                    achievementQuestions,

                    setAchievementStep,

                });

            if (handled) {

                return;

            }

        }
        if (
            conversationState ===
            ConversationState.ACHIEVEMENT_CONFIRMATION
        ) {

            const handled =
                handleAchievementConfirmation({

                    input,

                    currentAchievement,

                    setAchievements,

                    setCurrentAchievement,

                    setAchievementStep,

                    setMessages,

                    setConversationState,

                    setInput,

                });

            if (handled) {

                return;

            }

        }

        const answer = input.trim();

        setMessages((prev) => [

            ...prev,

            {

                id: Date.now(),

                sender: "user",

                text: answer,

            },

        ]);

        const response =
            handleConversationFlow({

                conversationState,

                answer,

                answers,

                personalInfoStep,

                educationStep,

                experienceStep,

                projectStep,

                skillStep,

                certificateStep,

                achievementStep,

            });
        if (
            conversationState ===
            ConversationState.CERTIFICATES
        ) {

            setCurrentCertificate((prev) => ({

                ...prev,

                [response.answerKey]: answer,

            }));

        }
        if (response.answerKey) {

            setAnswers((prev) => ({

                ...prev,

                [response.answerKey]: answer,

            }));

        }




        if (

            conversationState ===
            ConversationState.PROJECTS

        ) {

            setCurrentProject((prev) => ({

                ...prev,

                [response.answerKey]: answer,

            }));

        }
        if (
            conversationState ===
            ConversationState.ACHIEVEMENTS
        ) {

            setCurrentAchievement((prev) => ({

                ...prev,

                [response.answerKey]:
                answer,

            }));

        }

        setConversationState(response.nextState);

        setPersonalInfoStep(
            response.nextPersonalStep
        );
        setEducationStep(
            response.nextEducationStep ?? educationStep
        );
        setExperienceStep(

            response.nextExperienceStep ??

            experienceStep

        );
        setProjectStep(

            response.nextProjectStep ??

            projectStep

        );
        setSkillStep(

            response.nextSkillStep ??

            skillStep

        );
        setCertificateStep(

            response.nextCertificateStep ??

            certificateStep

        );
        setAchievementStep(

            response.nextAchievementStep ??

            achievementStep

        );
        setInput("");

        setTimeout(() => {

            addAiMessage(response.message);

        }, 700);

    };
    if (loading) {

        return <ResumeLoading />;

    }
    if (generatedResume) {

        return (

            <ResumePreview
                resume={generatedResume}
                resumeRequest={resumeRequest}
            />

        );

    }
    return (

        <Paper
            elevation={3}
            sx={{
                height: "78vh",
                display: "flex",
                flexDirection: "column",
                borderRadius: 4,
                overflow: "hidden",
            }}
        >

            {/* Header */}

            <Box
                sx={{
                    p: 3,
                    borderBottom: "1px solid #e5e7eb",
                }}
            >

                <Typography
                    variant="h5"
                    fontWeight={700}
                >
                    AI Resume Builder
                </Typography>

                <Typography
                    color="text.secondary"
                    mt={1}
                >
                    I'll ask you a few questions and create a professional ATS-friendly resume.
                </Typography>

            </Box>

            {/* Chat Area */}

            {/* Chat Area */}

            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    p: 3,
                    bgcolor: "#fafafa",
                }}
            >

                {messages.map((message) => (

                    <Box
                        key={message.id}
                        sx={{
                            display: "flex",
                            justifyContent:
                                message.sender === "ai"
                                    ? "flex-start"
                                    : "flex-end",
                            mb: 2,
                        }}
                    >

                        <Box
                            sx={{
                                maxWidth: "75%",
                                p: 2,
                                borderRadius: 3,
                                bgcolor:
                                    message.sender === "ai"
                                        ? "#ffffff"
                                        : "#1976d2",
                                color:
                                    message.sender === "ai"
                                        ? "#222"
                                        : "#fff",
                                boxShadow: 2,
                                whiteSpace: "pre-line",
                            }}
                        >

                            <Typography>

                                {message.text}

                            </Typography>

                        </Box>

                    </Box>

                ))}

            </Box>

            <Box
                sx={{
                    borderTop: "1px solid #e5e7eb",
                    p: 2,
                    display: "flex",
                    gap: 2,
                    bgcolor: "#fff",
                }}
            >

                <TextField

                    fullWidth

                    placeholder="Type your answer..."

                    value={input}

                    onChange={(e) =>
                        setInput(e.target.value)
                    }

                    onKeyDown={(e) => {

                        if (e.key === "Enter") {

                            handleSendMessage();

                        }

                    }}

                />

                <IconButton

                    color="primary"

                    onClick={handleSendMessage}

                >

                    <SendIcon />

                </IconButton>

            </Box>
        </Paper>

    );

};

export default ResumeChat;