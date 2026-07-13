import {
    Card,
    CardContent,
    Typography,
    Button,
    Stack,
    Box,
} from "@mui/material";

import {
    Work,
    CurrencyRupee,
    Event,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

const CompanyCard = ({ company }) => {
    const navigate = useNavigate();

    const packageLpa = `${(
        company.packageOffered / 100000
    ).toFixed(1)} LPA`;

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
                    {/* Company Name */}
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            fontSize: "1.15rem",
                            letterSpacing: "0.2px",
                            color: "#1F2937",
                        }}
                    >
                        {company.companyName}
                    </Typography>

                    {/* Role */}
                    <Typography
                        sx={{
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
                        {company.roleOffered}
                    </Typography>

                    {/* Package */}
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
                        {packageLpa}
                    </Typography>

                    {/* Deadline */}
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
                            Deadline :
                        </Box>

                        &nbsp;
                        {new Date(
                            company.applyDeadline
                        ).toLocaleDateString()}
                    </Typography>

                    <Button
                        variant="contained"
                        fullWidth
                        onClick={() =>
                            navigate(
                                `/admin/companies/${company.id}`
                            )
                        }
                        sx={{
                            mt: 1,
                            fontWeight: 600,
                            textTransform: "none",
                            borderRadius: 2,
                        }}
                    >
                        View Details
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default CompanyCard;