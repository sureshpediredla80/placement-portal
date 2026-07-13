import { Box, Typography } from "@mui/material";

const SummarySection = ({
                            summary,
                        }) => {

    if (!summary) return null;

    return (

        <Box mb={3}>

            <Typography
                sx={{
                    fontWeight: 700,
                    fontSize: 18,
                    borderBottom: "1px solid #000",
                    mb: 1,
                    pb: 0.5,
                }}
            >
                PROFESSIONAL SUMMARY
            </Typography>

            <Typography
                sx={{
                    fontSize: 14,
                    lineHeight: 1.8,
                    textAlign: "justify",
                }}
            >
                {summary}
            </Typography>

        </Box>

    );

};

export default SummarySection;