import { getNextResponse } from "./ResumeConversationEngine";

export const handleConversationFlow = ({

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

    return getNextResponse({

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

};