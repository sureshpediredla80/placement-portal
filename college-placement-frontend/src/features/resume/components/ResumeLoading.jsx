import {
    Box,
    Typography,
    CircularProgress,
    Paper,
} from "@mui/material";

const ResumeLoading = () => {

    return (

        <Paper
            elevation={3}
            sx={{
                height: "80vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >

            <Box textAlign="center">

                <CircularProgress
                    size={70}
                />

                <Typography
                    mt={4}
                    variant="h5"
                    fontWeight={700}
                >
                    Building your Resume...
                </Typography>

                <Typography
                    mt={2}
                    color="text.secondary"
                >
                    AI is writing a professional ATS-friendly resume.

                </Typography>

                <Typography
                    mt={1}
                    color="text.secondary"
                >
                    This usually takes 10–30 seconds.

                </Typography>

            </Box>

        </Paper>

    );

};

export default ResumeLoading;