import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Box,
} from "@mui/material";
import {
    createUser,
} from "../api/adminApi";

import {
    Snackbar,
    Alert,
} from "@mui/material";

import { useState } from "react";

import { ROLES } from "../../../constants/roles";

const CreateUserDialog = ({
                              open,
                              onClose,
                            branches,
                              onUserCreated,
                              showSnackbar,
                          }) => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        role: ROLES.STUDENT,
        branchId: "",
        rollNumber: "",
        year: "",
    });


    const [
        loading,
        setLoading,
    ] = useState(false);
    const handleCreate =
        async () => {

            try {

                setLoading(true);

                const payload = {
                    fullName:
                    formData.fullName,

                    email:
                    formData.email,

                    role:
                    formData.role,
                };

                if (
                    formData.role ===
                    ROLES.STUDENT
                ) {

                    payload.branchId =
                        Number(
                            formData.branchId
                        );

                    payload.rollNumber =
                        formData.rollNumber;

                    payload.year =
                        Number(
                            formData.year
                        );
                }

                if (
                    formData.role ===
                    ROLES.COORDINATOR
                ) {

                    payload.branchId =
                        Number(
                            formData.branchId
                        );
                }

                await createUser(
                    payload
                );

                showSnackbar(
                    "User created successfully",
                    "success"
                );

                onUserCreated();

                onClose();

            } catch (error) {

                console.error(error);

                showSnackbar(
                    error?.response?.data?.message ||
                    "Failed to create user",
                    "error"
                );

            } finally {

                setLoading(
                    false
                );
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
                Create User
            </DialogTitle>
            <DialogContent>

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        mt: 1,
                    }}
                >

                    <TextField
                        label="Full Name"
                        fullWidth
                        value={formData.fullName}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                fullName: e.target.value,
                            })
                        }
                    />

                    <TextField
                        label="Email"
                        fullWidth
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                email: e.target.value,
                            })
                        }
                    />

                    <TextField
                        select
                        label="Role"
                        fullWidth
                        value={formData.role}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                role: e.target.value,
                            })
                        }
                    >
                        <MenuItem value={ROLES.STUDENT}>
                            Student
                        </MenuItem>

                        <MenuItem value={ROLES.COORDINATOR}>
                            Coordinator
                        </MenuItem>

                        <MenuItem value={ROLES.ADMIN}>
                            Admin
                        </MenuItem>

                    </TextField>

                    {(formData.role === ROLES.STUDENT ||
                        formData.role === ROLES.COORDINATOR) && (

                        <TextField
                            select
                            label="Branch"
                            fullWidth
                            value={formData.branchId}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    branchId: e.target.value,
                                })
                            }
                        >

                            {
                                branches.map(
                                    (branch) => (
                                        <MenuItem
                                            key={branch.id}
                                            value={branch.id}
                                        >
                                            {branch.code}
                                        </MenuItem>
                                    )
                                )
                            }

                        </TextField>

                    )}

                    {formData.role === ROLES.STUDENT && (

                        <>
                            <TextField
                                label="Roll Number"
                                fullWidth
                                value={formData.rollNumber}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        rollNumber: e.target.value,
                                    })
                                }
                            />

                            <TextField
                                label="Year"
                                type="number"
                                fullWidth
                                value={formData.year}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        year: e.target.value,
                                    })
                                }
                            />
                        </>

                    )}

                </Box>

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={onClose}
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

export default CreateUserDialog;