import {
    Card,
    CardContent,
    Typography,
    Chip,
    Stack,
    Box,
} from "@mui/material";

import {
    Work,
    CurrencyRupee,
    Event,
} from "@mui/icons-material";

const ApplicationCard = ({ application }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case "SELECTED":
                return "success";

            case "REJECTED":
                return "error";

            case "SHORTLISTED":
                return "warning";

            default:
                return "primary";
        }
    };

    return (
        <Card
            elevation={3}
            sx={{
                borderRadius: 3,
                height: "100%",
            }}
        >
            <CardContent>
                <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                        fontWeight: 700,
                        fontSize: "1.15rem",
                        letterSpacing: "0.2px",
                        color: "#1F2937",
                    }}
                >
                    {application.companyName}
                </Typography>

                <Typography
                    sx={{
                        mb: 2,
                        display: "flex",
                        alignItems: "center",
                        color: "#4B5563",
                        fontSize: "0.95rem",
                        fontWeight: 500,
                    }}
                >
                    <Work
                        fontSize="small"
                        sx={{
                            mr: 1,
                            color: "#6B7280",
                        }}
                    />
                    {application.roleOffered}
                </Typography>

                <Stack spacing={1.5}>
                    <Typography
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: "0.95rem",
                            color: "#374151",
                            fontWeight: 500,
                        }}
                    >
                        <CurrencyRupee
                            fontSize="small"
                            sx={{
                                mr: 1,
                                color: "#10B981",
                            }}
                        />

                        <Box
                            component="span"
                            sx={{
                                fontWeight: 600,
                            }}
                        >
                            Package :
                        </Box>

                        &nbsp;
                        {(application.packageOffered / 100000).toFixed(1)}
                        &nbsp;LPA
                    </Typography>

                    <Typography
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: "0.95rem",
                            color: "#374151",
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
                            Applied :
                        </Box>

                        &nbsp;
                        {new Date(
                            application.applicationDate
                        ).toLocaleDateString()}
                    </Typography>

                    <Typography
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: "0.95rem",
                            color: "#374151",
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
                            Drive :
                        </Box>

                        &nbsp;
                        {new Date(
                            application.driveDate
                        ).toLocaleDateString()}
                    </Typography>
                </Stack>

                <Box  sx={{
                    mt:1,
                    pt: 1,

                }}>
                    <Chip
                        label={application.status}
                        color={getStatusColor(
                            application.status
                        )}
                        sx={{
                            fontWeight: 700,
                            letterSpacing: "0.4px",
                        }}
                    />
                </Box>
            </CardContent>
        </Card>
    );
};

export default ApplicationCard;