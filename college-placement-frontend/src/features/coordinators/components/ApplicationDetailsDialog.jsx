import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Typography,
    Chip,
    Divider,
    Box,
    Stack,
    CircularProgress,
} from "@mui/material";
import { useState } from "react";

import {
    shortlistApplication,
    selectApplication,
    rejectApplication,
} from "../api/coordinatorApi";
import AppSnackbar from "../../../components/common/AppSnackbar.jsx";

const DetailItem = ({ label, value }) => (
    <Grid
        item
        xs={12}
        sm={6}
        md={4}
        sx={{
            minHeight: 90,
        }}
    >
        <Typography
            variant="caption"
            sx={{
                color: "text.secondary",
                textTransform: "uppercase",
                letterSpacing: 1,
                fontWeight: 700,
                display: "block",
                mb: 1,
            }}
        >
            {label}
        </Typography>

        <Typography
            variant="h6"
            sx={{
                fontWeight: 600,
                color: "text.primary",
                lineHeight: 1.4,
            }}
        >
            {value || "-"}
        </Typography>
    </Grid>
);


const ApplicationDetailsDialog = (

    {
                                      open,
                                      onClose,
                                      application,
                                      onStatusUpdated,
                                  }) => {
    const [actionLoading, setActionLoading] =
        useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const handleStatusChange = async (action) => {
        try {
            setActionLoading(true);

            if (action === "SHORTLIST") {
                await shortlistApplication(application.id);
            }

            if (action === "SELECT") {
                await selectApplication(application.id);
            }

            if (action === "REJECT") {
                await rejectApplication(application.id);
            }

            setSnackbar({
                open: true,
                message: `Application ${action.toLowerCase()}ed successfully`,
                severity: "success",
            });

            onStatusUpdated();

            setTimeout(() => {
                onClose();
            }, 1000);

        } catch (error) {
            setSnackbar({
                open: true,
                message:
                    error?.response?.data?.message ||
                    "Something went wrong",
                severity: "error",
            });
        } finally {
            setActionLoading(false);
        }
    };
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle
                sx={{
                    fontWeight: 700,
                    fontSize: "1.8rem",
                    py: 3,
                }}
            >
                Application Details
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ py: 4}}>
                {!application ? null : (
                    <Box>
                        <Grid container spacing={4}>
                            <DetailItem
                                label="Student Name"
                                value={application.fullName}
                            />

                            <DetailItem
                                label="Roll Number"
                                value={application.rollNumber}
                            />

                            <DetailItem
                                label="Company"
                                value={application.companyName}
                            />

                            <DetailItem
                                label="Role"
                                value={application.roleOffered}
                            />

                            <DetailItem
                                label="Package"
                                value={`₹ ${application.packageOffered} LPA`}
                            />

                            <Grid
                                item
                                xs={12}
                                sm={6}
                                sx={{
                                    minHeight: 80,
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: "text.secondary",
                                        textTransform: "uppercase",
                                        letterSpacing: 1,
                                        fontWeight: 700,
                                        display: "block",
                                        mb: 1,
                                    }}
                                >
                                    Status
                                </Typography>

                                <Chip
                                    label={application.status}
                                    color="primary"
                                />
                            </Grid>

                            <DetailItem
                                label="Applied On"
                                value={new Date(
                                    application.applicationDate
                                ).toLocaleString()}
                            />

                            <DetailItem
                                label="Drive Date"
                                value={new Date(
                                    application.driveDate
                                ).toLocaleDateString()}
                            />
                        </Grid>
                    </Box>
                )}
            </DialogContent>

            <DialogActions
                sx={{
                    p: 3,
                    justifyContent: "space-between",
                }}
            >
                <Box>
                    <Typography
                        variant="subtitle2"
                        sx={{
                            mb: 1,
                            fontWeight: 600,
                        }}
                    >
                        Mark As
                    </Typography>

                    <Stack
                        direction="row"
                        spacing={1.5}
                    >
                        <Button
                            variant="outlined"
                            color="warning"
                            disabled={actionLoading}
                            onClick={() =>
                                handleStatusChange(
                                    "SHORTLIST"
                                )
                            }
                        >
                            {actionLoading ? (
                                <CircularProgress size={20} />
                            ) : (
                                "Shortlist"
                            )}
                        </Button>

                        <Button
                            variant="contained"
                            color="success"
                            disabled={actionLoading}
                            onClick={() =>
                                handleStatusChange(
                                    "SELECT"
                                )
                            }
                        >
                            {actionLoading ? (
                                <CircularProgress size={20} />
                            ) : (
                                "Select"
                            )}
                        </Button>

                        <Button
                            variant="contained"
                            color="error"
                            disabled={actionLoading}
                            onClick={() =>
                                handleStatusChange(
                                    "REJECT"
                                )
                            }
                        >
                            {actionLoading ? (
                                <CircularProgress size={20} />
                            ) : (
                                "Reject"
                            )}
                        </Button>
                    </Stack>
                </Box>

                <Button
                    variant="outlined"
                    onClick={onClose}
                    disabled={actionLoading}
                >
                    Close
                </Button>
            </DialogActions>
            <AppSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() =>
                    setSnackbar((prev) => ({
                        ...prev,
                        open: false,
                    }))
                }
            />
        </Dialog>
    );
};

export default ApplicationDetailsDialog;