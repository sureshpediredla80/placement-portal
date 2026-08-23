import {
    Box,
    Typography,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    ToggleButtonGroup,
    ToggleButton,
    Card,
    CardContent,
    Grid,
    TextField,
    InputAdornment,
    Tooltip,
    Stack,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import GroupIcon from "@mui/icons-material/Group";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ListAltIcon from "@mui/icons-material/ListAlt";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

import {
    getApplicationsByCompany,
    getEligibleStudentsForCompany,
    getApplicationById,
    getCompanyById,
} from "../../coordinators/api/coordinatorApi";

import ApplicationDetailsDialog from "../../coordinators/components/ApplicationDetailsDialog";

const AdminCompanyApplicationsPage = () => {
    const { id } = useParams();

    const [activeFilter, setActiveFilter] = useState("ELIGIBLE");
    const [searchTerm, setSearchTerm] = useState("");
    const [companyInfo, setCompanyInfo] = useState(null);
    const [stats, setStats] = useState({
        totalEligibleStudents: 0,
        totalApplied: 0,
        totalNotApplied: 0,
        totalSelected: 0,
        totalRejected: 0,
    });

    const [eligibleStudentsList, setEligibleStudentsList] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);

    const loadDriveStats = useCallback(async () => {
        try {
            const companyRes = await getCompanyById(id);
            setCompanyInfo(companyRes);

            const eligibleRes = await getEligibleStudentsForCompany(id);
            if (eligibleRes) {
                setStats({
                    totalEligibleStudents: eligibleRes.totalEligibleStudents || 0,
                    totalApplied: eligibleRes.totalApplied || 0,
                    totalNotApplied: eligibleRes.totalNotApplied || 0,
                    totalSelected: eligibleRes.totalSelected || 0,
                    totalRejected: eligibleRes.totalRejected || 0,
                });
                setEligibleStudentsList(eligibleRes.eligibleStudents || []);
            }
        } catch (error) {
            console.error("Error loading drive stats:", error);
        }
    }, [id]);

    const fetchFilteredData = useCallback(async () => {
        setLoading(true);
        try {
            await loadDriveStats();

            if (
                activeFilter === "ALL" ||
                activeFilter === "APPLIED" ||
                activeFilter === "SELECTED" ||
                activeFilter === "REJECTED"
            ) {
                const response = await getApplicationsByCompany(id, activeFilter);
                setApplications(response.content || response || []);
            }
        } catch (error) {
            console.error("Error fetching filtered data:", error);
        } finally {
            setLoading(false);
        }
    }, [id, activeFilter, loadDriveStats]);

    useEffect(() => {
        fetchFilteredData();
    }, [fetchFilteredData]);

    const handleViewApplication = async (applicationId) => {
        try {
            const response = await getApplicationById(applicationId);
            setSelectedApplication(response);
            setDialogOpen(true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleFilterChange = (event, newFilter) => {
        if (newFilter !== null) {
            setActiveFilter(newFilter);
        }
    };

    const getDisplayItems = useCallback(() => {
        let baseItems = [];
        if (activeFilter === "ELIGIBLE") {
            baseItems = eligibleStudentsList;
        } else if (activeFilter === "NOT_APPLIED") {
            baseItems = eligibleStudentsList.filter(
                (s) => s.status === "Eligible & Not Applied"
            );
        } else {
            baseItems = applications;
        }

        if (!searchTerm.trim()) return baseItems;

        const term = searchTerm.toLowerCase();
        return baseItems.filter((item) => {
            const name = (item.fullName || item.studentName || "").toLowerCase();
            const roll = (item.rollNumber || item.roll || "").toLowerCase();
            const email = (item.email || "").toLowerCase();
            return name.includes(term) || roll.includes(term) || email.includes(term);
        });
    }, [activeFilter, eligibleStudentsList, applications, searchTerm]);

    const displayItems = getDisplayItems();
    const isEligibleView =
        activeFilter === "ELIGIBLE" || activeFilter === "NOT_APPLIED";

    const getStatusChip = (statusStr) => {
        switch (statusStr) {
            case "SELECTED":
                return (
                    <Chip
                        label="SELECTED"
                        color="success"
                        size="small"
                        sx={{ fontWeight: 700, borderRadius: 1.5 }}
                    />
                );
            case "REJECTED":
                return (
                    <Chip
                        label="REJECTED"
                        color="error"
                        size="small"
                        sx={{ fontWeight: 700, borderRadius: 1.5 }}
                    />
                );
            case "APPLIED":
                return (
                    <Chip
                        label="APPLIED"
                        color="primary"
                        size="small"
                        sx={{ fontWeight: 700, borderRadius: 1.5 }}
                    />
                );
            case "Eligible & Not Applied":
                return (
                    <Chip
                        label="Eligible & Not Applied"
                        color="warning"
                        size="small"
                        sx={{ fontWeight: 700, borderRadius: 1.5 }}
                    />
                );
            default:
                return (
                    <Chip
                        label={statusStr}
                        color="default"
                        size="small"
                        sx={{ fontWeight: 600, borderRadius: 1.5 }}
                    />
                );
        }
    };

    const headerStyle = {
        fontWeight: 700,
        bgcolor: "#1e293b",
        color: "#ffffff",
        py: 1.8,
        fontSize: "0.875rem",
        letterSpacing: "0.5px",
    };

    return (
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
            {/* Header Banner */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 4,
                    borderRadius: 3,
                    background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                    color: "white",
                    boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.25)",
                }}
            >
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={2}
                >
                    <Box>
                        <Stack direction="row" alignItems="center" spacing={1.5} mb={0.5}>
                            <BusinessIcon sx={{ color: "#38bdf8", fontSize: 32 }} />
                            <Typography variant="h4" fontWeight={800} letterSpacing="-0.5px">
                                {companyInfo?.companyName || "Company Drive Overview"}
                            </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={2} ml={5.5}>
                            {companyInfo?.roleOffered && (
                                <Chip
                                    icon={<WorkIcon sx={{ color: "#38bdf8 !important", fontSize: 16 }} />}
                                    label={`Role: ${companyInfo.roleOffered}`}
                                    size="small"
                                    sx={{
                                        bgcolor: "rgba(255, 255, 255, 0.1)",
                                        color: "white",
                                        fontWeight: 600,
                                    }}
                                />
                            )}
                            {companyInfo?.minimumPackage && (
                                <Chip
                                    label={`Package: ₹${companyInfo.minimumPackage} LPA`}
                                    size="small"
                                    sx={{
                                        bgcolor: "rgba(56, 189, 248, 0.15)",
                                        color: "#38bdf8",
                                        fontWeight: 700,
                                    }}
                                />
                            )}
                        </Stack>
                    </Box>

                    <Tooltip title="Refresh Data">
                        <IconButton
                            onClick={fetchFilteredData}
                            sx={{
                                bgcolor: "rgba(255,255,255,0.1)",
                                color: "white",
                                "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                            }}
                        >
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Paper>

            {/* Statistics Summary Cards Grid */}
            <Typography variant="subtitle2" fontWeight={700} color="text.secondary" mb={1.5} textTransform="uppercase" letterSpacing="1px">
                Drive Metrics Summary
            </Typography>

            <Grid container spacing={2.5} mb={4}>
                <Grid item xs={12} sm={6} md={2.4}>
                    <Card
                        elevation={0}
                        sx={{
                            p: 1,
                            borderRadius: 3,
                            border: "1px solid",
                            borderColor: "primary.main",
                            bgcolor: "background.paper",
                            transition: "all 0.2s ease-in-out",
                            "&:hover": { transform: "translateY(-3px)", boxShadow: "0 8px 20px rgba(0,0,0,0.08)" },
                        }}
                    >
                        <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="caption" fontWeight={700} color="primary.main" textTransform="uppercase">
                                        Total Eligible
                                    </Typography>
                                    <Typography variant="h4" fontWeight={800} color="text.primary" mt={0.5}>
                                        {stats.totalEligibleStudents}
                                    </Typography>
                                </Box>
                                <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: "primary.50", color: "primary.main" }}>
                                    <GroupIcon fontSize="medium" />
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={2.4}>
                    <Card
                        elevation={0}
                        sx={{
                            p: 1,
                            borderRadius: 3,
                            border: "1px solid",
                            borderColor: "#0284c7",
                            bgcolor: "background.paper",
                            transition: "all 0.2s ease-in-out",
                            "&:hover": { transform: "translateY(-3px)", boxShadow: "0 8px 20px rgba(0,0,0,0.08)" },
                        }}
                    >
                        <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="caption" fontWeight={700} color="#0284c7" textTransform="uppercase">
                                        Applied
                                    </Typography>
                                    <Typography variant="h4" fontWeight={800} color="text.primary" mt={0.5}>
                                        {stats.totalApplied}
                                    </Typography>
                                </Box>
                                <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: "#e0f2fe", color: "#0284c7" }}>
                                    <AssignmentTurnedInIcon fontSize="medium" />
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={2.4}>
                    <Card
                        elevation={0}
                        sx={{
                            p: 1,
                            borderRadius: 3,
                            border: "1px solid",
                            borderColor: "#d97706",
                            bgcolor: "background.paper",
                            transition: "all 0.2s ease-in-out",
                            "&:hover": { transform: "translateY(-3px)", boxShadow: "0 8px 20px rgba(0,0,0,0.08)" },
                        }}
                    >
                        <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="caption" fontWeight={700} color="#d97706" textTransform="uppercase">
                                        Not Applied
                                    </Typography>
                                    <Typography variant="h4" fontWeight={800} color="text.primary" mt={0.5}>
                                        {stats.totalNotApplied}
                                    </Typography>
                                </Box>
                                <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: "#fef3c7", color: "#d97706" }}>
                                    <HourglassEmptyIcon fontSize="medium" />
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={2.4}>
                    <Card
                        elevation={0}
                        sx={{
                            p: 1,
                            borderRadius: 3,
                            border: "1px solid",
                            borderColor: "#16a34a",
                            bgcolor: "background.paper",
                            transition: "all 0.2s ease-in-out",
                            "&:hover": { transform: "translateY(-3px)", boxShadow: "0 8px 20px rgba(0,0,0,0.08)" },
                        }}
                    >
                        <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="caption" fontWeight={700} color="#16a34a" textTransform="uppercase">
                                        Selected
                                    </Typography>
                                    <Typography variant="h4" fontWeight={800} color="text.primary" mt={0.5}>
                                        {stats.totalSelected}
                                    </Typography>
                                </Box>
                                <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: "#dcfce7", color: "#16a34a" }}>
                                    <CheckCircleIcon fontSize="medium" />
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={2.4}>
                    <Card
                        elevation={0}
                        sx={{
                            p: 1,
                            borderRadius: 3,
                            border: "1px solid",
                            borderColor: "#dc2626",
                            bgcolor: "background.paper",
                            transition: "all 0.2s ease-in-out",
                            "&:hover": { transform: "translateY(-3px)", boxShadow: "0 8px 20px rgba(0,0,0,0.08)" },
                        }}
                    >
                        <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="caption" fontWeight={700} color="#dc2626" textTransform="uppercase">
                                        Rejected
                                    </Typography>
                                    <Typography variant="h4" fontWeight={800} color="text.primary" mt={0.5}>
                                        {stats.totalRejected}
                                    </Typography>
                                </Box>
                                <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: "#fee2e2", color: "#dc2626" }}>
                                    <CancelIcon fontSize="medium" />
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Filter & Search Bar */}
            <Paper
                elevation={0}
                sx={{
                    p: 2.5,
                    mb: 3,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "stretch", md: "center" },
                    gap: 2,
                }}
            >
                <ToggleButtonGroup
                    value={activeFilter}
                    exclusive
                    onChange={handleFilterChange}
                    color="primary"
                    sx={{
                        flexWrap: "wrap",
                        gap: 1,
                        "& .MuiToggleButton-root": {
                            borderRadius: "8px !important",
                            border: "1px solid !important",
                            borderColor: "divider !important",
                            px: 2,
                            py: 0.8,
                            fontWeight: 600,
                            textTransform: "none",
                            fontSize: "0.85rem",
                            "&.Mui-selected": {
                                bgcolor: "primary.main",
                                color: "white",
                                "&:hover": { bgcolor: "primary.dark" },
                            },
                        },
                    }}
                >
                    <ToggleButton value="ELIGIBLE">
                        <GroupIcon sx={{ mr: 1, fontSize: 18 }} /> All Eligible ({stats.totalEligibleStudents})
                    </ToggleButton>
                    <ToggleButton value="ALL">
                        <ListAltIcon sx={{ mr: 1, fontSize: 18 }} /> All Applications
                    </ToggleButton>
                    <ToggleButton value="APPLIED">
                        <AssignmentTurnedInIcon sx={{ mr: 1, fontSize: 18 }} /> Applied ({stats.totalApplied})
                    </ToggleButton>
                    <ToggleButton value="SELECTED">
                        <CheckCircleIcon sx={{ mr: 1, fontSize: 18 }} /> Selected ({stats.totalSelected})
                    </ToggleButton>
                    <ToggleButton value="REJECTED">
                        <CancelIcon sx={{ mr: 1, fontSize: 18 }} /> Rejected ({stats.totalRejected})
                    </ToggleButton>
                    <ToggleButton value="NOT_APPLIED">
                        <HourglassEmptyIcon sx={{ mr: 1, fontSize: 18 }} /> Eligible & Not Applied ({stats.totalNotApplied})
                    </ToggleButton>
                </ToggleButtonGroup>

                <TextField
                    size="small"
                    placeholder="Search student, roll, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ minWidth: 260 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: "text.secondary" }} />
                            </InputAdornment>
                        ),
                    }}
                />
            </Paper>

            {/* Main Data Table */}
            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                    <CircularProgress size={44} />
                </Box>
            ) : (
                <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: "divider",
                        overflow: "hidden",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={headerStyle}>STUDENT NAME</TableCell>
                                <TableCell sx={headerStyle}>ROLL NUMBER</TableCell>
                                {isEligibleView ? (
                                    <TableCell sx={headerStyle}>EMAIL</TableCell>
                                ) : (
                                    <>
                                        <TableCell sx={headerStyle}>ROLE OFFERED</TableCell>
                                        <TableCell sx={headerStyle}>PACKAGE OFFERED</TableCell>
                                    </>
                                )}
                                <TableCell sx={headerStyle}>STATUS</TableCell>
                                <TableCell sx={{ ...headerStyle, textAlign: "center" }}>ACTIONS</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {displayItems.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={isEligibleView ? 5 : 6} align="center" sx={{ py: 6 }}>
                                        <Typography variant="body1" color="text.secondary" fontWeight={500}>
                                            No record found matching the selected filter.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                displayItems.map((item, index) => {
                                    if (isEligibleView) {
                                        return (
                                            <TableRow key={item.sid || index} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                                <TableCell sx={{ fontWeight: 600, color: "#1e293b" }}>{item.studentName || "N/A"}</TableCell>
                                                <TableCell sx={{ fontWeight: 500, fontFamily: "monospace" }}>{item.roll || "N/A"}</TableCell>
                                                <TableCell>{item.email || "N/A"}</TableCell>
                                                <TableCell>{getStatusChip(item.status)}</TableCell>
                                                <TableCell align="center">
                                                    {item.status !== "Eligible & Not Applied" ? (
                                                        <Tooltip title="View Application Details">
                                                            <IconButton color="primary" onClick={() => handleViewApplication(item.sid)} size="small">
                                                                <VisibilityIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    ) : (
                                                        <Typography variant="caption" color="text.disabled">
                                                            -
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    } else {
                                        return (
                                            <TableRow key={item.id || index} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                                <TableCell sx={{ fontWeight: 600, color: "#1e293b" }}>{item.fullName || item.studentName || "N/A"}</TableCell>
                                                <TableCell sx={{ fontWeight: 500, fontFamily: "monospace" }}>{item.rollNumber || "N/A"}</TableCell>
                                                <TableCell>{item.roleOffered || companyInfo?.roleOffered || "N/A"}</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>₹{item.packageOffered || companyInfo?.minimumPackage || 0} LPA</TableCell>
                                                <TableCell>{getStatusChip(item.status)}</TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title="View Application Details">
                                                        <IconButton color="primary" onClick={() => handleViewApplication(item.id)} size="small">
                                                            <VisibilityIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    }
                                })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <ApplicationDetailsDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                application={selectedApplication}
                onStatusUpdated={fetchFilteredData}
            />
        </Box>
    );
};

export default AdminCompanyApplicationsPage;