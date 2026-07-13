import {
    Card,
    CardContent,
    Typography,
    Button,
    Stack,
    Box,
    Chip,
} from "@mui/material";

import {
    Category,
    SignalCellularAlt,
    Event,
} from "@mui/icons-material";

const TopicCard = ({ topic ,onViewDetails}) => {
    return (
        <Card
            sx={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 3,
                height: "100%",
                transition: "all .3s ease",
                cursor: "pointer",

                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 0,
                    height: "4px",
                    background:
                        "linear-gradient(90deg, #1976d2, #42a5f5)",
                    transition: "width .35s ease",
                },

                "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 16px 30px rgba(0,0,0,.12)",
                    filter: "brightness(1.02)",
                },

                "&:hover::before": {
                    width: "100%",
                },
                "&:hover .company-title": {
                    color: "#1976d2",
                },
            }}
        >
            <CardContent>
                <Stack spacing={2}>

                    {/* Title + Global */}

                    <Box
                        sx={{
                            position: "relative",
                            mb: 2,
                        }}
                    >
                        <Typography
                            variant="h6"
                            className="company-title"
                            sx={{
                                fontWeight: 700,
                                fontSize: "1.15rem",
                                color: "#1F2937",
                                pr: 8,
                            }}
                        >
                            {topic.title}
                        </Typography>

                        {topic.isGlobal && (
                            <Chip
                                label="Global"
                                color="primary"
                                size="small"
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                }}
                            />
                        )}
                    </Box>
                    {/* Category */}
                    <Typography
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            color: "#374151",
                            fontSize: "0.95rem",
                            fontWeight: 500,
                        }}
                    >
                        <Category
                            fontSize="small"
                            sx={{
                                mr: 1,
                                color: "#6B7280",
                            }}
                        />

                        <Box
                            component="span"
                            sx={{
                                fontWeight: 600,
                            }}
                        >
                            Category :
                        </Box>

                        &nbsp;
                        {topic.category}
                    </Typography>

                    {/* Difficulty */}
                    <Typography
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            color: "#374151",
                            fontSize: "0.95rem",
                            fontWeight: 500,
                        }}
                    >
                        <SignalCellularAlt
                            fontSize="small"
                            sx={{
                                mr: 1,
                                color: "#6B7280",
                            }}
                        />

                        <Box
                            component="span"
                            sx={{
                                fontWeight: 600,
                            }}
                        >
                            Difficulty :
                        </Box>

                        &nbsp;
                        {topic.difficultyLevel}
                    </Typography>

                    {/* Created Date */}
                    <Typography
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            color: "#374151",
                            fontSize: "0.95rem",
                            fontWeight: 500,
                        }}
                    >
                        <Event
                            fontSize="small"
                            sx={{
                                mr: 1,
                                color: "#6B7280",
                            }}
                        />

                        <Box
                            component="span"
                            sx={{
                                fontWeight: 600,
                            }}
                        >
                            Created :
                        </Box>

                        &nbsp;
                        {new Date(
                            topic.createdAt
                        ).toLocaleDateString()}
                    </Typography>

                    <Button
                        variant="contained"
                        fullWidth
                        sx={{
                            mt: 1,
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            textTransform: "none",
                            borderRadius: 2,
                        }}
                        onClick={() =>
                            onViewDetails(
                                topic.id
                            )
                        }
                    >
                        View Details
                    </Button>

                </Stack>
            </CardContent>
        </Card>
    );
};

export default TopicCard;