import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Box,
} from "@mui/material";

import { useEffect, useState } from "react";

import { getApplicationsByStudent } from "../api/coordinatorApi";

const StudentApplicationsDialog = ({
                                       open,
                                       onClose,
                                       studentId,
                                   }) => {
    const [status, setStatus] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [applications, setApplications] =
        useState([]);

    const fetchApplications =
        async () => {
            if (!studentId) return;

            setLoading(true);

            try {
                const response =
                    await getApplicationsByStudent(
                        studentId,
                        status || undefined
                    );

                setApplications(
                    response.content || []
                );
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        if (open) {
            fetchApplications();
        }
    }, [open, status]);

    const headerStyle = {
        fontWeight: 700,
        bgcolor: "primary.main",
        color: "white",
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="lg"
        >
            <DialogTitle>
                Application History
            </DialogTitle>

            <DialogContent
                sx={{
                    height: "70vh",
                    overflow: "hidden",
                }}>
                <Box sx={{ mb: 3, mt: 1 }}>
                    <FormControl
                        size="small"
                        sx={{ minWidth: 220 }}
                    >
                        <InputLabel>
                            Status
                        </InputLabel>

                        <Select
                            value={status}
                            label="Status"
                            onChange={(e) =>
                                setStatus(
                                    e.target.value
                                )
                            }
                        >
                            <MenuItem value="">
                                All
                            </MenuItem>

                            <MenuItem value="APPLIED">
                                Applied
                            </MenuItem>

                            <MenuItem value="SHORTLISTED">
                                Shortlisted
                            </MenuItem>

                            <MenuItem value="SELECTED">
                                Selected
                            </MenuItem>

                            <MenuItem value="REJECTED">
                                Rejected
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {loading ? (
                    <Box textAlign="center">
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableContainer
                        component={Paper}
                        sx={{
                            maxHeight: 400,
                            overflow: "auto",
                            borderRadius: 3,
                        }}
                    >
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={headerStyle}>
                                        Company
                                    </TableCell>

                                    <TableCell sx={headerStyle}>
                                        Role
                                    </TableCell>

                                    <TableCell sx={headerStyle}>
                                        Package
                                    </TableCell>

                                    <TableCell sx={headerStyle}>
                                        Applied On
                                    </TableCell>

                                    <TableCell sx={headerStyle}>
                                        Status
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {applications.map(
                                    (
                                        application
                                    ) => (
                                        <TableRow
                                            key={
                                                application.id
                                            }
                                        >
                                            <TableCell>
                                                {
                                                    application.companyName
                                                }
                                            </TableCell>

                                            <TableCell>
                                                {
                                                    application.roleOffered
                                                }
                                            </TableCell>

                                            <TableCell>
                                                ₹
                                                {
                                                    application.packageOffered
                                                }
                                                {" "}
                                                LPA
                                            </TableCell>

                                            <TableCell>
                                                {new Date(
                                                    application.applicationDate
                                                ).toLocaleDateString()}
                                            </TableCell>

                                            <TableCell>
                                                <Chip
                                                    label={
                                                        application.status
                                                    }
                                                    color={
                                                        application.status ===
                                                        "SELECTED"
                                                            ? "success"
                                                            : application.status ===
                                                            "REJECTED"
                                                                ? "error"
                                                                : application.status ===
                                                                "SHORTLISTED"
                                                                    ? "warning"
                                                                    : "primary"
                                                    }
                                                />
                                            </TableCell>
                                        </TableRow>
                                    )
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={onClose}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default StudentApplicationsDialog;