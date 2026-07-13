import { useEffect, useState } from "react";

import {
    Box,
    Typography,

    ToggleButton,
    ToggleButtonGroup,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,

} from "@mui/material";
import KeyboardArrowLeftIcon
    from "@mui/icons-material/KeyboardArrowLeft";

import KeyboardArrowRightIcon
    from "@mui/icons-material/KeyboardArrowRight";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ApplicationDetailsDialog from "../components/ApplicationDetailsDialog";

import {
    getApplications,
    getApplicationById,
} from "../api/coordinatorApi";

import IconButton from "@mui/material/IconButton";



const CoordinatorApplicationsPage = () => {
    const [page, setPage] = useState(0);
    const [size] = useState(100);
    const [totalPages, setTotalPages] = useState(0);
    const [status, setStatus] =
        useState("APPLIED");

    const [applications, setApplications] =
        useState([]);

    const [loading, setLoading] =
        useState(false);
    const [selectedApplication, setSelectedApplication] =
        useState(null);

    const [dialogOpen, setDialogOpen] =
        useState(false);
    const fetchApplications =
        async () => {
            setLoading(true);

            try {
                const response =
                    await getApplications(
                        status,
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
    }, [status, page]);
    useEffect(() => {
        setPage(0);
    }, [status]);
    const handleViewApplication = async (
        applicationId
    ) => {
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
        fontSize: "0.95rem",
        borderBottom: "none",
    };

    return (
        <Box>
            <Typography
                variant="h5"
                fontWeight={700}
            >
                Applications
            </Typography>
            <Box
                sx={{
                    mt: 2,
                    mb: 4,
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <ToggleButtonGroup
                    exclusive
                    value={status}
                    onChange={(e, value) => {
                        if (value !== null) {
                            setStatus(value);
                        }
                    }}
                    sx={{
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
                            transition:
                                "all .3s cubic-bezier(.4,0,.2,1)",

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
                        textAlign:
                            "center",
                    }}
                >
                    <CircularProgress />
                </Box>
            )}

            {!loading &&
                applications.length ===
                0 && (
                    <Typography>
                        No Applications
                        Found
                    </Typography>
                )}

            {!loading &&
                applications.length >
                0 && (
                    <TableContainer
                        component={Paper}
                        sx={{
                            mt: 3,
                            borderRadius: 3,
                            boxShadow: 3,
                        }}
                    >
                        <Table stickyHeader>

                            <TableHead>
                                <TableRow>
                                    <TableCell sx={headerStyle}>
                                        Student
                                    </TableCell>

                                    <TableCell sx={headerStyle}>
                                        Roll Number
                                    </TableCell>

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
                                        Status
                                    </TableCell>
                                    <TableCell sx={headerStyle}>
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {applications.map(
                                    (application) => (
                                        <TableRow
                                            key={application.id}
                                            hover
                                            sx={{
                                                "&:hover": {
                                                    bgcolor: "action.hover",
                                                },
                                            }}
                                        >
                                            <TableCell>
                                                {application.fullName}
                                            </TableCell>

                                            <TableCell>
                                                {application.rollNumber}
                                            </TableCell>

                                            <TableCell>
                                                {application.companyName}
                                            </TableCell>

                                            <TableCell>
                                                {application.roleOffered}
                                            </TableCell>

                                            <TableCell>
                                                ₹
                                                {(
                                                    application.packageOffered / 100000
                                                ).toFixed(1)}
                                                {" "}LPA
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
            {!loading && totalPages > 1 && (
                <Stack
                    spacing={2}
                    alignItems="center"
                    sx={{
                        mt: 3,
                        mb: 2,
                    }}
                >
                    <Pagination
                        count={totalPages}
                        page={page + 1}
                        onChange={(event, value) =>
                            setPage(value - 1)
                        }
                        color="primary"
                        shape="rounded"
                        size="large"
                        showFirstButton
                        showLastButton
                    />
                </Stack>
            )}
            <ApplicationDetailsDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                application={selectedApplication}
                onStatusUpdated={fetchApplications}
            />
        </Box>
    );
};

export default CoordinatorApplicationsPage;