import { useState } from "react";

import ResumeLanding from "../components/ResumeLanding";
import ResumeChat from "../components/ResumeChat";
import ResumePreview from "../preview/ResumePreview.jsx";

const ResumeBuilderPage = () => {
    const [step, setStep] = useState("landing");
    const [mode, setMode] = useState("");

    const handleModeSelect = (selectedMode) => {
        setMode(selectedMode);
        setStep("chat");
    };

    if (step === "landing") {
        return (
            <ResumeLanding
                onSelect={handleModeSelect}
            />
        );
    }

    if (step === "chat") {
        return (
            <ResumeChat
                mode={mode}
                onComplete={() => setStep("preview")}
            />
        );
    }

    return (
        <ResumePreview />
    );
};

export default ResumeBuilderPage;