import {
    getActiveCompanies,
    getAllCompanies,
    getExpiredCompanies,
    searchCompanies,
} from "../api/coordinatorApi.jsx";
import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    CircularProgress, Button, Menu,
    ToggleButton,
    ToggleButtonGroup,
} from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import {
    Paper,
    InputBase,
    Divider,
    IconButton,
} from "@mui/material";
import CreateCompanyDialog
    from "../components/CreateCompanyDialog";
import CompanyCard from "../components/CompanyCard";

const CoordinatoreCompaniesPage = () => {
    const [filter, setFilter] = useState("active");
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [size] = useState(20);
    const [totalPages, setTotalPages] = useState(0);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [searchType, setSearchType] = useState("company");
    const [anchorEl, setAnchorEl] = useState(null);

    const fetchCompanies = async () => {
        setLoading(true);

        try {
            let response;

            if (debouncedSearch.trim() !== "") {

                if (searchType === "company") {

                    response = await searchCompanies(
                        {
                            companyName: debouncedSearch,
                        },
                        page,
                        size
                    );

                } else {

                    response = await searchCompanies(
                        {
                            roleOffered: debouncedSearch,
                        },
                        page,
                        size
                    );

                }

            } else if (filter === "active") {

                response = await getActiveCompanies(page, size);

            } else if (filter === "all") {

                response = await getAllCompanies(page, size);

            } else {

                response = await getExpiredCompanies(page, size);

            }

            setCompanies(
                response.content || []
            );
            setTotalPages(response.totalPages || 0);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchCompanies();
    }, [filter, debouncedSearch, page]);
    useEffect(() => {
        setPage(0);
    }, [filter, debouncedSearch]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchText);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchText]);




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
            <Typography variant="h5" fontWeight={700}>
                Companies
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
                    value={filter}
                    onChange={(e, value) => {
                        if (value !== null) {
                            setFilter(value);
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
                            transition: "all .3s cubic-bezier(.4,0,.2,1)",

                            "&:hover": {
                                backgroundColor: "#EAF2FF",
                                transform: "translateY(-2px)",
                            },
                        },

                        "& .Mui-selected": {
                            backgroundColor: "#1976d2 !important",
                            color: "#fff !important",
                            boxShadow: "0 8px 20px rgba(25,118,210,.30)",
                            transform: "translateY(-2px)",
                        },
                    }}
                >
                    <ToggleButton value="active">
                        Active
                    </ToggleButton>

                    <ToggleButton value="all">
                        All
                    </ToggleButton>

                    <ToggleButton value="expired">
                        Expired
                    </ToggleButton>
                </ToggleButtonGroup>

                <Button
                    variant="contained"
                    onClick={() => setOpenCreateDialog(true)}
                >
                    Create Company
                </Button>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    mb: 4,
                }}
            >
                <Paper
                    sx={{
                        p: "4px 12px",
                        display: "flex",
                        alignItems: "center",
                        width: "58%",
                        maxWidth: 700,
                        height: 60,
                        borderRadius: "40px",
                        boxShadow: 3,
                    }}
                >
                    <SearchIcon
                        sx={{
                            color: "gray",
                            mr: 1,
                        }}
                    />

                    <InputBase
                        sx={{
                            ml: 1,
                            flex: 1,
                        }}
                        placeholder={
                            searchType === "company"
                                ? "Search Company"
                                : "Search Role"
                        }
                        value={searchText}
                        onChange={(e) =>
                            setSearchText(e.target.value)
                        }
                    />

                    <Divider
                        sx={{
                            height: 28,
                            m: 0.5,
                        }}
                        orientation="vertical"
                    />

                    <IconButton
                        onClick={(e) =>
                            setAnchorEl(e.currentTarget)
                        }
                    >
                        <TuneIcon />
                    </IconButton>
                </Paper>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                >
                    <MenuItem
                        onClick={() => {
                            setSearchType("company");
                            setSearchText("");
                            setDebouncedSearch("");
                            setAnchorEl(null);
                        }}
                    >
                        Company Name
                    </MenuItem>

                    <MenuItem
                        onClick={() => {
                            setSearchType("role");
                            setSearchText("");
                            setDebouncedSearch("");
                            setAnchorEl(null);
                        }}
                    >
                        Role Offered
                    </MenuItem>
                </Menu>
            </Box>

            </Box>
            {/* Loading */}
            {loading && (
                <Box sx={{ textAlign: "center", mt: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {/* Empty State */}
            {!loading && companies.length === 0 && (
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

                        No Companies Found

                    </Typography>

                </Box>
            )}

            {/* Companies List */}
            {!loading && companies.length > 0 && (
                <Box
                    sx={{
                        mt: 2,
                        maxWidth: 1200,
                        mx: "auto",
                    }}
                >
                    <Grid container spacing={3}>
                        {companies.map((company) => (
                            <Grid item xs={12} md={6} key={company.id}>
                                <CompanyCard company={company} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
            {!loading && totalPages > 1 && (
                <>
                    <IconButton
                        disabled={page === 0}
                        onClick={() => setPage((prev) => prev - 1)}
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
                        disabled={page === totalPages - 1}
                        onClick={() => setPage((prev) => prev + 1)}
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
             <CreateCompanyDialog
                open={openCreateDialog}
                onClose={() =>
                    setOpenCreateDialog(false)
                }
                onSuccess={fetchCompanies}
            />

        </Box>

    );

};

export default CoordinatoreCompaniesPage;