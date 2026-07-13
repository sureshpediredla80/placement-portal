import { Box } from "@mui/material";
import ResumeChat from "../components/ResumeChat";

const ResumeChatPage = () => {

    return (

        <Box
            sx={{
                maxWidth: 900,
                mx: "auto",
                py: 4,
                px: 2,
            }}
        >

            <ResumeChat />

        </Box>

    );

};

export default ResumeChatPage;