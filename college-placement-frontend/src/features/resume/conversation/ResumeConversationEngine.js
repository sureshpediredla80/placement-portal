import { ConversationState } from "../constants/conversationStates";

import {

    personalQuestions,

    educationQuestions,

    experienceQuestions,

    projectQuestions,
    skillQuestions,
    certificateQuestions,
    achievementQuestions,

} from "../utils/resumeQuestions";

export const getNextResponse = ({
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

                                }) => {

    switch (conversationState) {

        case ConversationState.RESUME_TYPE:

            return {

                nextState:
                ConversationState.PERSONAL_INFO,

                nextPersonalStep: 0,

                answerKey: "resumeType",

                message:
                    "Excellent choice! 🚀\n\n" +
                    personalQuestions[0].question,

            };

        case ConversationState.PERSONAL_INFO:

            if (
                personalInfoStep <
                personalQuestions.length - 1
            ) {

                return {

                    nextState:
                    ConversationState.PERSONAL_INFO,

                    nextPersonalStep:
                        personalInfoStep + 1,

                    answerKey:
                    personalQuestions[
                        personalInfoStep
                        ].key,

                    message:
                    personalQuestions[
                    personalInfoStep + 1
                        ].question,

                };

            }

            return {

                nextState:
                ConversationState.EDUCATION,

                nextPersonalStep:
                personalInfoStep,

                nextEducationStep: 0,

                answerKey:
                personalQuestions[
                    personalInfoStep
                    ].key,

                message:
                educationQuestions[0].question,

            };
        case ConversationState.EDUCATION:

            if (

                educationStep <
                educationQuestions.length - 1

            ) {

                return {

                    nextState:
                    ConversationState.EDUCATION,

                    nextPersonalStep:
                    personalInfoStep,

                    nextEducationStep:
                        educationStep + 1,

                    answerKey:
                    educationQuestions[
                        educationStep
                        ].key,

                    message:
                    educationQuestions[
                    educationStep + 1
                        ].question,

                };

            }
            return {

                nextState:
                ConversationState.EXPERIENCE,

                nextPersonalStep:
                personalInfoStep,

                nextEducationStep:
                educationStep,

                nextExperienceStep: 0,

                answerKey:
                educationQuestions[
                    educationStep
                    ].key,

                message:
                experienceQuestions[0].question,

            };

        case ConversationState.EXPERIENCE:

            if (experienceStep === 0) {

                const value =
                    answer.toLowerCase();

                if (

                    value.includes("fresher")

                ) {

                    return {

                        nextState:
                        ConversationState.PROJECTS,

                        nextPersonalStep:
                        personalInfoStep,

                        nextEducationStep:
                        educationStep,

                        nextExperienceStep: 0,

                        answerKey:
                        experienceQuestions[0].key,

                        message:
                        projectQuestions[0].question,

                    };

                }

                return {

                    nextState:
                    ConversationState.EXPERIENCE,

                    nextPersonalStep:
                    personalInfoStep,

                    nextEducationStep:
                    educationStep,

                    nextExperienceStep: 1,

                    answerKey:
                    experienceQuestions[0].key,

                    message:
                    experienceQuestions[1].question,

                };

            }

            if (

                experienceStep <
                experienceQuestions.length - 1

            ) {

                return {

                    nextState:
                    ConversationState.EXPERIENCE,

                    nextPersonalStep:
                    personalInfoStep,

                    nextEducationStep:
                    educationStep,

                    nextExperienceStep:
                        experienceStep + 1,

                    answerKey:
                    experienceQuestions[
                        experienceStep
                        ].key,

                    message:
                    experienceQuestions[
                    experienceStep + 1
                        ].question,

                };

            }

            return {

                nextState:
                ConversationState.PROJECTS,

                nextPersonalStep:
                personalInfoStep,

                nextEducationStep:
                educationStep,

                nextExperienceStep:
                experienceStep,

                nextProjectStep: 0,

                answerKey:
                experienceQuestions[
                    experienceStep
                    ].key,

                message:
                projectQuestions[0].question,

            };

        case ConversationState.PROJECTS:

            if (

                projectStep <

                projectQuestions.length - 1

            ) {

                return {

                    nextState:
                    ConversationState.PROJECTS,

                    nextPersonalStep:
                    personalInfoStep,

                    nextEducationStep:
                    educationStep,

                    nextExperienceStep:
                    experienceStep,

                    nextProjectStep:
                        projectStep + 1,

                    answerKey:
                    projectQuestions[
                        projectStep
                        ].key,

                    message:
                    projectQuestions[
                    projectStep + 1
                        ].question,

                };

            }

            return {

                nextState:
                ConversationState.PROJECT_CONFIRMATION,

                nextPersonalStep:
                personalInfoStep,

                nextEducationStep:
                educationStep,

                nextExperienceStep:
                experienceStep,

                nextProjectStep:
                projectStep,

                answerKey:
                projectQuestions[
                    projectStep
                    ].key,

                message:
                    "✅ Great! Your project has been captured.\n\nWould you like to add another project?\n\nReply with Yes or No.",

            };
        case ConversationState.SKILLS:

            if (

                skillStep <

                skillQuestions.length - 1

            ) {

                return {

                    nextState:
                    ConversationState.SKILLS,

                    nextPersonalStep:
                    personalInfoStep,

                    nextEducationStep:
                    educationStep,

                    nextExperienceStep:
                    experienceStep,

                    nextProjectStep:
                    projectStep,

                    nextSkillStep:
                        skillStep + 1,

                    answerKey:
                    skillQuestions[
                        skillStep
                        ].key,

                    message:
                    skillQuestions[
                    skillStep + 1
                        ].question,

                };

            }

            return {

                nextState:
                ConversationState.CERTIFICATES,

                nextPersonalStep:
                personalInfoStep,

                nextEducationStep:
                educationStep,

                nextExperienceStep:
                experienceStep,

                nextProjectStep:
                projectStep,

                nextSkillStep:
                skillStep,

                answerKey:
                skillQuestions[
                    skillStep
                    ].key,

                nextCertificateStep:0,

                message:
                certificateQuestions[0].question,

            };
        case ConversationState.CERTIFICATES:

            if (
                certificateStep <
                certificateQuestions.length - 1
            ) {

                return {

                    nextState:
                    ConversationState.CERTIFICATES,

                    nextPersonalStep:
                    personalInfoStep,

                    nextEducationStep:
                    educationStep,

                    nextExperienceStep:
                    experienceStep,

                    nextProjectStep:
                    projectStep,

                    nextSkillStep:
                    skillStep,

                    nextCertificateStep:
                        certificateStep + 1,

                    answerKey:
                    certificateQuestions[
                        certificateStep
                        ].key,

                    message:
                    certificateQuestions[
                    certificateStep + 1
                        ].question,

                };

            }

            return {

                nextState:
                ConversationState.CERTIFICATE_CONFIRMATION,

                nextPersonalStep:
                personalInfoStep,

                nextEducationStep:
                educationStep,

                nextExperienceStep:
                experienceStep,

                nextProjectStep:
                projectStep,

                nextSkillStep:
                skillStep,

                nextCertificateStep:
                certificateStep,

                answerKey:
                certificateQuestions[
                    certificateStep
                    ].key,

                message:
                    "🏆 Great!\n\nWould you like to add another certificate?\n\nReply Yes or No.",

            };
        case ConversationState.ACHIEVEMENTS:

            if (
                achievementStep <
                achievementQuestions.length - 1
            ) {

                return {

                    nextState:
                    ConversationState.ACHIEVEMENTS,

                    nextPersonalStep:
                    personalInfoStep,

                    nextEducationStep:
                    educationStep,

                    nextExperienceStep:
                    experienceStep,

                    nextProjectStep:
                    projectStep,

                    nextSkillStep:
                    skillStep,

                    nextCertificateStep:
                    certificateStep,

                    nextAchievementStep:
                        achievementStep + 1,

                    answerKey:
                    achievementQuestions[
                        achievementStep
                        ].key,

                    message:
                    achievementQuestions[
                    achievementStep + 1
                        ].question,

                };

            }

            return {

                nextState:
                ConversationState.ACHIEVEMENT_CONFIRMATION,

                nextPersonalStep:
                personalInfoStep,

                nextEducationStep:
                educationStep,

                nextExperienceStep:
                experienceStep,

                nextProjectStep:
                projectStep,

                nextSkillStep:
                skillStep,

                nextCertificateStep:
                certificateStep,

                nextAchievementStep:
                achievementStep,

                answerKey:
                achievementQuestions[
                    achievementStep
                    ].key,

                message:
                    "🏅 Great!\n\nWould you like to add another achievement?\n\nReply with Yes or No.",

            };
        case ConversationState.TARGET_COMPANY:

            return {

                nextState:
                ConversationState.JOB_DESCRIPTION,

                nextPersonalStep:
                personalInfoStep,

                nextEducationStep:
                educationStep,

                nextExperienceStep:
                experienceStep,

                nextProjectStep:
                projectStep,

                nextSkillStep:
                skillStep,

                nextCertificateStep:
                certificateStep,

                nextAchievementStep:
                achievementStep,

                answerKey:
                    "targetCompany",

                message:
                    "📄 Paste the Job Description here.\n\nIf you don't have one, type Skip.",

            };

        case ConversationState.JOB_DESCRIPTION:

            return {

                nextState:
                ConversationState.GENERATE_RESUME,

                nextPersonalStep:
                personalInfoStep,

                nextEducationStep:
                educationStep,

                nextExperienceStep:
                experienceStep,

                nextProjectStep:
                projectStep,

                nextSkillStep:
                skillStep,

                nextCertificateStep:
                certificateStep,

                nextAchievementStep:
                achievementStep,

                answerKey:
                    "jobDescription",

                message:
                    "✨ Perfect!\n\nI've collected all the required information.\n\nNow I'll generate your ATS-friendly resume.",

            };

        default:

            return {

                nextState:
                conversationState,

                nextPersonalStep:
                personalInfoStep,

                nextEducationStep:
                educationStep,

                nextExperienceStep:
                experienceStep,
                nextProjectStep:
                projectStep,
                nextSkillStep:
                skillStep,
                nextCertificateStep:
                certificateStep,
                nextAchievementStep:
                achievementStep,
                answerKey: null,

                message:
                    "We'll continue shortly...",

            };

    }

};