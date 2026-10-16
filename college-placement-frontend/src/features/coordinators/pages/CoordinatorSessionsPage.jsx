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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import { useState, useEffect } from "react";

import AppSnackbar from "../../../components/common/AppSnackbar";

import CreateSessionDialog from "../components/CreateSessionDialog";

import SessionCard from "../components/SessionCard";

import SessionDetailsDialog from "../components/SessionDetailsDialog";

import {
    getSessions,
    getUpcomingSessions,
    getSessionsByDateRange,
    getSessionById,
    deleteSession,
} from "../api/coordinatorApi";

const CoordinatorSessionsPage = () => {

    // ---------------- Pagination ----------------

    const [page, setPage] = useState(0);

    const [size] = useState(9);

    const [totalPages, setTotalPages] = useState(0);

    // ---------------- Filter ----------------

    const [filter, setFilter] = useState("ALL");

    // ---------------- Dialogs ----------------

    const [openCreateDialog, setOpenCreateDialog] = useState(false);

    const [detailsOpen, setDetailsOpen] = useState(false);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // ---------------- Sessions ----------------

    const [sessions, setSessions] = useState([]);

    const [selectedSession, setSelectedSession] = useState(null);

    const [selectedSessionId, setSelectedSessionId] = useState(null);

    // ---------------- Loading ----------------

    const [loading, setLoading] = useState(false);

    // ---------------- Date Range ----------------

    const [startDate, setStartDate] = useState("");

    const [endDate, setEndDate] = useState("");

    // ---------------- Snackbar ----------------

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({
            ...prev,
            open: false,
        }));
    };
    // ===========================
    // Load Sessions
    // ===========================

    const loadSessions = async () => {

        try {

            setLoading(true);

            let data;

            if (filter === "ALL") {

                data = await getSessions(page, size);

            } else if (filter === "UPCOMING") {

                data = await getUpcomingSessions(page, size);

            } else {

                return;

            }

            setSessions(data.content || []);

            setTotalPages(data.totalPages || 0);

        } catch (error) {

            console.error(error);

            setSnackbar({
                open: true,
                message: "Failed to load sessions",
                severity: "error",
            });

        } finally {

            setLoading(false);

        }

    };

    // ===========================
    // Date Range Search
    // ===========================

    const handleDateRangeSearch = async () => {

        if (!startDate || !endDate) {

            setSnackbar({
                open: true,
                message: "Please select start and end dates",
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

            setSessions(data.content || []);

            setTotalPages(data.totalPages || 0);

        } catch (error) {

            console.error(error);

            setSnackbar({
                open: true,
                message: "Failed to fetch sessions",
                severity: "error",
            });

        } finally {

            setLoading(false);

        }

    };

    // ===========================
    // View Details
    // ===========================

    const handleViewDetails = async (sessionId) => {

        try {

            const data = await getSessionById(sessionId);

            setSelectedSession(data);

            setDetailsOpen(true);

        } catch (error) {

            console.error(error);

            setSnackbar({
                open: true,
                message: "Failed to load session details",
                severity: "error",
            });

        }

    };

    // ===========================
    // Delete Dialog
    // ===========================

    const handleDeleteClick = (sessionId) => {

        setSelectedSessionId(sessionId);

        setDeleteDialogOpen(true);

    };

    // ===========================
    // Delete Session
    // ===========================

    const handleDeleteSession = async () => {

        try {

            await deleteSession(selectedSessionId);

            setSnackbar({
                open: true,
                message: "Session deleted successfully",
                severity: "success",
            });

            loadSessions();

        } catch (error) {

            console.error(error);

            setSnackbar({
                open: true,
                message: "Failed to delete session",
                severity: "error",
            });

        } finally {

            setDeleteDialogOpen(false);

            setSelectedSessionId(null);

        }

    };

    // ===========================
    // useEffect
    // ===========================

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
    return (
        <Box sx={{ width: "100%" }}>

            {/* Header */}

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

                    <Button
                        variant="contained"
                        onClick={() =>
                            setOpenCreateDialog(true)
                        }
                    >
                        Create Session
                    </Button>

                </Box>

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

            <CreateSessionDialog
                open={openCreateDialog}
                onClose={() =>
                    setOpenCreateDialog(false)
                }
                onSuccess={() => {

                    loadSessions();

                    setSnackbar({
                        open: true,
                        message:
                            "Session created successfully",
                        severity: "success",
                    });

                }}
                onError={() => {

                    setSnackbar({
                        open: true,
                        message:
                            "Failed to create session",
                        severity: "error",
                    });

                }}
            />

            <AppSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={handleCloseSnackbar}
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
                                        handleViewDetails(session.id)
                                    }
                                    onDelete={handleDeleteClick}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            ) : (
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

                            "&.Mui-disabled": {
                                bgcolor: "#f2f2f2",
                            },
                        }}
                    >
                        <KeyboardArrowLeftIcon
                            fontSize="large"
                        />
                    </IconButton>

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
                    setDetailsOpen(false)
                }
                session={selectedSession}
            />

            <Dialog
                open={deleteDialogOpen}
                onClose={() =>
                    setDeleteDialogOpen(false)
                }
            >
                <DialogTitle>
                    Delete Session
                </DialogTitle>

                <DialogContent>
                    Are you sure you want to
                    delete this session?
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() =>
                            setDeleteDialogOpen(false)
                        }
                    >
                        Cancel
                    </Button>

                    <Button
                        color="error"
                        variant="contained"
                        onClick={handleDeleteSession}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default CoordinatorSessionsPage;