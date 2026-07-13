import {
    Box,
    Typography,
    Button,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Grid,
    CircularProgress,
    IconButton,
} from "@mui/material";
import KeyboardArrowLeftIcon
    from "@mui/icons-material/KeyboardArrowLeft";

import KeyboardArrowRightIcon
    from "@mui/icons-material/KeyboardArrowRight";
import AppSnackbar from "../../../components/common/AppSnackbar";
import { useState, useEffect } from "react";

import {
    getSessionById,
    getSessions,
    getUpcomingSessions,
    getSessionsByDateRange,
} from "../../coordinators/api/coordinatorApi";

import SessionCard from "../../coordinators/components/SessionCard";

import SessionDetailsDialog from "../../coordinators/components/SessionDetailsDialog";

const StudentSessionsPage = () => {
    const [page, setPage] =
        useState(0);

    const [size] =
        useState(6);

    const [totalPages, setTotalPages] =
        useState(0);
    const [filter, setFilter] =
        useState("ALL");

    const [snackbar, setSnackbar] =
        useState({
            open: false,
            message: "",
            severity: "success",
        });

    const [sessions, setSessions] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [
        selectedSession,
        setSelectedSession,
    ] = useState(null);

    const [
        detailsOpen,
        setDetailsOpen,
    ] = useState(false);

    const [startDate, setStartDate] =
        useState("");

    const [endDate, setEndDate] =
        useState("");

    const handleCloseSnackbar =
        () => {
            setSnackbar((prev) => ({
                ...prev,
                open: false,
            }));
        };

    const loadSessions =
        async () => {
            try {
                setLoading(true);

                let data;

                if (filter === "ALL") {
                    data =
                        await getSessions(
                            page,
                            size
                        );
                } else if (
                    filter === "UPCOMING"
                ) {
                    data =
                        await getUpcomingSessions(
                            page,
                            size
                        );
                } else {
                    return;
                }

                setSessions(
                    data.content || []
                );

                setTotalPages(
                    data.totalPages || 0
                );
            } catch (error) {
                console.error(error);

                setSnackbar({
                    open: true,
                    message:
                        "Failed to load sessions",
                    severity: "error",
                });
            } finally {
                setLoading(false);
            }
        };

    const handleDateRangeSearch =
        async () => {
            if (
                !startDate ||
                !endDate
            ) {
                setSnackbar({
                    open: true,
                    message:
                        "Please select start and end dates",
                    severity: "warning",
                });

                return;
            }

            try {
                setLoading(true);
                setPage(0);
                const data =
                    await getSessionsByDateRange(
                        startDate,
                        endDate,
                        page,
                        size
                    );

                setSessions(
                    data.content || []
                );

                setTotalPages(
                    data.totalPages || 0
                );
            } catch (error) {
                console.error(error);

                setSnackbar({
                    open: true,
                    message:
                        "Failed to fetch sessions",
                    severity: "error",
                });
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        if (
            filter === "ALL" ||
            filter === "UPCOMING"
        ) {
            loadSessions();
        }
    }, [filter, page]);
    useEffect(() => {

        setPage(0);

        if (filter !== "DATE_RANGE") {

            setStartDate("");

            setEndDate("");

        }

    }, [filter]);

    const handleViewDetails =
        async (sessionId) => {
            try {
                const data =
                    await getSessionById(
                        sessionId
                    );

                setSelectedSession(
                    data
                );

                setDetailsOpen(
                    true
                );
            } catch (error) {
                console.error(error);

                setSnackbar({
                    open: true,
                    message:
                        "Failed to load session details",
                    severity: "error",
                });
            }
        };

    return (
        <Box sx={{ width: "100%" }}>
            <Box
                sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    backgroundColor: "rgba(245,247,251,.9)",
                    backdropFilter: "blur(12px)",
                    borderBottom: "1px solid #e6eaf0",
                    pb: 2,
                    pt: 1,
                }}
            >

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3,
                    }}
                >

                    <Typography
                        variant="h4"
                        fontWeight={700}
                    >
                        Sessions
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
                            backgroundColor: "#F5F7FA",
                            borderRadius: "14px",
                            p: "4px",

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
                                },
                            },

                            "& .Mui-selected": {
                                backgroundColor:
                                    "#1976d2 !important",
                                color:
                                    "#fff !important",
                                boxShadow:
                                    "0 8px 20px rgba(25,118,210,.30)",
                            },
                        }}
                    >

                        <ToggleButton value="ALL">
                            All Sessions
                        </ToggleButton>

                        <ToggleButton value="UPCOMING">
                            Upcoming
                        </ToggleButton>

                        <ToggleButton value="DATE_RANGE">
                            Date Range
                        </ToggleButton>

                    </ToggleButtonGroup>


                </Box>
                {filter === "DATE_RANGE" && (
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            mt: 2,
                            alignItems: "center",
                            flexWrap: "wrap",
                        }}
                    >
                        <TextField
                            label="Start Date"
                            type="datetime-local"
                            value={startDate}
                            onChange={(e) =>
                                setStartDate(e.target.value)
                            }
                            size="small"
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                        />

                        <TextField
                            label="End Date"
                            type="datetime-local"
                            value={endDate}
                            onChange={(e) =>
                                setEndDate(e.target.value)
                            }
                            size="small"
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                        />

                        <Button
                            variant="contained"
                            onClick={handleDateRangeSearch}
                        >
                            Apply Filter
                        </Button>
                    </Box>
                )}
            </Box>

            <AppSnackbar
                open={snackbar.open}
                message={
                    snackbar.message
                }
                severity={
                    snackbar.severity
                }
                onClose={
                    handleCloseSnackbar
                }
            />

            {loading ? (
                <Box
                    sx={{
                        textAlign: "center",
                        mt: 6,
                    }}
                >
                    <CircularProgress />
                </Box>
            ) : sessions.length > 0 ? (
                <Box
                    sx={{
                        mt: 3,
                        maxWidth: 1200,
                        mx: "auto",

                        animation: "fade .25s ease",

                        "@keyframes fade": {
                            from: {
                                opacity: 0,
                                transform: "translateY(12px)",
                            },
                            to: {
                                opacity: 1,
                                transform: "translateY(0)",
                            },
                        },
                    }}
                >

                    <Grid
                        container
                        spacing={3}
                    >

                        {sessions.map((session) => (

                            <Grid
                                item
                                xs={12}
                                md={6}
                                key={session.id}
                            >

                                <SessionCard
                                    session={session}
                                    onViewDetails={() =>
                                        handleViewDetails(
                                            session.id
                                        )
                                    }
                                />

                            </Grid>

                        ))}

                    </Grid>

                </Box>
            ):null}
                {!loading &&
                    sessions.length === 0 && (

                        <Box
                            sx={{
                                textAlign: "center",
                                mt: 8,
                            }}
                        >

                            <Typography
                                variant="h6"
                                color="text.secondary"
                            >
                                No Sessions Found
                            </Typography>

                        </Box>

                    )}
                {!loading &&
                    totalPages > 1 && (
                        <>

                            {/* Left Arrow */}

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

                                    "&.Mui-disabled": {
                                        bgcolor: "#f2f2f2",
                                    },
                                }}
                            >
                                <KeyboardArrowLeftIcon
                                    fontSize="large"
                                />
                            </IconButton>

                            {/* Right Arrow */}

                            <IconButton
                                disabled={
                                    page === totalPages - 1
                                }
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

                                    "&.Mui-disabled": {
                                        bgcolor: "#f2f2f2",
                                    },
                                }}
                            >
                                <KeyboardArrowRightIcon
                                    fontSize="large"
                                />
                            </IconButton>

                        </>
                    )}

            <SessionDetailsDialog
                open={detailsOpen}
                onClose={() =>
                    setDetailsOpen(
                        false
                    )
                }
                session={
                    selectedSession
                }
            />
        </Box>
    );
};

export default StudentSessionsPage;