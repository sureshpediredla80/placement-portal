import { useEffect, useState } from "react";

import {
    Box,
    Typography,
    CircularProgress,
    Grid,
    ToggleButton,
    ToggleButtonGroup,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";

import KeyboardArrowLeftIcon
    from "@mui/icons-material/KeyboardArrowLeft";

import KeyboardArrowRightIcon
    from "@mui/icons-material/KeyboardArrowRight";
import CertificateTemplateCard from "../../certificates/components/CertificateTemplateCard";
import {
    getCertificatesByStatus,
    approveCertificate,
    rejectCertificate,
} from "../api/coordinatorApi";
import AppSnackbar from "../../../components/common/AppSnackbar.jsx";

const CoordinatorCertificatesPage = () => {

    const [status, setStatus] =
        useState("PENDING");

    const [page, setPage] =
        useState(0);

    const [size] =
        useState(4);

    const [totalPages, setTotalPages] =
        useState(0);

    const [certificates, setCertificates] =
        useState([]);

    const [loading, setLoading] =
        useState(false);
    const [snackbar, setSnackbar] =
        useState({
            open: false,
            message: "",
            severity: "success",
        });

    const fetchCertificates = async () => {
        setLoading(true);


        try {
            const response =
                await getCertificatesByStatus(
                    status,
                    page,
                    size
                );

            setCertificates(
                response.content || []
            );

            setTotalPages(
                response.totalPages || 0
            );
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCertificates();
    }, [
        status,
        page,
    ]);
    useEffect(() => {

        setPage(0);

    }, [status]);
    const handleApprove = async (id) => {
        try {
            await approveCertificate(id);

            setSnackbar({
                open: true,
                message:
                    "Certificate approved successfully",
                severity: "success",
            });

            fetchCertificates();
        } catch (error) {
            setSnackbar({
                open: true,
                message:
                    "Failed to approve certificate",
                severity: "error",
            });
        }
    };
    const handleReject = async (id) => {
        try {
            await rejectCertificate(id);

            setSnackbar({
                open: true,
                message:
                    "Certificate rejected successfully",
                severity: "success",
            });

            fetchCertificates();
        } catch (error) {
            setSnackbar({
                open: true,
                message:
                    "Failed to reject certificate",
                severity: "error",
            });
        }
    };


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

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                <Typography
                    variant="h5"
                    fontWeight={700}
                >
                    Certificates
                </Typography>

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
                    <ToggleButton value="PENDING">
                        Pending
                    </ToggleButton>

                    <ToggleButton value="APPROVED">
                        Approved
                    </ToggleButton>

                    <ToggleButton value="REJECTED">
                        Rejected
                    </ToggleButton>
                </ToggleButtonGroup>

                </Box>

            </Box>

            {loading && (
                <Box
                    sx={{
                        textAlign: "center",
                        mt: 5,
                    }}
                >
                    <CircularProgress />
                </Box>
            )}

            {!loading &&
                certificates.length ===
                0 && (
                    <Typography>
                        No certificates found
                    </Typography>
                )}

            {!loading &&
                certificates.length > 0 && (

                    <Box
                        sx={{
                            mt: 3,

                            height: "98vh",
                            overflowY: "auto",
                            pr: 1,
                        }}
                    >

                        <Box
                            sx={{
                                maxWidth: 1200,
                                mx: "auto",
                            }}
                        >

                            <Grid
                                container
                                spacing={3}
                            >
                                {certificates.map(
                                    (certificate) => (

                                        <Grid
                                            size={{
                                                xs: 12,
                                                sm: 6,
                                                md: 6,
                                                lg: 4,
                                            }}
                                            key={certificate.id}
                                        >

                                            <CertificateTemplateCard
                                                certificate={certificate}
                                                showActions
                                                onApprove={handleApprove}
                                                onReject={handleReject}
                                            />

                                        </Grid>

                                    )
                                )}
                            </Grid>

                        </Box>

                    </Box>

                )}
            {!loading &&
                totalPages > 1 && (

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
                            <KeyboardArrowLeftIcon />
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
                            <KeyboardArrowRightIcon />
                        </IconButton>

                    </>

                )}
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
        </Box>
    );
};

export default CoordinatorCertificatesPage;