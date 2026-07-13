import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from "@mui/material";

import {
    useState,
} from "react";

import {
    promoteAllStudents,
} from "../api/adminApi";

const PromoteStudentsDialog = ({
                                   open,
                                   onClose,
                                   onSuccess,
                                   showSnackbar,
                               }) => {

    const [loading, setLoading] =
        useState(false);

    const handlePromote =
        async () => {

            try {

                setLoading(true);

                await promoteAllStudents();

                showSnackbar(
                    "Students promoted successfully",
                    "success"
                );

                onSuccess();

                onClose();

            } catch (error) {

                showSnackbar(
                    error?.response?.data?.message ||
                    "Promotion failed",
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
        >

            <DialogTitle>
                Promote Students
            </DialogTitle>

            <DialogContent>

                <DialogContentText>

                    Are you sure you want to promote all eligible students to the next academic year?

                    <br /><br />

                    Final year students will not be promoted.

                </DialogContentText>

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={onClose}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePromote}
                    disabled={loading}
                >
                    {
                        loading
                            ? "Promoting..."
                            : "Yes, Promote"
                    }

                </Button>

            </DialogActions>

        </Dialog>

    );

};

export default PromoteStudentsDialog;