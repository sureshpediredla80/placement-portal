import {
    Box,
    Typography,
    Grid,
    MenuItem,
    InputLabel,
    FormControl,
    Select,
    ToggleButton,
    ToggleButtonGroup, IconButton, CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import AppSnackbar from "../../../components/common/AppSnackbar";
import { useState,useEffect } from "react";

import { getTopics,getTopicById ,getGlobalTopics,
    getTopicsByBranch,} from "../api/topicApi";

import TopicCard from "../components/TopicCard";
import TopicDetailsDialog
    from "../components/TopicDetailsDialog";

import {
    getBranches,
} from "../../branches/api/branchApi";
const CoordinatorTopicsPage = () => {

    const [page, setPage] = useState(0);

    const [size] = useState(10);

    const [totalPages, setTotalPages] = useState(0);
    const [
        selectedTopic,
        setSelectedTopic,
    ] = useState(null);

    const [
        openDetailsDialog,
        setOpenDetailsDialog,
    ] = useState(false);

    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(false);
    const [
        activeTab,
        setActiveTab,
    ] = useState("all");

    const [
        branches,
        setBranches,
    ] = useState([]);

    const [
        selectedBranch,
        setSelectedBranch,
    ] = useState("");
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

            const data =
                await getBranches();

            setBranches(data);

        } catch (error) {

            console.error(error);
        }
    };




    const fetchTopics = async () => {

        try {

            setLoading(true);

            let data;

            if (
                activeTab === "all"
            ) {

                data = await getTopics(
                    page,
                    size
                );

            }
            else if (
                activeTab === "global"
            ) {

                data = await getGlobalTopics(
                    page,
                    size
                );

            }
            else if (
                activeTab === "branch" &&
                selectedBranch
            ) {

                data = await getTopicsByBranch(
                    selectedBranch,
                    page,
                    size
                );
            }
            else {

                data = {
                    content: [],
                };
            }

            setTopics(data.content || []);

            setTotalPages(data.totalPages || 0);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);
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
    const handleViewDetails =
        async (topicId) => {

            try {

                const data =
                    await getTopicById(
                        topicId
                    );

                setSelectedTopic(
                    data
                );

                setOpenDetailsDialog(
                    true
                );

            } catch (error) {

                console.error(error);

                setSnackbar({
                    open: true,
                    message:
                        "Failed to load topic details",
                    severity:
                        "error",
                });
            }
        };



    return (
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
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 2,
                    }}
                >
                    <Typography
                        variant="h4"
                        fontWeight={700}
                    >
                        Topics
                    </Typography>

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
                                },
                            },

                            "& .Mui-selected": {
                                backgroundColor: "#1976d2 !important",
                                color: "#fff !important",
                                boxShadow:
                                    "0 8px 20px rgba(25,118,210,.30)",
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
                </Box>

                {activeTab === "branch" && (
                    <Box
                        sx={{
                            mt: 2,
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <FormControl sx={{ minWidth: 280 }}>
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
                                {branches.map((branch) => (
                                    <MenuItem
                                        key={branch.id}
                                        value={branch.id}
                                    >
                                        {branch.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                )}
            </Box>

            {/* Loading */}
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

            {/* Empty */}
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

            {/* Cards */}
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

            {/* Pagination */}
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
                isStudent={true}
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