import {
    Box,
    Button, Paper,
    Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
    getBranches,
} from "../api/adminApi";
import {
    deleteBranch,
} from "../api/adminApi";

import ConfirmationDialog
    from "../components/ConfirmationDialog";
import {
    useEffect,
} from "react";

import BranchesTable
    from "../components/BranchesTable";
import {
    useState,
} from "react";

import CreateBranchDialog
    from "../forms/CreateBranchDialog";

import AppSnackbar
    from "../../../components/common/AppSnackbar";

const AdminBranchesPage = () => {

    const [
        openDialog,
        setOpenDialog,
    ] = useState(false);
    const [
        branches,
        setBranches,
    ] = useState([]);

    const [
        loading,
        setLoading,
    ] = useState(true);
    const [
        deleteDialogOpen,
        setDeleteDialogOpen,
    ] = useState(false);

    const [
        selectedBranch,
        setSelectedBranch,
    ] = useState(null);

    const [
        deleting,
        setDeleting,
    ] = useState(false);

    const [
        snackbar,
        setSnackbar,
    ] = useState({

        open: false,

        message: "",

        severity: "success",

    });

    const showSnackbar = (
        message,
        severity
    ) => {

        setSnackbar({

            open: true,

            message,

            severity,

        });

    };
    const fetchBranches =
        async () => {

            try {

                setLoading(true);

                const response =
                    await getBranches();

                setBranches(
                    response
                );

            } catch (error) {

                showSnackbar(
                    error?.response?.data?.message ||
                    "Failed to load branches",
                    "error"
                );

            } finally {

                setLoading(false);

            }

        };
    useEffect(() => {

        fetchBranches();

    }, []);
    const handleDeleteClick =
        (branch) => {

            setSelectedBranch(
                branch
            );

            setDeleteDialogOpen(
                true
            );

        };
    const handleDeleteBranch =
        async () => {

            try {

                setDeleting(true);

                await deleteBranch(
                    selectedBranch.id
                );

                showSnackbar(
                    "Branch deleted successfully",
                    "success"
                );

                fetchBranches();

            } catch (error) {

                showSnackbar(
                    error?.response?.data?.message ||
                    "Delete failed",
                    "error"
                );

            } finally {

                setDeleting(false);

                setDeleteDialogOpen(false);

                setSelectedBranch(null);

            }

        };
    return (

        <Box p={3}>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                }}
            >

                <Box>

                    <Typography
                        variant="h4"
                        fontWeight={700}
                    >
                        Branches
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                    >
                        Manage all academic branches available in the placement portal.
                    </Typography>

                </Box>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() =>
                        setOpenDialog(true)
                    }
                    size="large"
                    sx={{
                        px:4,
                        borderRadius:3,
                        textTransform:"none",
                        fontWeight:600,
                    }}
                >
                    Add Branch
                </Button>



            </Box>
            <Paper
                elevation={0}
                sx={{
                    p:2,
                    mb:3,
                    borderRadius:3,
                    border:"1px solid",
                    borderColor:"divider",
                }}
            >

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Total Branches
                </Typography>

                <Typography
                    variant="h5"
                    fontWeight={700}
                >
                    {branches.length}
                </Typography>

            </Paper>


            <CreateBranchDialog

                open={openDialog}

                onClose={() =>
                    setOpenDialog(false)
                }

                onSuccess={fetchBranches}

                showSnackbar={showSnackbar}

            />
            <Paper
                elevation={0}
                sx={{
                    borderRadius:3,
                    border:"1px solid",
                    borderColor:"divider",
                    overflow:"hidden",
                }}
            >
            <BranchesTable
                branches={branches}
                loading={loading}
                onDelete={handleDeleteClick}
            />
            </Paper>
            <AppSnackbar

                open={snackbar.open}

                message={snackbar.message}

                severity={snackbar.severity}

                onClose={() =>
                    setSnackbar({
                        ...snackbar,
                        open: false,
                    })
                }

            />
            <ConfirmationDialog

                open={deleteDialogOpen}

                title="Delete Branch"

                message={`Are you sure you want to delete "${selectedBranch?.name}" ?`}

                confirmText="Delete"

                loading={deleting}

                onCancel={() => {

                    setDeleteDialogOpen(false);

                    setSelectedBranch(null);

                }}

                onConfirm={handleDeleteBranch}

            />

        </Box>

    );

};

export default AdminBranchesPage;