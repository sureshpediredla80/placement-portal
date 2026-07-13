import { useState, useEffect } from "react";
import CertificateBag
    from "../components/CertificateBag";
import AppSnackbar from "../../../components/common/AppSnackbar";
import { motion } from "framer-motion";
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Grid,
    IconButton,
} from "@mui/material";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import {
    getMyCertificates,
    deleteCertificate,
} from "../api/certificateApi";

import UploadCertificateDialog from "../components/UploadCertificateDialog";
import CertificateTemplateCard from "../components/CertificateTemplateCard";

const StudentCertificatesPage = () => {

    const [page, setPage] = useState(0);

    const [size] = useState(6);

    const [totalPages, setTotalPages] =
        useState(0);
    const [
        bagOpened,
        setBagOpened,
    ] = useState(false);
    const [pageVisible, setPageVisible] =
        useState(false);

    const [
        openUploadDialog,
        setOpenUploadDialog,
    ] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const [
        certificates,
        setCertificates,
    ] = useState([]);

    const [
        loading,
        setLoading,
    ] = useState(false);

    const fetchCertificates =
        async () => {

            setLoading(true);

            try {

                const response =
                    await getMyCertificates(
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

    }, [page]);

    const handleDeleteCertificate =
        async (certificateId) => {

            try {

                await deleteCertificate(
                    certificateId
                );

                fetchCertificates();

            } catch (error) {

                console.error(error);
            }
        };
    const handleOpenBag = () => {

        setTimeout(() => {

            setBagOpened(true);

            setTimeout(() => {

                setPageVisible(true);

            }, 150);

        }, 700);

    };
    if (!bagOpened) {

        return (

            <CertificateBag
                onOpen={handleOpenBag}
            />

        );

    }
    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({
            ...prev,
            open: false,
        }));
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({
            open: true,
            message,
            severity,
        });
    };

    return (

        <motion.div

            initial={{
                opacity: 0,
                scale: 0.98,
            }}

            animate={{
                opacity: pageVisible ? 1 : 0,
                scale: pageVisible ? 1 : 1,
            }}

            transition={{
                duration: 0.5,
            }}

        >

            <Box>

            {/* Sticky Header */}

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
                        justifyContent:
                            "space-between",
                        alignItems: "center",
                    }}
                >

                    <Typography
                        variant="h5"
                        fontWeight={700}
                    >
                        Certificates
                    </Typography>

                    <Button
                        variant="contained"
                        onClick={() =>
                            setOpenUploadDialog(
                                true
                            )
                        }
                    >
                        Upload Certificate
                    </Button>

                </Box>

            </Box>

                <UploadCertificateDialog
                    open={openUploadDialog}
                    onClose={() => setOpenUploadDialog(false)}
                    onSuccess={async () => {
                        if (page === 0) {
                            await fetchCertificates();
                        } else {
                            setPage(0);
                        }

                        setOpenUploadDialog(false);
                    }}
                    showSnackbar={showSnackbar}
                />

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
                certificates.length === 0 && (

                    <Typography
                        sx={{ mt: 4 }}
                        color="text.secondary"
                    >
                        No Certificates Found.
                    </Typography>

                )}

            {!loading &&
                certificates.length > 0 && (
                    <Box
                        sx={{
                            mt: 3,
                            height: "72vh",
                            overflowY: "auto",
                            pr: 1,
                        }}
                    >
                    <Box
                        sx={{
                            mt: 3,
                            maxWidth: 1200,
                            mx: "auto",
                        }}
                    >
                        <Grid container spacing={3}>
                            {certificates.map((certificate) => (
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
                                        onDelete={handleDeleteCertificate}
                                        showDelete
                                    />
                                </Grid>
                            ))}
                        </Grid>

                    </Box>
                    </Box>

                )}

            {/* Arrow Pagination */}

            {!loading &&
                totalPages > 1 && (

                    <>

                        <IconButton
                            disabled={page === 0}
                            onClick={() =>
                                setPage(
                                    (prev) => prev - 1
                                )
                            }
                            sx={{
                                position: "fixed",
                                left: 30,
                                top: "50%",
                                transform:
                                    "translateY(-50%)",
                                width: 54,
                                height: 54,
                                borderRadius: "50%",
                                bgcolor: "white",
                                boxShadow: 3,
                                zIndex: 1000,

                                "&:hover": {
                                    bgcolor:
                                        "#1976d2",
                                    color: "#fff",
                                },

                                "&.Mui-disabled": {
                                    bgcolor:
                                        "#f2f2f2",
                                },
                            }}
                        >
                            <KeyboardArrowLeftIcon />
                        </IconButton>

                        <IconButton
                            disabled={
                                page ===
                                totalPages - 1
                            }
                            onClick={() =>
                                setPage(
                                    (prev) => prev + 1
                                )
                            }
                            sx={{
                                position: "fixed",
                                right: 30,
                                top: "50%",
                                transform:
                                    "translateY(-50%)",
                                width: 54,
                                height: 54,
                                borderRadius: "50%",
                                bgcolor: "white",
                                boxShadow: 3,
                                zIndex: 1000,

                                "&:hover": {
                                    bgcolor:
                                        "#1976d2",
                                    color: "#fff",
                                },

                                "&.Mui-disabled": {
                                    bgcolor:
                                        "#f2f2f2",
                                },
                            }}
                        >
                            <KeyboardArrowRightIcon />
                        </IconButton>

                    </>

                )}
            </Box>
            <AppSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={handleCloseSnackbar}
            />
        </motion.div>


    );

};

export default StudentCertificatesPage;