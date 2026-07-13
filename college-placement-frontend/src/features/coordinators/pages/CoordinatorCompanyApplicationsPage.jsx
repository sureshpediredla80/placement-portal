import {
    Box,
    Typography,
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
    IconButton,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
    getApplicationsByCompany,
    getApplicationById,
} from "../api/coordinatorApi";

import ApplicationDetailsDialog from "../components/ApplicationDetailsDialog";

const CoordinatorCompanyApplicationsPage = () => {
    const { id } = useParams();

    const [status, setStatus] =
        useState("APPLIED");

    const [applications, setApplications] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [dialogOpen, setDialogOpen] =
        useState(false);

    const [selectedApplication, setSelectedApplication] =
        useState(null);

    const fetchApplications = async () => {
        setLoading(true);

        try {
            const response =
                await getApplicationsByCompany(
                    id,
                    status
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
        fetchApplications();
    }, [id, status]);

    const handleViewApplication =
        async (applicationId) => {
            try {
                const response =
                    await getApplicationById(
                        applicationId
                    );

                setSelectedApplication(
                    response
                );

                setDialogOpen(true);
            } catch (error) {
                console.error(error);
            }
        };

    const headerStyle = {
        fontWeight: 700,
        bgcolor: "primary.main",
        color: "white",
    };

    return (
        <Box>
            <Typography
                variant="h5"
                fontWeight={700}
                mb={3}
            >
                Company Applications
            </Typography>

            <FormControl
                size="small"
                sx={{ minWidth: 220,mt:2,mb:3, }}
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

            {loading ? (
                <Box sx={{ mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer
                    component={Paper}
                    sx={{
                        mt: 3,
                        borderRadius: 3,
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={headerStyle}>
                                    Student
                                </TableCell>

                                <TableCell sx={headerStyle}>
                                    Roll Number
                                </TableCell>

                                <TableCell sx={headerStyle}>
                                    Role
                                </TableCell>

                                <TableCell sx={headerStyle}>
                                    Package
                                </TableCell>

                                <TableCell sx={headerStyle}>
                                    Status
                                </TableCell>

                                <TableCell sx={headerStyle}>
                                    Actions
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
                                                application.fullName
                                            }
                                        </TableCell>

                                        <TableCell>
                                            {
                                                application.rollNumber
                                            }
                                        </TableCell>

                                        <TableCell>
                                            {
                                                application.roleOffered
                                            }
                                        </TableCell>

                                        <TableCell>
                                            ₹
                                            {application.packageOffered}
                                            {" "}
                                            LPA
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                label={
                                                    application.status
                                                }
                                                color="primary"
                                                size="small"
                                            />
                                        </TableCell>

                                        <TableCell>
                                            <IconButton
                                                color="primary"
                                                onClick={() =>
                                                    handleViewApplication(
                                                        application.id
                                                    )
                                                }
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <ApplicationDetailsDialog
                open={dialogOpen}
                onClose={() =>
                    setDialogOpen(false)
                }
                application={
                    selectedApplication
                }
                onStatusUpdated={
                    fetchApplications
                }
            />
        </Box>
    );
};

export default CoordinatorCompanyApplicationsPage;