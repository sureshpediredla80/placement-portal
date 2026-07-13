import {
    Box,
    Typography,
    Button,
    TextField,
} from "@mui/material";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import AppSnackbar from "../../../components/common/AppSnackbar";
import { useState ,useEffect} from "react";

import CreateSessionDialog from "../components/CreateSessionDialog";
import {
    getSessionById,
    getSessions,
    deleteSession, getUpcomingSessions,   getSessionsByDateRange,
} from "../api/coordinatorApi";

import SessionCard
    from "../components/SessionCard";
import SessionDetailsDialog
    from "../components/SessionDetailsDialog";
const CoordinatorSessionsPage = () => {
    const [filter, setFilter] =
        useState("ALL");
    const [
        openCreateDialog,
        setOpenCreateDialog,
    ] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const [
        sessions,
        setSessions,
    ] = useState([]);

    const [
        loading,
        setLoading,
    ] = useState(false);
    const [
        selectedSession,
        setSelectedSession,
    ] = useState(null);

    const [
        detailsOpen,
        setDetailsOpen,
    ] = useState(false);
    const [
        deleteDialogOpen,
        setDeleteDialogOpen,
    ] = useState(false);

    const [
        selectedSessionId,
        setSelectedSessionId,
    ] = useState(null);
    const [startDate, setStartDate] =
        useState("");

    const [endDate, setEndDate] =
        useState("");

    const handleCloseSnackbar = () => {
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
                        await getSessions();

                } else if (
                    filter === "UPCOMING"
                ) {

                    data =
                        await getUpcomingSessions();

                }

                setSessions(data.content);

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }
        };
    const handleDateRangeSearch =
        async () => {
            console.log(startDate);
            console.log(endDate);

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



                const data =
                    await getSessionsByDateRange(
                        startDate,
                        endDate
                    );

                setSessions(
                    data.content
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

        loadSessions();

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
    const handleDeleteClick =
        (sessionId) => {

            setSelectedSessionId(
                sessionId
            );

            setDeleteDialogOpen(
                true
            );
        };
    const handleDeleteSession =
        async () => {

            try {

                await deleteSession(
                    selectedSessionId
                );

                setSnackbar({
                    open: true,
                    message:
                        "Session deleted successfully",
                    severity: "success",
                });

                loadSessions();

            } catch (error) {

                setSnackbar({
                    open: true,
                    message:
                        "Failed to delete session",
                    severity: "error",
                });

            } finally {

                setDeleteDialogOpen(
                    false
                );

                setSelectedSessionId(
                    null
                );
            }
        };

    return (
        <Box sx={{ width: "100%" }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "center",
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

            <Box
                sx={{
                    mt: 2,
                    mb: 3,
                }}
            >

                <FormControl
                    size="small"
                    sx={{ minWidth: 220 }}
                >
                    <InputLabel>
                        Filter
                    </InputLabel>

                    <Select
                        value={filter}
                        label="Filter"
                        onChange={(e) =>
                            setFilter(
                                e.target.value
                            )
                        }
                    >
                        <MenuItem value="ALL">
                            All Sessions
                        </MenuItem>

                        <MenuItem value="UPCOMING">
                            Upcoming Sessions
                        </MenuItem>

                        <MenuItem value="DATE_RANGE">
                            Date Range
                        </MenuItem>

                    </Select>

                </FormControl>
                {
                    filter === "DATE_RANGE" && (
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
                                onChange={(e) => setStartDate(e.target.value)}
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
                                onChange={(e) => setEndDate(e.target.value)}
                                size="small"
                                slotProps={{
                                    inputLabel: {
                                        shrink: true,
                                    },
                                }}
                            />
                            <Button
                                variant="contained"
                                onClick={

                                    handleDateRangeSearch
                                }
                            >
                                Apply Filter
                            </Button>

                        </Box>
                    )
                }

            </Box>
            <CreateSessionDialog
                open={
                    openCreateDialog
                }
                onClose={() =>
                    setOpenCreateDialog(
                        false
                    )
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
                <Typography>
                    Loading...
                </Typography>
            ) : (
                <Box
                    mt={4}
                    sx={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fill, minmax(250px, 1fr))",
                        gap: 3,
                    }}
                >
                    {sessions.map((session) => (
                        <SessionCard
                            key={session.id}
                            session={session}
                            onViewDetails={() =>
                                handleViewDetails(session.id)
                            }
                            onDelete={
                                handleDeleteClick
                            }
                        />
                    ))}
                    <SessionDetailsDialog
                        open={detailsOpen}
                        onClose={() =>
                            setDetailsOpen(false)
                        }
                        session={
                            selectedSession
                        }
                    />
                </Box>
            )}
            <Dialog
                open={
                    deleteDialogOpen
                }
                onClose={() =>
                    setDeleteDialogOpen(
                        false
                    )
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
                            setDeleteDialogOpen(
                                false
                            )
                        }
                    >
                        Cancel
                    </Button>

                    <Button
                        color="error"
                        variant="contained"
                        onClick={
                            handleDeleteSession
                        }
                    >
                        Delete
                    </Button>

                </DialogActions>
            </Dialog>
        </Box>

    );
};

export default CoordinatorSessionsPage;