import { ConversationState } from "../constants/conversationStates";

import {
    isPositiveAnswer,
    isNegativeAnswer,
} from "./conversationHelpers";

export const handleAchievementConfirmation = ({
                                                  input,
                                                  currentAchievement,
                                                  setAchievements,
                                                  setCurrentAchievement,
                                                  setAchievementStep,
                                                  setMessages,
                                                  setConversationState,
                                                  setInput,
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

        setAchievements((prev) => [

            ...prev,

            currentAchievement,

        ]);

        setCurrentAchievement({});

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
                    "🏅 What's your achievement title?",

            },

        ]);

        setConversationState(
            ConversationState.ACHIEVEMENTS
        );

        setInput("");

        return true;

    }

    /* NO */

    setAchievements((prev) => [

        ...prev,

        currentAchievement,

    ]);

    setCurrentAchievement({});

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
                "🎯 Which company are you targeting with this resume?\n\nExample:\nGoogle\nMicrosoft\nAmazon\nTCS",

        },

    ]);

    setConversationState(
        ConversationState.TARGET_COMPANY
    );

    setInput("");

    return true;

};