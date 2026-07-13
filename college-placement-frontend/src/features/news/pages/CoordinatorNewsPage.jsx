import {
    Box,
    Typography,
    Button,
} from "@mui/material";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import { useState } from "react";
import Pagination from "@mui/material/Pagination";
import AppSnackbar from "../../../components/common/AppSnackbar";
import { deleteNews }
    from "../api/newsApi";
import CreateNewsDialog from "../components/CreateNewsDialog";
import useNews from "../hooks/useNews";
import NewsCard from "../components/NewsCard";
const CoordinatorNewsPage = () => {

    const [
        openCreateDialog,
        setOpenCreateDialog,
    ] = useState(false);
    const [page, setPage] =
        useState(0);

    const {
        news,
        loading,
        totalPages,
        fetchNews,
    } = useNews(page, 10);

    const [snackbar, setSnackbar] =
        useState({
            open: false,
            message: "",
            severity: "success",
        });
    const [deleteDialogOpen,
        setDeleteDialogOpen] =
        useState(false);

    const [selectedNewsId,
        setSelectedNewsId] =
        useState(null);
    const handleConfirmDelete =
        async () => {

            try {

                await deleteNews(
                    selectedNewsId
                );

                setSnackbar({
                    open: true,
                    message:
                        "News deleted successfully",
                    severity:
                        "success",
                });

                setDeleteDialogOpen(
                    false
                );

                setSelectedNewsId(
                    null
                );

                fetchNews();

            } catch (error) {

                setSnackbar({
                    open: true,
                    message:
                        "Failed to delete news",
                    severity:
                        "error",
                });

            }
        };
    const handleDeleteClick =
        (id) => {

            setSelectedNewsId(id);

            setDeleteDialogOpen(
                true
            );
        };

    return (
        <Box>

            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems:
                        "center",
                }}
            >
                <Typography
                    variant="h4"
                    fontWeight={700}
                >
                    News
                </Typography>

                <Button
                    variant="contained"
                    onClick={() =>
                        setOpenCreateDialog(
                            true
                        )
                    }
                >
                    Create News
                </Button>
            </Box>
            <Box
                sx={{
                    mt: 4,
                    maxWidth: "900px",
                    mx: "auto",

                    height: "75vh",
                    overflowY: "auto",

                    pr: 1,
                    "&::-webkit-scrollbar": {
                        width: "6px",
                    },

                    "&::-webkit-scrollbar-thumb": {
                        background: "#c1c1c1",
                        borderRadius: "10px",
                    },
                }}
            >

                {loading ? (

                    <Typography>
                        Loading...
                    </Typography>

                ) : (

                    news.map(
                        (item) => (
                            <NewsCard
                                key={item.id}
                                news={item}
                                onDelete={
                                    handleDeleteClick
                                }
                            />
                        )
                    )

                )}

            </Box>

            {/* Create Dialog */}
            <CreateNewsDialog
                open={openCreateDialog}
                onClose={() =>
                    setOpenCreateDialog(
                        false
                    )
                }
                onSuccess={() => {
                    fetchNews();
                    setSnackbar({
                        open: true,
                        message:
                            "News created successfully",
                        severity:
                            "success",
                    });

                }}
                onError={() => {

                    setSnackbar({
                        open: true,
                        message:
                            "Failed to create news",
                        severity:
                            "error",
                    });

                }}
            />
            <Dialog
                open={deleteDialogOpen}
                onClose={() =>
                    setDeleteDialogOpen(
                        false
                    )
                }
            >

                <DialogTitle>
                    Delete News
                </DialogTitle>

                <DialogContent>

                    <DialogContentText>

                        Are you sure you want
                        to delete this news?

                    </DialogContentText>

                </DialogContent>

                <DialogActions>

                    <Button
                        onClick={() =>
                            setDeleteDialogOpen(
                                false
                            )
                        }
                    >
                        Cancel
                    </Button>

                    <Button
                        color="error"
                        variant="contained"
                        onClick={
                            handleConfirmDelete
                        }
                    >
                        Delete
                    </Button>

                </DialogActions>

            </Dialog>

            {/* Snackbar */}
            <AppSnackbar
                open={snackbar.open}
                message={
                    snackbar.message
                }
                severity={
                    snackbar.severity
                }
                onClose={() =>
                    setSnackbar(
                        (prev) => ({
                            ...prev,
                            open: false,
                        })
                    )
                }
            />
            <Box
                mt={3}
                display="flex"
                justifyContent="center"
            >
                <Pagination
                    page={page + 1}
                    count={totalPages}
                    onChange={(
                        event,
                        value
                    ) =>
                        setPage(
                            value - 1
                        )
                    }
                />
            </Box>
        </Box>

    );
};

export default CoordinatorNewsPage;