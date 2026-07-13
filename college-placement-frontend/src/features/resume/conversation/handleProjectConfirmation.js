import { ConversationState } from "../constants/conversationStates";

import {
    isPositiveAnswer,
    isNegativeAnswer,
} from "./conversationHelpers";

export const handleProjectConfirmation = ({
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

    if (
        isPositiveAnswer(input)
    ) {

        setProjects((prev) => [

            ...prev,

            currentProject,

        ]);

        setCurrentProject({});

        setProjectStep(0);

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
                    "🚀 Awesome!\n\nLet's add another project.\n\nWhat's the project name?",

            },

        ]);

        setConversationState(
            ConversationState.PROJECTS
        );

        setInput("");

        return true;

    }

    setProjects((prev) => [

        ...prev,

        currentProject,

    ]);

    setCurrentProject({});

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
            skillQuestions[0].question,

        },

    ]);

    setConversationState(
        ConversationState.SKILLS
    );

    setSkillStep?.(0);

    setInput("");

    return true;

};