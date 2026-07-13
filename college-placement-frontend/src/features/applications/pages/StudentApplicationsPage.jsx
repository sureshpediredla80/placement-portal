import { useEffect, useState } from "react";

import {
    Box,
    Typography,

    Grid,
    CircularProgress,
    ToggleButton,
    ToggleButtonGroup,
    IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { getMyApplications } from "../api/applicationApi";
import ApplicationCard from "../components/ApplicationCard";



const StudentApplicationsPage = () => {
    const [page, setPage] = useState(0);

    const [size] = useState(12);

    const [totalPages, setTotalPages] = useState(0);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState("all");
    const fetchApplications = async () => {
        setLoading(true);

        try {
            const response = await getMyApplications(
                page,
                size
            );
            setApplications(response.content || []);
            setTotalPages(response.totalPages || 0);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchApplications();
    }, [page]);
    useEffect(() => {
        setPage(0);
    }, [filter]);
    const filteredApplications =
        filter === "all"
            ? applications
            : applications.filter(
                (app) => app.status === filter
            );
    return (
        <Box>

            <Box
                sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    backgroundColor: "#f5f7fb",
                    pt: 1,
                    pb: 2,
                }}
            >
            <Typography
                variant="h5"
                fontWeight={700}>
                My Applications
            </Typography>
                <ToggleButtonGroup
                    exclusive
                    value={filter}
                    onChange={(e, value) => {
                        if (value !== null) {
                            setFilter(value);
                        }
                    }}
                    sx={{
                        mt: 2,
                        backgroundColor: "#F5F7FA",
                        borderRadius: "14px",
                        padding: "4px",

                        "& .MuiToggleButton-root": {
                            border: "none",
                            borderRadius: "10px",
                            px: 3,
                            py: 1,
                            textTransform: "none",
                            fontWeight: 600,
                            color: "#555",

                            "&:hover": {
                                backgroundColor: "#EAF2FF",
                                transform: "translateY(-2px)",
                            },
                        },

                        "& .Mui-selected": {
                            backgroundColor: "#1976d2 !important",
                            color: "#fff !important",
                            boxShadow:
                                "0 8px 20px rgba(25,118,210,.30)",
                            transform: "translateY(-2px)",
                        },
                    }}
                >
                    <ToggleButton value="all">
                        All
                    </ToggleButton>

                    <ToggleButton value="APPLIED">
                        Applied
                    </ToggleButton>

                    <ToggleButton value="SHORTLISTED">
                        Shortlisted
                    </ToggleButton>

                    <ToggleButton value="SELECTED">
                        Selected
                    </ToggleButton>

                    <ToggleButton value="REJECTED">
                        Rejected
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>
            {loading && (
                <Box
                    sx={{
                        textAlign: "center",
                        mt: 4,
                    }}
                >
                    <CircularProgress />
                </Box>
            )}
            {!loading &&
                filteredApplications.length === 0 && (
                    <Box
                        sx={{
                            textAlign:"center",
                            mt:8
                        }}
                    >

                        <SearchIcon
                            sx={{
                                fontSize:70,
                                color:"#c7c7c7"
                            }}
                        />

                        <Typography
                            variant="h6"
                            color="text.secondary"
                        >

                            No Applications found

                        </Typography>

                    </Box>
                )}
            {!loading &&
                filteredApplications.length > 0 && (
                    <Box
                        sx={{
                            mt: 2,
                            maxWidth: 1200,
                            mx: "auto",
                        }}
                    >
                        <Grid container spacing={3}>
                        {filteredApplications.map(
                            (application) => (
                                <Grid
                                    item
                                    xs={12}
                                    md={6}
                                    key={application.id}
                                >
                                    <ApplicationCard
                                        application={application}
                                    />
                                </Grid>
                            )
                        )}
                    </Grid>
                    </Box>
                )}
            {!loading && totalPages > 1 && (
                <>
                    <IconButton
                        disabled={page === 0}
                        onClick={() =>
                            setPage((prev) => prev - 1)
                        }
                        sx={{
                            position: "fixed",
                            left: 30,
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: 54,
                            height: 54,
                            borderRadius: "50%",
                            bgcolor: "white",
                            boxShadow: 3,
                            zIndex: 1000,

                            "&:hover": {
                                bgcolor: "#1976d2",
                                color: "#fff",
                            },
                        }}
                    >
                        <KeyboardArrowLeftIcon />
                    </IconButton>

                    <IconButton
                        disabled={page === totalPages - 1}
                        onClick={() =>
                            setPage((prev) => prev + 1)
                        }
                        sx={{
                            position: "fixed",
                            right: 30,
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: 54,
                            height: 54,
                            borderRadius: "50%",
                            bgcolor: "white",
                            boxShadow: 3,
                            zIndex: 1000,

                            "&:hover": {
                                bgcolor: "#1976d2",
                                color: "#fff",
                            },
                        }}
                    >
                        <KeyboardArrowRightIcon />
                    </IconButton>
                </>
            )}
        </Box>
    );
};


export default StudentApplicationsPage;