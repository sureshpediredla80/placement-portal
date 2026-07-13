import {getActiveCompanies, getEligibleCompanies, getExpiredCompanies,
    searchCompanies,} from "../api/companyApi";
import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    ToggleButton,
    ToggleButtonGroup,
    Menu,
    MenuItem,
    Grid,
    CircularProgress,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import { Paper, InputBase, Divider, IconButton } from "@mui/material";
import CompanyCard from "../components/CompanyCard";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
const StudentCompaniesPage = () => {
    const [filter, setFilter] = useState("active");
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [searchType, setSearchType] = useState("company");
    const [anchorEl, setAnchorEl] = useState(null);
    const [page, setPage] = useState(0);
    const [size] = useState(5); // oka page lo 6 company cards
    const [totalPages, setTotalPages] = useState(0);
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

            } else if (filter === "eligible") {

                response = await getEligibleCompanies(page, size);

            } else {

                response = await getExpiredCompanies(page, size);

            }
            setCompanies(response.content || []);
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
        const timer = setTimeout(() => {
            setDebouncedSearch(searchText);
        }, 500);


        return () => clearTimeout(timer);
    }, [searchText]);
    useEffect(() => {
        setPage(0);
    }, [filter, debouncedSearch]);

    return (
        <Box

        >
            <Box
                sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    backgroundColor: "rgba(245,247,251,0.9)",
                    backdropFilter: "blur(12px)",
                    borderBottom: "1px solid #e6eaf0", // page background
                    pb: 2,
                    pt: 1,
                }}
            >

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                }}
            >
                <Typography variant="h4" fontWeight={700}>
                    Companies
                </Typography>


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
                            transition:
                                "all .3s cubic-bezier(.4,0,.2,1)",

                            "&:hover": {
                                backgroundColor: "#EAF2FF",
                                transform: "translateY(-2px)",
                            },
                        },

                        "& .Mui-selected": {
                            backgroundColor: "#1976d2 !important",
                            color: "#fff !important",
                            boxShadow:"0 2px 12px rgba(0,0,0,.05)",
                            transform: "translateY(-2px)",
                        },
                    }}
                >
                    <ToggleButton value="active">
                        Active
                    </ToggleButton>

                    <ToggleButton value="eligible">
                        Eligible
                    </ToggleButton>

                    <ToggleButton value="expired">
                        Expired
                    </ToggleButton>
                </ToggleButtonGroup>

            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 2,
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
                    <SearchIcon sx={{ color: "gray", mr: 1 }} />

                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder={
                            searchType === "company"
                                ? "Search Company"
                                : "Search Role"
                        }
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <Divider
                        sx={{ height: 28, m: 0.5 }}
                        orientation="vertical"
                    />

                    <IconButton
                        onClick={(e) => setAnchorEl(e.currentTarget)}
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
            <Box sx={{ mt: 2 ,pd:3}}>
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
                        mt:2,
                        maxWidth:1200,
                        mx:"auto",

                        animation:"fade .25s ease",

                        "@keyframes fade":{
                            from:{
                                opacity:0,
                                transform:"translateY(12px)"
                            },
                            to:{
                                opacity:1,
                                transform:"translateY(0)"
                            }
                        }
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

            )
            }
            {!loading && totalPages > 1 && (
                <>
                    {/* Left Arrow */}
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
                        <KeyboardArrowLeftIcon fontSize="large" />
                    </IconButton>

                    {/* Right Arrow */}
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
                        <KeyboardArrowRightIcon fontSize="large" />
                    </IconButton>
                </>
            )}
            </Box>
        </Box>
    );
};

export default StudentCompaniesPage;