import { Box, Typography } from "@mui/material";

const ResumeHeader = ({
                          personalInfo,
                          resumeType,
                      }) => {

    if (!personalInfo) return null;

    return (

        <Box
            sx={{
                borderBottom: "2px solid #222",
                pb: 2,
                mb: 3,
            }}
        >

            <Typography
                variant="h4"
                sx={{
                    fontWeight: 700,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                }}
            >
                {personalInfo.fullName}
            </Typography>

            <Typography
                sx={{
                    mt: 0.5,
                    fontSize: 17,
                    fontWeight: 600,
                }}
            >
                {resumeType}
            </Typography>

            <Typography
                sx={{
                    mt: 1,
                    fontSize: 14,
                    color: "#444",
                    lineHeight: 1.8,
                }}
            >

                {[

                    personalInfo.location,

                    personalInfo.phone,

                    personalInfo.email,

                    personalInfo.linkedin,

                    personalInfo.github,

                    personalInfo.portfolio,

                ]

                    .filter(Boolean)

                    .join(" | ")}

            </Typography>

        </Box>

    );

};

export default ResumeHeader;