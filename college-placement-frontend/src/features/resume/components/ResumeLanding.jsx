import {
    Box,
    Typography,
    Card,
    CardActionArea,
    Stack,
} from "@mui/material";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import WorkOutlinedIcon from "@mui/icons-material/WorkOutlined";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const options = [
    {
        title: "Build New Resume",
        description:
            "Create a professional ATS-friendly resume from scratch.",
        icon: <AutoAwesomeIcon sx={{ fontSize: 42 }} />,
        value: "NEW",
    },
    {
        title: "Tailor Resume",
        description:
            "Customize your resume for a specific company or job role.",
        icon: <WorkOutlinedIcon sx={{ fontSize: 42 }} />,
        value: "TAILOR",
    },
    {
        title: "Improve Resume",
        description:
            "Receive AI suggestions to improve your existing resume.",
        icon: <UpgradeIcon sx={{ fontSize: 42 }} />,
        value: "IMPROVE",
    },
    {
        title: "Import Resume",
        description:
            "Upload an existing resume and continue editing.",
        icon: <UploadFileIcon sx={{ fontSize: 42 }} />,
        value: "IMPORT",
    },
];

const ResumeLanding = ({ onSelect }) => {
    return (
        <Box
            sx={{
                minHeight: "80vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                pt: 8,      // heading top nundi down spacing
                px: 3,
            }}
        >
            <Box sx={{ maxWidth: 1100, width: "100%" }}>
                <Typography
                    variant="h3"
                    fontWeight={700}
                    textAlign="center"
                    mb={1}
                >
                    AI Resume Studio
                </Typography>

                <Typography
                    textAlign="center"
                    color="text.secondary"
                >
                    Build powerful ATS-friendly resumes with AI guidance.
                </Typography>

                <Box sx={{ mt: 8 }}>
                    <Stack
                        direction="row"
                        flexWrap="wrap"
                        justifyContent="center"
                        spacing={4}
                    >
                    {options.map((item) => (
                        <Card
                            key={item.value}
                            sx={{
                                width: 235,
                                borderRadius: 4,
                                border: "1px solid",
                                borderColor: "grey.200",
                                boxShadow: 2,
                                transition: "0.3s ease",
                                "&:hover": {
                                    transform: "translateY(-8px)",
                                    boxShadow: 10,
                                },
                            }}
                        >
                            <CardActionArea
                                sx={{
                                    p: 4,
                                    height: 250,
                                }}
                                onClick={() => onSelect(item.value)}
                            >
                                <Box
                                    display="flex"
                                    justifyContent="center"
                                    mb={3}
                                >
                                    {item.icon}
                                </Box>

                                <Typography
                                    textAlign="center"
                                    fontWeight={700}
                                    mb={2}
                                >
                                    {item.title}
                                </Typography>

                                <Typography
                                    textAlign="center"
                                    color="text.secondary"
                                    fontSize={14}
                                >
                                    {item.description}
                                </Typography>
                            </CardActionArea>
                        </Card>
                    ))}
                </Stack>
                </Box>
            </Box>
        </Box>
    );
};

export default ResumeLanding;