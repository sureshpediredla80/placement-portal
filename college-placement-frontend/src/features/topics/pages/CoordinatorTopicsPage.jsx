import {
    Box,
    Typography,
    Button,
    Grid,
    MenuItem,
    InputLabel,
    FormControl,
    Select,
    ToggleButton,
    ToggleButtonGroup,
    CircularProgress,
    IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import { useState, useEffect } from "react";

import AppSnackbar from "../../../components/common/AppSnackbar";

import {
    getTopics,
    getTopicById,
    getGlobalTopics,
    getTopicsByBranch,
    deleteTopic,
} from "../api/topicApi";

import {
    getBranches,
} from "../../branches/api/branchApi";

import CreateTopicDialog from "../components/CreateTopicDialog";
import TopicCard from "../components/TopicCard";
import TopicDetailsDialog from "../components/TopicDetailsDialog";

const CoordinatorTopicsPage = () => {

    const [page, setPage] = useState(0);
    const [size] = useState(5);
    const [totalPages, setTotalPages] = useState(0);

    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(false);

    const [activeTab, setActiveTab] = useState("all");

    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState("");

    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

    const [selectedTopic, setSelectedTopic] = useState(null);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        try {
            const data = await getBranches();
            setBranches(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchTopics();
    }, [
        activeTab,
        selectedBranch,
        page,
    ]);

    useEffect(() => {
        setPage(0);
    }, [
        activeTab,
        selectedBranch,
    ]);

    const fetchTopics = async () => {

        try {

            setLoading(true);

            let data;

            if (activeTab === "all") {

                data = await getTopics(
                    page,
                    size
                );

            } else if (activeTab === "global") {

                data = await getGlobalTopics(
                    page,
                    size
                );

            } else if (
                activeTab === "branch" &&
                selectedBranch
            ) {

                data = await getTopicsByBranch(
                    selectedBranch,
                    page,
                    size
                );

            } else {

                data = {
                    content: [],
                    totalPages: 0,
                };

            }

            setTopics(
                data.content || []
            );

            setTotalPages(
                data.totalPages || 0
            );

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    const handleTopicCreated = async (
        message
    ) => {

        setOpenCreateDialog(false);
        setOpenUpdateDialog(false);

        await fetchTopics();

        setSnackbar({
            open: true,
            message,
            severity: "success",
        });

    };

    const handleTopicCreateError = (
        message
    ) => {

        setSnackbar({
            open: true,
            message,
            severity: "error",
        });

    };

    const handleViewDetails = async (
        topicId
    ) => {

        try {

            const data =
                await getTopicById(topicId);

            setSelectedTopic(data);

            setOpenDetailsDialog(true);

        } catch (error) {

            console.error(error);

            setSnackbar({
                open: true,
                message:
                    "Failed to load topic details",
                severity: "error",
            });

        }

    };

    const handleUpdateTopic = (
        topic
    ) => {

        setSelectedTopic(topic);

        setOpenDetailsDialog(false);

        setOpenUpdateDialog(true);

    };

    const handleDeleteTopic = async (
        topic
    ) => {

        const confirmed = window.confirm(
            `Delete "${topic.title}" ?`
        );

        if (!confirmed) return;

        try {

            await deleteTopic(topic.id);

            setOpenDetailsDialog(false);

            await fetchTopics();

            setSnackbar({
                open: true,
                message:
                    "Topic deleted successfully",
                severity: "success",
            });

        } catch (error) {

            console.error(error);

            setSnackbar({
                open: true,
                message:
                    "Failed to delete topic",
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

                <Typography
                    variant="h5"
                    fontWeight={700}
                >
                    Topics
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 2,
                        mb: 3,
                    }}
                >

                    <ToggleButtonGroup
                        exclusive
                        value={activeTab}
                        onChange={(e, value) => {

                            if (value !== null) {

                                setActiveTab(value);

                                if (value !== "branch") {
                                    setSelectedBranch("");
                                }

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

                        <ToggleButton value="all">
                            All Topics
                        </ToggleButton>

                        <ToggleButton value="global">
                            Global Topics
                        </ToggleButton>

                        <ToggleButton value="branch">
                            Branch Topics
                        </ToggleButton>

                    </ToggleButtonGroup>

                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            alignItems: "center",
                        }}
                    >

                        {activeTab === "branch" && (
                            <FormControl
                                size="small"
                                sx={{
                                    minWidth: 220,
                                }}
                            >
                                <InputLabel>
                                    Select Branch
                                </InputLabel>

                                <Select
                                    value={selectedBranch}
                                    label="Select Branch"
                                    onChange={(e) =>
                                        setSelectedBranch(
                                            e.target.value
                                        )
                                    }
                                >
                                    {branches.map(
                                        (branch) => (
                                            <MenuItem
                                                key={branch.id}
                                                value={branch.id}
                                            >
                                                {branch.name}
                                            </MenuItem>
                                        )
                                    )}
                                </Select>

                            </FormControl>
                        )}

                        <Button
                            variant="contained"
                            onClick={() =>
                                setOpenCreateDialog(true)
                            }
                        >
                            Create Topic
                        </Button>

                    </Box>

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

            {!loading && topics.length === 0 && (
                <Box
                    sx={{
                        textAlign:"center",
                        mt:8
                    }}
                >

                    <SearchIcon
                        sx={{
                            fontSize:70,
                            color:"#c7c7c7"
                        }}
                    />

                    <Typography
                        variant="h6"
                        color="text.secondary"
                    >

                        No Topics Found

                    </Typography>

                </Box>
            )}

            {!loading && topics.length > 0 && (
                <Box
                    sx={{
                        mt: 2,
                        maxWidth: 1300,
                        mx: "auto",
                    }}
                >
                    <Grid container spacing={3}>
                        {topics.map((topic) => (
                            <Grid
                                item
                                xs={12}
                                md={6}
                                lg={3}
                                key={topic.id}
                            >
                                <TopicCard
                                    topic={topic}
                                    onViewDetails={
                                        handleViewDetails
                                    }
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            {!loading && totalPages > 1 && (
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
                        }}
                    >
                        <KeyboardArrowRightIcon />
                    </IconButton>
                </>
            )}

            <TopicDetailsDialog
                open={openDetailsDialog}
                onClose={() =>
                    setOpenDetailsDialog(false)
                }
                topic={selectedTopic}
                onUpdate={handleUpdateTopic}
                onDelete={handleDeleteTopic}
            />

            <CreateTopicDialog
                open={openCreateDialog}
                onClose={() =>
                    setOpenCreateDialog(false)
                }
                onSuccess={handleTopicCreated}
                onError={handleTopicCreateError}
            />

            <CreateTopicDialog
                open={openUpdateDialog}
                onClose={() =>
                    setOpenUpdateDialog(false)
                }
                onSuccess={handleTopicCreated}
                onError={handleTopicCreateError}
                topic={selectedTopic}
            />

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

export default CoordinatorTopicsPage;