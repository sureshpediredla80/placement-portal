import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Divider,
    Paper,
    Box,
} from "@mui/material";

import { useState } from "react";

import {
    uploadStudents,
    downloadStudentTemplate,
} from "../api/adminApi";

const BulkUploadDialog = ({
                              open,
                              onClose,
                              onSuccess,
                              showSnackbar,
                              setUploadResult,
                              setResultDialogOpen,
                          }) => {

    const [file, setFile] = useState(null);

    const [loading, setLoading] = useState(false);

    // ==========================
    // Download Template
    // ==========================
    const handleDownloadTemplate = async () => {

        try {

            const response =
                await downloadStudentTemplate();

            const url =
                window.URL.createObjectURL(
                    new Blob([response])
                );

            const link =
                document.createElement("a");

            link.href = url;

            link.setAttribute(
                "download",
                "Student_Upload_Template.xlsx"
            );

            document.body.appendChild(link);

            link.click();

            link.remove();

        } catch {

            showSnackbar(
                "Unable to download template",
                "error"
            );
        }
    };

    // ==========================
    // Upload
    // ==========================
    const handleUpload = async () => {

        if (!file) {

            showSnackbar(
                "Please select an Excel file",
                "error"
            );

            return;
        }

        try {

            setLoading(true);

            const response =
                await uploadStudents(file);

            showSnackbar(
                "Bulk upload completed",
                "success"
            );

            setUploadResult(response);

            setResultDialogOpen(true);

            onSuccess();

            setFile(null);

            onClose();

        } catch (error) {

            showSnackbar(
                error?.response?.data?.message ||
                "Upload failed",
                "error"
            );

        } finally {

            setLoading(false);
        }
    };

    return (

        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >

            <DialogTitle>
                Bulk Upload Students
            </DialogTitle>

            <DialogContent>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    mb={2}
                >
                    Upload multiple students using an Excel file.
                </Typography>

                <Button
                    variant="outlined"
                    onClick={handleDownloadTemplate}
                    sx={{ mb: 3 }}
                >
                    Download Excel Template
                </Button>

                <Divider sx={{ mb: 3 }} />

                <Typography
                    fontWeight={600}
                    mb={1}
                >
                    Selected File
                </Typography>

                <Paper
                    variant="outlined"
                    sx={{
                        p: 2,
                        mb: 2,
                    }}
                >
                    {
                        file
                            ? file.name
                            : "No file selected"
                    }
                </Paper>

                <Box mb={2}>

                    <Button
                        variant="contained"
                        component="label"
                    >
                        Choose Excel File

                        <input
                            hidden
                            type="file"
                            accept=".xlsx"
                            onChange={(e) =>
                                setFile(
                                    e.target.files[0]
                                )
                            }
                        />

                    </Button>

                </Box>

                <Typography
                    variant="caption"
                    display="block"
                    color="text.secondary"
                >
                    • Only .xlsx files are supported.
                </Typography>

                <Typography
                    variant="caption"
                    display="block"
                    color="text.secondary"
                >
                    • Maximum file size: 5 MB.
                </Typography>

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={() => {

                        setFile(null);

                        onClose();

                    }}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleUpload}
                    disabled={loading}
                >
                    {
                        loading
                            ? "Uploading..."
                            : "Upload Students"
                    }
                </Button>

            </DialogActions>

        </Dialog>
    );
};

export default BulkUploadDialog;