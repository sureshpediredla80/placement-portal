import {
    Card,
    CardContent,
    Typography,
    Button,
    Stack,
    IconButton,
    Box,
} from "@mui/material";

import {
    Person,
    Business,
    Event,
    Delete
} from "@mui/icons-material";

const SessionCard = ({ session,onViewDetails, onDelete}) => {
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
            <CardContent
                sx={{
                    p: 2,
                    position: "relative",
                    "&:last-child": {
                        pb: 2,
                    },
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                    }}
                >
                    {onDelete && (
                        <IconButton
                            color="error"
                            onClick={() =>
                                onDelete(session.id)
                            }
                        >
                            <Delete />
                        </IconButton>
                    )}
                </Box>
                <Stack spacing={1.5}>

                    {/* Session Title */}
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            pr: 5,
                        }}
                    >
                        {session.title}
                    </Typography>

                    {/* Speaker */}
                    <Typography
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            color: "#4B5563",
                            fontSize: "0.95rem",
                            fontWeight: 500,
                        }}
                    >
                        <Person
                            fontSize="small"
                            sx={{
                                mr: 1,
                                color: "#6B7280",
                            }}
                        />
                        {session.speakerName}
                    </Typography>

                    {/* Organization */}
                    <Typography
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            color: "#374151",
                            fontSize: "0.95rem",
                            fontWeight: 500,
                        }}
                    >
                        <Business
                            fontSize="small"
                            sx={{
                                mr: 1,
                                color: "#6B7280",
                            }}
                        />
                        {session.speakerOrganization}
                    </Typography>

                    {/* Date */}
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

                        {new Date(
                            session.sessionDate
                        ).toLocaleDateString()}
                    </Typography>

                    <Button
                        variant="contained"
                        fullWidth
                        size="small"
                        sx={{
                            mt: 1,
                            py: 1,
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            textTransform: "none",
                            borderRadius: 2,
                        }}
                        onClick={
                            onViewDetails
                        }
                    >
                        View Details
                    </Button>

                </Stack>
            </CardContent>
        </Card>
    );
};

export default SessionCard;