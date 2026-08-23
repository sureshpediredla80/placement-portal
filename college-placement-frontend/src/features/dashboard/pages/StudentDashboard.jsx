import {
    Box,
    Typography,
    Paper,
    Avatar,
    Chip,
    Button,
    ToggleButtonGroup,
    ToggleButton,
    CircularProgress,
    Stack,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import StarsIcon from "@mui/icons-material/Stars";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import banner1 from "../../../assets/dashboard/banner1.jpg";
import banner2 from "../../../assets/dashboard/banner2.jpg";
import bg1 from "../../../assets/dashboard/bg1.png";

import {
    getPlacedStudentsShowcase,
    getAvailablePlacementYears,
} from "../../applications/api/applicationApi";

import PublicStudentProfileDialog from "../components/PublicStudentProfileDialog";

const images = [banner1, banner2, bg1];

// Keyframe CSS injection for smooth right-to-left infinite marquee
const marqueeStyles = `
@keyframes marqueeRightToLeft {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}
.marquee-track {
  display: flex;
  gap: 20px;
  width: max-content;
  animation: marqueeRightToLeft 38s linear infinite;
}
.marquee-track:hover {
  animation-play-state: paused;
}
`;

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [currentImage, setCurrentImage] = useState(0);

    // Showcase States
    const [availableYears, setAvailableYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState("ALL");
    const [placedStudents, setPlacedStudents] = useState([]);
    const [loadingShowcase, setLoadingShowcase] = useState(false);

    // Profile Dialog State
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    // Auto Banner Slide
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) =>
                prev === images.length - 1 ? 0 : prev + 1
            );
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Load available placement years
    useEffect(() => {
        const fetchYears = async () => {
            try {
                const years = await getAvailablePlacementYears();
                setAvailableYears(years || []);
            } catch (error) {
                console.error("Error fetching placement years:", error);
            }
        };
        fetchYears();
    }, []);

    // Fetch Placed Students Showcase
    useEffect(() => {
        const fetchShowcase = async () => {
            setLoadingShowcase(true);
            try {
                const yearFilter = selectedYear === "ALL" ? null : selectedYear;
                const data = await getPlacedStudentsShowcase(yearFilter, 0, 80);
                setPlacedStudents(data?.content || []);
            } catch (error) {
                console.error("Error fetching placed students showcase:", error);
            } finally {
                setLoadingShowcase(false);
            }
        };
        fetchShowcase();
    }, [selectedYear]);

    const handleYearChange = (event, newYear) => {
        if (newYear !== null) {
            setSelectedYear(newYear);
        }
    };

    const handleOpenProfile = (student) => {
        if (!student) return;
        setSelectedStudent(student);
        setDialogOpen(true);

        const id = student.studentId || student.id;
        if (id) {
            navigate(`/student/placed-profile/${id}`, { state: { student } });
        }
    };

    // Split placed students into 2 rows
    const row1 = placedStudents.filter((_, idx) => idx % 2 === 0);
    const row2 = placedStudents.filter((_, idx) => idx % 2 === 1);

    // Duplicate rows to create a seamless infinite marquee loop
    const marqueeRow1 = row1.length > 0 ? [...row1, ...row1] : [];
    const marqueeRow2 = row2.length > 0 ? [...row2, ...row2] : [];

    const getInitials = (name) =>
        name
            ? name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .substring(0, 2)
            : "ST";

    return (
        <Box sx={{ width: "100%"}}>
            {/* Inject Marquee CSS Keyframes */}
            <style>{marqueeStyles}</style>

            {/* 🖼 4K HIGH RESOLUTION PLACEMENT & MENTORING BANNER SLIDER */}
            <Box
                sx={{
                    width: "100%",
                    aspectRatio: "21 / 9",     // ⭐ fits your banner
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: 4,
                    boxShadow: 5,
                    backgroundColor: "#000",
                    mb: 2,                    // ⭐ bottom gap
                }}
            >

                {/* 🖼 IMAGE */}
                <Box
                    component="img"
                    src={images[currentImage]}
                    alt="slide"
                    sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",        // ⭐ no crop
                        objectPosition: "bottom",    // ⭐ bottom visible
                    }}
                />

                {/* 🌑 OVERLAY TEXT */}
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "#fff",
                        background:
                            "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4))",
                    }}
                >
                    <Typography
                        sx={{
                            fontWeight: 700,
                            fontSize: {
                                xs: "1.5rem",
                                sm: "2rem",
                                md: "2.5rem",
                            },
                        }}
                    >
                    </Typography>
                </Box>

                {/* ◀ LEFT ARROW */}
                <Box
                    onClick={() =>
                        setCurrentImage((prev) =>
                            prev === 0 ? images.length - 1 : prev - 1
                        )
                    }
                    sx={{
                        position: "absolute",
                        left: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "rgba(0,0,0,0.5)",
                        color: "#fff",
                        px: 2,
                        py: 1,
                        borderRadius: "50%",
                        cursor: "pointer",
                    }}
                >
                    {"<"}
                </Box>

                {/* ▶ RIGHT ARROW */}
                <Box
                    onClick={() =>
                        setCurrentImage((prev) =>
                            prev === images.length - 1 ? 0 : prev + 1
                        )
                    }
                    sx={{
                        position: "absolute",
                        right: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "rgba(0,0,0,0.5)",
                        color: "#fff",
                        px: 2,
                        py: 1,
                        borderRadius: "50%",
                        cursor: "pointer",
                    }}
                >
                    {">"}
                </Box>

            </Box>

            {/* 🏆 CAMPUS PLACEMENT WALL OF FAME HEADER */}
            <Box sx={{ mb: 4 }}>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={2.5}
                    mb={3}
                >
                    <Box>
                        <Stack direction="row" alignItems="center" spacing={1.5} mb={0.5}>
                            <StarsIcon sx={{ color: "#f59e0b", fontSize: 32 }} />
                            <Typography variant="h4" fontWeight={800} letterSpacing="-0.5px" color="text.primary">
                                Campus Placement Wall of Fame
                            </Typography>
                        </Stack>
                        <Typography variant="body1" color="text.secondary" fontWeight={500} ml={5.5}>
                            Celebrating placed seniors, top offers & recruitment success stories
                        </Typography>
                    </Box>

                    {/* Batch Year Filter Tabs */}
                    <ToggleButtonGroup
                        value={selectedYear}
                        exclusive
                        onChange={handleYearChange}
                        color="primary"
                        size="small"
                        sx={{
                            bgcolor: "background.paper",
                            p: 0.5,
                            borderRadius: 3,
                            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                            border: "1px solid",
                            borderColor: "divider",
                            "& .MuiToggleButton-root": {
                                borderRadius: "8px !important",
                                border: "none !important",
                                px: 2.5,
                                py: 0.8,
                                fontWeight: 700,
                                textTransform: "none",
                                fontSize: "0.875rem",
                                "&.Mui-selected": {
                                    bgcolor: "primary.main",
                                    color: "white",
                                    boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
                                },
                            },
                        }}
                    >
                        <ToggleButton value="ALL">All Batches</ToggleButton>
                        {availableYears.map((yr) => (
                            <ToggleButton key={yr} value={yr}>
                                Batch {yr}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </Box>
            </Box>

            {/* 🌟 2-ROW CONTINUOUS AUTO-MARQUEE CARDS (Moving Right-to-Left) */}
            {loadingShowcase ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                    <CircularProgress size={44} />
                </Box>
            ) : placedStudents.length === 0 ? (
                <Paper
                    elevation={0}
                    sx={{
                        p: 6,
                        textAlign: "center",
                        borderRadius: 4,
                        border: "1px dashed",
                        borderColor: "divider",
                        bgcolor: "background.paper",
                    }}
                >
                    <Typography variant="h6" fontWeight={600} color="text.secondary">
                        No placed student profiles available for the selected batch.
                    </Typography>
                </Paper>
            ) : (
                <Box sx={{ overflow: "hidden", py: 1 }}>
                    {/* Row 1 Marquee Track */}
                    {marqueeRow1.length > 0 && (
                        <Box sx={{ overflow: "hidden", mb: 3 }}>
                            <Box className="marquee-track">
                                {marqueeRow1.map((student, index) => (
                                    <Paper
                                        key={`row1-${student.studentId || index}-${index}`}
                                        elevation={0}
                                        onClick={() => handleOpenProfile(student)}
                                        sx={{
                                            width: 270,
                                            flexShrink: 0,
                                            borderRadius: 3.5,
                                            overflow: "hidden",
                                            border: "1px solid",
                                            borderColor: "divider",
                                            bgcolor: "background.paper",
                                            cursor: "pointer",
                                            transition: "all 0.25s ease-in-out",
                                            boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
                                            "&:hover": {
                                                transform: "translateY(-4px)",
                                                boxShadow: "0 12px 25px rgba(0,0,0,0.1)",
                                                borderColor: "primary.main",
                                            },
                                        }}
                                    >
                                        {/* Minimal Top Header Bar */}
                                        <Box
                                            sx={{
                                                height: 52,
                                                background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                                                position: "relative",
                                                px: 2,
                                                pt: 1,
                                            }}
                                        >
                                            <Chip
                                                label={`Batch ${student.placementYear || 2026}`}
                                                size="small"
                                                sx={{
                                                    bgcolor: "rgba(255,255,255,0.15)",
                                                    color: "white",
                                                    fontWeight: 700,
                                                    fontSize: "0.68rem",
                                                    position: "absolute",
                                                    top: 8,
                                                    right: 10,
                                                }}
                                            />
                                        </Box>

                                        {/* Card Body */}
                                        <Box sx={{ p: 2, pt: 0, mt: -3 }}>
                                            <Box display="flex" justifyContent="space-between" alignItems="flex-end">
                                                <Avatar
                                                    sx={{
                                                        width: 52,
                                                        height: 52,
                                                        fontSize: "1.1rem",
                                                        fontWeight: 800,
                                                        bgcolor: "primary.main",
                                                        color: "white",
                                                        border: "3px solid",
                                                        borderColor: "background.paper",
                                                        boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
                                                    }}
                                                >
                                                    {getInitials(student.studentName)}
                                                </Avatar>

                                                <Chip
                                                    icon={<EmojiEventsIcon sx={{ color: "#16a34a !important", fontSize: 15 }} />}
                                                    label={`₹${student.highestPackageLpa || 0} LPA`}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: "#dcfce7",
                                                        color: "#15803d",
                                                        fontWeight: 800,
                                                        fontSize: "0.78rem",
                                                    }}
                                                />
                                            </Box>

                                            <Box mt={1.2}>
                                                <Typography variant="subtitle2" fontWeight={800} color="text.primary" noWrap>
                                                    {student.studentName}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" noWrap>
                                                    {student.rollNumber} • {student.branchName || "Engineering"}
                                                </Typography>
                                            </Box>

                                            {/* Primary Company Badges */}
                                            <Box mt={1.5}>
                                                <Stack direction="row" spacing={0.6} flexWrap="wrap" gap={0.5}>
                                                    {student.placedCompanies && student.placedCompanies.length > 0 ? (
                                                        student.placedCompanies.slice(0, 2).map((comp, i) => (
                                                            <Chip
                                                                key={i}
                                                                label={comp.companyName}
                                                                size="small"
                                                                color="primary"
                                                                variant="outlined"
                                                                sx={{ fontWeight: 700, fontSize: "0.7rem", height: 22 }}
                                                            />
                                                        ))
                                                    ) : (
                                                        <Chip label="Placed" size="small" color="primary" sx={{ height: 22 }} />
                                                    )}
                                                </Stack>
                                            </Box>

                                            {/* Action Link */}
                                            <Box display="flex" justifyContent="flex-end" alignItems="center" mt={1.8}>
                                                <Button
                                                    size="small"
                                                    endIcon={<ArrowForwardIcon sx={{ fontSize: "14px !important" }} />}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOpenProfile(student);
                                                    }}
                                                    sx={{
                                                        fontWeight: 700,
                                                        textTransform: "none",
                                                        fontSize: "0.78rem",
                                                        p: 0,
                                                        color: "primary.main",
                                                        "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
                                                    }}
                                                >
                                                    View Profile
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Paper>
                                ))}
                            </Box>
                        </Box>
                    )}

                    {/* Row 2 Marquee Track */}
                    {marqueeRow2.length > 0 && (
                        <Box sx={{ overflow: "hidden" }}>
                            <Box className="marquee-track" sx={{ animationDuration: "42s" }}>
                                {marqueeRow2.map((student, index) => (
                                    <Paper
                                        key={`row2-${student.studentId || index}-${index}`}
                                        elevation={0}
                                        onClick={() => handleOpenProfile(student)}
                                        sx={{
                                            width: 270,
                                            flexShrink: 0,
                                            borderRadius: 3.5,
                                            overflow: "hidden",
                                            border: "1px solid",
                                            borderColor: "divider",
                                            bgcolor: "background.paper",
                                            cursor: "pointer",
                                            transition: "all 0.25s ease-in-out",
                                            boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
                                            "&:hover": {
                                                transform: "translateY(-4px)",
                                                boxShadow: "0 12px 25px rgba(0,0,0,0.1)",
                                                borderColor: "primary.main",
                                            },
                                        }}
                                    >
                                        {/* Minimal Top Header Bar */}
                                        <Box
                                            sx={{
                                                height: 52,
                                                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                                                position: "relative",
                                                px: 2,
                                                pt: 1,
                                            }}
                                        >
                                            <Chip
                                                label={`Batch ${student.placementYear || 2026}`}
                                                size="small"
                                                sx={{
                                                    bgcolor: "rgba(255,255,255,0.15)",
                                                    color: "white",
                                                    fontWeight: 700,
                                                    fontSize: "0.68rem",
                                                    position: "absolute",
                                                    top: 8,
                                                    right: 10,
                                                }}
                                            />
                                        </Box>

                                        {/* Card Body */}
                                        <Box sx={{ p: 2, pt: 0, mt: -3 }}>
                                            <Box display="flex" justifyContent="space-between" alignItems="flex-end">
                                                <Avatar
                                                    sx={{
                                                        width: 52,
                                                        height: 52,
                                                        fontSize: "1.1rem",
                                                        fontWeight: 800,
                                                        bgcolor: "primary.main",
                                                        color: "white",
                                                        border: "3px solid",
                                                        borderColor: "background.paper",
                                                        boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
                                                    }}
                                                >
                                                    {getInitials(student.studentName)}
                                                </Avatar>

                                                <Chip
                                                    icon={<EmojiEventsIcon sx={{ color: "#16a34a !important", fontSize: 15 }} />}
                                                    label={`₹${student.highestPackageLpa || 0} LPA`}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: "#dcfce7",
                                                        color: "#15803d",
                                                        fontWeight: 800,
                                                        fontSize: "0.78rem",
                                                    }}
                                                />
                                            </Box>

                                            <Box mt={1.2}>
                                                <Typography variant="subtitle2" fontWeight={800} color="text.primary" noWrap>
                                                    {student.studentName}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" noWrap>
                                                    {student.rollNumber} • {student.branchName || "Engineering"}
                                                </Typography>
                                            </Box>

                                            {/* Primary Company Badges */}
                                            <Box mt={1.5}>
                                                <Stack direction="row" spacing={0.6} flexWrap="wrap" gap={0.5}>
                                                    {student.placedCompanies && student.placedCompanies.length > 0 ? (
                                                        student.placedCompanies.slice(0, 2).map((comp, i) => (
                                                            <Chip
                                                                key={i}
                                                                label={comp.companyName}
                                                                size="small"
                                                                color="primary"
                                                                variant="outlined"
                                                                sx={{ fontWeight: 700, fontSize: "0.7rem", height: 22 }}
                                                            />
                                                        ))
                                                    ) : (
                                                        <Chip label="Placed" size="small" color="primary" sx={{ height: 22 }} />
                                                    )}
                                                </Stack>
                                            </Box>

                                            {/* Action Link */}
                                            <Box display="flex" justifyContent="flex-end" alignItems="center" mt={1.8}>
                                                <Button
                                                    size="small"
                                                    endIcon={<ArrowForwardIcon sx={{ fontSize: "14px !important" }} />}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOpenProfile(student);
                                                    }}
                                                    sx={{
                                                        fontWeight: 700,
                                                        textTransform: "none",
                                                        fontSize: "0.78rem",
                                                        p: 0,
                                                        color: "primary.main",
                                                        "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
                                                    }}
                                                >
                                                    View Profile
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Paper>
                                ))}
                            </Box>
                        </Box>
                    )}
                </Box>
            )}

            {/* Rich Public Profile Modal Dialog */}
            <PublicStudentProfileDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                student={selectedStudent}
            />
        </Box>
    );
};

export default StudentDashboard;