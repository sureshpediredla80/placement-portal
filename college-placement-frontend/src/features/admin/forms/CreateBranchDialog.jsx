import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Stack,
} from "@mui/material";

import { useState } from "react";

import { createBranch } from "../api/adminApi";

const CreateBranchDialog = ({
                                open,
                                onClose,
                                onSuccess,
                                showSnackbar,
                            }) => {

    const [loading, setLoading] =
        useState(false);

    const [formData, setFormData] =
        useState({
            name: "",
            code: "",
            department: "",
        });

    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCreate = async () => {

        try {

            setLoading(true);

            await createBranch(formData);

            showSnackbar(
                "Branch created successfully",
                "success"
            );

            onSuccess();

            handleClose();

        } catch (error) {

            showSnackbar(
                error?.response?.data?.message ||
                "Failed to create branch",
                "error"
            );

        } finally {

            setLoading(false);

        }

    };

    const handleClose = () => {

        setFormData({
            name: "",
            code: "",
            department: "",
        });

        onClose();

    };

    return (

        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
        >

            <DialogTitle>
                Create Branch
            </DialogTitle>

            <DialogContent>

                <Stack
                    spacing={2}
                    mt={1}
                >

                    <TextField
                        label="Branch Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                    />

                    <TextField
                        label="Branch Code"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        fullWidth
                    />

                    <TextField
                        label="Department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        fullWidth
                    />

                </Stack>

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={handleClose}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleCreate}
                    disabled={loading}
                >
                    {
                        loading
                            ? "Creating..."
                            : "Create"
                    }
                </Button>

            </DialogActions>

        </Dialog>

    );

};

export default CreateBranchDialog;