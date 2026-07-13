import { ConversationState } from "../constants/conversationStates";

import {
    isPositiveAnswer,
    isNegativeAnswer,
} from "./conversationHelpers";

export const handleCertificateConfirmation = ({
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
                                              }) => {

    if (
        !isPositiveAnswer(input) &&
        !isNegativeAnswer(input)
    ) {

        setMessages((prev) => [

            ...prev,

            {

                id: Date.now(),

                sender: "ai",

                text:
                    "Please reply with Yes or No 😊",

            },

        ]);

        return true;

    }

    /* YES */

    if (
        isPositiveAnswer(input)
    ) {

        setCertificates((prev) => [

            ...prev,

            currentCertificate,

        ]);

        setCurrentCertificate({});

        setCertificateStep(0);

        setMessages((prev) => [

            ...prev,

            {

                id: Date.now(),

                sender: "user",

                text: input,

            },

            {

                id: Date.now() + 1,

                sender: "ai",

                text:
                    "🏆 What's the certificate name?",

            },

        ]);

        setConversationState(
            ConversationState.CERTIFICATES
        );

        setInput("");

        return true;

    }

    /* NO */

    setCertificates((prev) => [

        ...prev,

        currentCertificate,

    ]);

    setCurrentCertificate({});

    setAchievementStep(0);

    setMessages((prev) => [

        ...prev,

        {

            id: Date.now(),

            sender: "user",

            text: input,

        },

        {

            id: Date.now() + 1,

            sender: "ai",

            text:
            achievementQuestions[0].question,

        },

    ]);

    setConversationState(
        ConversationState.ACHIEVEMENTS
    );

    setInput("");

    return true;

};