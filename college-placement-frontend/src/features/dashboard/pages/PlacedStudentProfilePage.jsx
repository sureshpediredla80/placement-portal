import {
    Box,
    Typography,
    Paper,
    Avatar,
    Chip,
    Button,
    Grid,

    Stack,

    CircularProgress,
    Container,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import BusinessIcon from "@mui/icons-material/Business";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import CodeIcon from "@mui/icons-material/Code";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import VerifiedIcon from "@mui/icons-material/Verified";
import ShareIcon from "@mui/icons-material/Share";

import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import { getPlacedStudentsShowcase } from "../../applications/api/applicationApi";
import { ROUTES } from "../../../constants/routes";

const PlacedStudentProfilePage = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [student, setStudent] = useState(location.state?.student || null);
    const [loading, setLoading] = useState(!student);

    useEffect(() => {
        if (!student && studentId) {
            const fetchStudentDetails = async () => {
                setLoading(true);
                try {
                    const data = await getPlacedStudentsShowcase(null, 0, 100);
                    const found = (data?.content || []).find(
                        (s) => String(s.studentId) === String(studentId)
                    );
                    setStudent(found || null);
                } catch (error) {
                    console.error("Error loading placed student profile:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchStudentDetails();
        }
    }, [studentId, student]);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
                <CircularProgress size={48} thickness={4} />
            </Box>
        );
    }

    if (!student) {
        return (
            <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 6,
                        borderRadius: 4,
                        border: "1px dashed",
                        borderColor: "divider",
                        bgcolor: "background.paper",
                    }}
                >
                    <Typography variant="h5" fontWeight={700} color="text.secondary" mb={2}>
                        Student Placement Profile Unavailable
                    </Typography>
                    <Typography variant="body1" color="text.secondary" mb={4}>
                        The requested student record could not be found or has restricted visibility.
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(ROUTES.STUDENT_DASHBOARD)}
                        sx={{ borderRadius: 2.5, px: 3, py: 1, fontWeight: 700, textTransform: "none" }}
                    >
                        Back to Dashboard
                    </Button>
                </Paper>
            </Container>
        );
    }

    const initials = student.studentName
        ? student.studentName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .substring(0, 2)
        : "ST";

    return (
        <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", pb: 10, pt: 3 }}>
            <Container maxWidth="lg">
                {/* 1. Navigation Back Button */}
                <Box mb={4}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(-1)}
                        sx={{
                            borderRadius: 3,
                            fontWeight: 700,
                            px: 2.5,
                            py: 0.9,
                            borderColor: "divider",
                            color: "text.primary",
                            bgcolor: "background.paper",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                            textTransform: "none",
                            "&:hover": {
                                bgcolor: "background.paper",
                                borderColor: "primary.main",
                                transform: "translateX(-3px)",
                            },
                            transition: "all 0.2s ease",
                        }}
                    >
                        Back to Dashboard
                    </Button>
                </Box>

                {/* 2. TOP PROFILE HEADER CARD (Student details on clean white background) */}
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 5,
                        overflow: "hidden",
                        border: "1px solid",
                        borderColor: "divider",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
                        bgcolor: "background.paper",
                        mb: 4.5,
                    }}
                >
                    {/* Header Dark Gradient Banner */}
                    <Box
                        sx={{
                            height: 150,
                            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #312e81 100%)",
                            position: "relative",
                            px: 4,
                            py: 2.5,
                        }}
                    >
                        <Chip
                            icon={<VerifiedIcon sx={{ color: "#38bdf8 !important", fontSize: "16px !important" }} />}
                            label="Verified Placement Profile"
                            size="small"
                            sx={{
                                position: "absolute",
                                top: 18,
                                right: 24,
                                bgcolor: "rgba(255,255,255,0.15)",
                                color: "white",
                                fontWeight: 700,
                                fontSize: "0.75rem",
                                backdropFilter: "blur(8px)",
                                px: 1,
                            }}
                        />
                    </Box>

                    {/* Student Info Block (Avatar + Student Name & Details on clean white background) */}
                    <Box sx={{ px: { xs: 3, sm: 5 }, pb: 4.5, pt: 0, position: "relative" }}>
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={3.5}
                            alignItems={{ xs: "flex-start", sm: "flex-end" }}
                            sx={{ mt: -6 }}
                        >
                            <Avatar
                                sx={{
                                    width: 125,
                                    height: 125,
                                    fontSize: "2.8rem",
                                    fontWeight: 800,
                                    bgcolor: "primary.main",
                                    color: "white",
                                    border: "4px solid white",
                                    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                                }}
                            >
                                {initials}
                            </Avatar>

                            {/* Student Information placed cleanly in the top right block on white background */}
                            <Box sx={{ pt: { xs: 1, sm: 5 } }}>
                                <Typography
                                    variant="h4"
                                    fontWeight={800}
                                    sx={{ color: "#0f172a", letterSpacing: "-0.5px" }}
                                >
                                    {student.studentName}
                                </Typography>

                                <Stack direction="row" alignItems="center" spacing={1} mt={0.8}>
                                    <SchoolIcon sx={{ color: "#64748b", fontSize: 20 }} />
                                    <Typography variant="subtitle1" sx={{ color: "#475569", fontWeight: 600 }}>
                                        {student.rollNumber} • {student.branchName || "Engineering"}
                                    </Typography>
                                </Stack>

                                <Stack direction="row" spacing={1.2} mt={2} flexWrap="wrap" gap={0.8}>
                                    <Chip
                                        label={`Placement Batch ${student.placementYear || 2026}`}
                                        color="primary"
                                        sx={{ fontWeight: 700, borderRadius: 2, px: 0.5 }}
                                    />
                                    {student.academicYear && (
                                        <Chip
                                            label={`Year ${student.academicYear}`}
                                            variant="outlined"
                                            sx={{ fontWeight: 600, borderRadius: 2, px: 0.5 }}
                                        />
                                    )}
                                </Stack>
                            </Box>
                        </Stack>
                    </Box>
                </Paper>

                {/* 3. CAREER ACHIEVEMENTS METRICS ROW */}
                <Box mb={4.5}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3.5,
                                    borderRadius: 4,
                                    bgcolor: "#f0fdf4",
                                    border: "1px solid",
                                    borderColor: "#bbf7d0",
                                    boxShadow: "0 4px 15px rgba(22,163,74,0.05)",
                                    transition: "all 0.25s ease",
                                    "&:hover": { transform: "translateY(-3px)", boxShadow: "0 8px 25px rgba(22,163,74,0.12)" },
                                }}
                            >
                                <Box display="flex" alignItems="center">
                                    <Box
                                        sx={{
                                            width: 56,
                                            height: 56,
                                            borderRadius: 3,
                                            bgcolor: "#dcfce7",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            mr: 2.5,
                                        }}
                                    >
                                        <EmojiEventsIcon sx={{ color: "#16a34a", fontSize: 34 }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" fontWeight={700} color="#16a34a" textTransform="uppercase" letterSpacing="0.5px">
                                            Top Offer Package
                                        </Typography>
                                        <Typography variant="h4" fontWeight={800} color="#15803d">
                                            ₹{student.highestPackageLpa || 0} LPA
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3.5,
                                    borderRadius: 4,
                                    bgcolor: "#eff6ff",
                                    border: "1px solid",
                                    borderColor: "#bfdbfe",
                                    boxShadow: "0 4px 15px rgba(37,99,235,0.05)",
                                    transition: "all 0.25s ease",
                                    "&:hover": { transform: "translateY(-3px)", boxShadow: "0 8px 25px rgba(37,99,235,0.12)" },
                                }}
                            >
                                <Box display="flex" alignItems="center">
                                    <Box
                                        sx={{
                                            width: 56,
                                            height: 56,
                                            borderRadius: 3,
                                            bgcolor: "#dbeafe",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            mr: 2.5,
                                        }}
                                    >
                                        <WorkspacePremiumIcon sx={{ color: "#2563eb", fontSize: 34 }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" fontWeight={700} color="#2563eb" textTransform="uppercase" letterSpacing="0.5px">
                                            Total Job Offers
                                        </Typography>
                                        <Typography variant="h4" fontWeight={800} color="#1d4ed8">
                                            {student.totalOffersCount || student.placedCompanies?.length || 1} Offer(s)
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3.5,
                                    borderRadius: 4,
                                    bgcolor: "#faf5ff",
                                    border: "1px solid",
                                    borderColor: "#e9d5ff",
                                    boxShadow: "0 4px 15px rgba(147,51,234,0.05)",
                                    transition: "all 0.25s ease",
                                    "&:hover": { transform: "translateY(-3px)", boxShadow: "0 8px 25px rgba(147,51,234,0.12)" },
                                }}
                            >
                                <Box display="flex" alignItems="center">
                                    <Box
                                        sx={{
                                            width: 56,
                                            height: 56,
                                            borderRadius: 3,
                                            bgcolor: "#f3e8ff",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            mr: 2.5,
                                        }}
                                    >
                                        <CardMembershipIcon sx={{ color: "#9333ea", fontSize: 34 }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" fontWeight={700} color="#9333ea" textTransform="uppercase" letterSpacing="0.5px">
                                            Verified Certifications
                                        </Typography>
                                        <Typography variant="h4" fontWeight={800} color="#7e22ce">
                                            {student.certifications?.length || 0} Completed
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>

                {/* 4. PLACEMENT SELECTIONS & OFFERS SECTION */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3.5, sm: 4.5 },
                        borderRadius: 5,
                        border: "1px solid",
                        borderColor: "divider",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
                        bgcolor: "background.paper",
                        mb: 4.5,
                    }}
                >
                    {/* Title Heading with generous spacing */}
                    <Stack direction="row" alignItems="center" spacing={1.5} mb={3.5}>
                        <BusinessIcon color="primary" sx={{ fontSize: 30 }} />
                        <Typography variant="h5" fontWeight={800} color="#0f172a">
                            Placement Selections & Offers
                        </Typography>
                    </Stack>

                    <Grid container spacing={3.5}>
                        {student.placedCompanies && student.placedCompanies.length > 0 ? (
                            student.placedCompanies.map((offer, index) => (
                                <Grid item xs={12} sm={6} key={index}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 3.5,
                                            borderRadius: 4,
                                            border: "1px solid",
                                            borderColor: "divider",
                                            borderLeft: "5px solid #16a34a",
                                            bgcolor: "#f8fafc",
                                            boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
                                            transition: "all 0.25s ease",
                                            "&:hover": { boxShadow: "0 8px 20px rgba(0,0,0,0.06)", transform: "translateY(-2px)", bgcolor: "background.paper" },
                                        }}
                                    >
                                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={2}>
                                            <Box>
                                                <Typography variant="h6" fontWeight={800} color="#0f172a">
                                                    {offer.companyName}
                                                </Typography>
                                                {offer.roleOffered && (
                                                    <Stack direction="row" alignItems="center" spacing={0.8} mt={1}>
                                                        <WorkIcon sx={{ fontSize: 18, color: "#64748b" }} />
                                                        <Typography variant="body1" color="#475569" fontWeight={600}>
                                                            {offer.roleOffered}
                                                        </Typography>
                                                    </Stack>
                                                )}
                                            </Box>

                                            <Chip
                                                label={`₹${offer.packageOfferedLpa || 0} LPA`}
                                                color="success"
                                                sx={{ fontWeight: 800, fontSize: "0.95rem", py: 2, px: 1, borderRadius: 2.5 }}
                                            />
                                        </Box>

                                        {offer.selectionDate && (
                                            <Stack direction="row" alignItems="center" spacing={1} mt={2.5}>
                                                <CalendarTodayIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                                                <Typography variant="body2" color="#64748b" fontWeight={500}>
                                                    Selected On: {new Date(offer.selectionDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                                                </Typography>
                                            </Stack>
                                        )}
                                    </Paper>
                                </Grid>
                            ))
                        ) : (
                            <Grid item xs={12}>
                                <Typography variant="body1" color="text.secondary">
                                    No selection offer records listed.
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </Paper>

                {/* 5. VERIFIED CERTIFICATIONS & LICENSES SECTION */}
                {student.certifications && student.certifications.length > 0 && (
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 3.5, sm: 4.5 },
                            borderRadius: 5,
                            border: "1px solid",
                            borderColor: "divider",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
                            bgcolor: "background.paper",
                            mb: 4.5,
                        }}
                    >
                        {/* Title Heading with generous spacing */}
                        <Stack direction="row" alignItems="center" spacing={1.5} mb={3.5}>
                            <CardMembershipIcon sx={{ color: "#9333ea", fontSize: 30 }} />
                            <Typography variant="h5" fontWeight={800} color="#0f172a">
                                Verified Certifications & Licenses
                            </Typography>
                        </Stack>

                        <Grid container spacing={3.5}>
                            {student.certifications.map((cert) => (
                                <Grid item xs={12} sm={6} key={cert.id}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 3.5,
                                            borderRadius: 4,
                                            border: "1px solid",
                                            borderColor: "#e9d5ff",
                                            borderLeft: "5px solid #9333ea",
                                            bgcolor: "#faf5ff",
                                            transition: "all 0.25s ease",
                                            "&:hover": { boxShadow: "0 8px 20px rgba(147,51,234,0.08)", transform: "translateY(-2px)" },
                                        }}
                                    >
                                        <Typography variant="h6" fontWeight={800} color="#6b21a8">
                                            {cert.certificateName}
                                        </Typography>

                                        {cert.provider && (
                                            <Typography variant="body1" color="#475569" fontWeight={600} mt={0.8}>
                                                Issued by: {cert.provider}
                                            </Typography>
                                        )}

                                        {cert.issueDate && (
                                            <Typography variant="caption" color="#64748b" display="block" mt={0.5}>
                                                Date: {new Date(cert.issueDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                                            </Typography>
                                        )}

                                        {cert.skillsLearned && cert.skillsLearned.length > 0 && (
                                            <Stack direction="row" spacing={0.8} mt={2.5} flexWrap="wrap" gap={0.8}>
                                                {cert.skillsLearned.map((sk, idx) => (
                                                    <Chip
                                                        key={idx}
                                                        label={sk}
                                                        size="small"
                                                        sx={{ bgcolor: "white", color: "#7e22ce", fontWeight: 700, border: "1px solid #e9d5ff" }}
                                                    />
                                                ))}
                                            </Stack>
                                        )}
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                )}

                {/* 6. TECHNICAL SKILLS SECTION */}
                {student.skills && student.skills.length > 0 && (
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 3.5, sm: 4.5 },
                            borderRadius: 5,
                            border: "1px solid",
                            borderColor: "divider",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
                            bgcolor: "background.paper",
                            mb: 4.5,
                        }}
                    >
                        {/* Title Heading with generous spacing */}
                        <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
                            <CodeIcon color="primary" sx={{ fontSize: 30 }} />
                            <Typography variant="h5" fontWeight={800} color="#0f172a">
                                Technical Skills & Competencies
                            </Typography>
                        </Stack>

                        <Stack direction="row" spacing={1.5} flexWrap="wrap" gap={1.5}>
                            {student.skills.map((skill, idx) => (
                                <Chip
                                    key={idx}
                                    label={skill}
                                    color="primary"
                                    variant="outlined"
                                    sx={{
                                        fontWeight: 700,
                                        borderRadius: 2.5,
                                        px: 2,
                                        py: 2.2,
                                        fontSize: "0.92rem",
                                        borderColor: "primary.main",
                                        "&:hover": { bgcolor: "primary.50" },
                                    }}
                                />
                            ))}
                        </Stack>
                    </Paper>
                )}

                {/* 7. SOCIAL & PROFESSIONAL PROFILES SECTION (Placed after Skills section with clean alignment) */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3.5, sm: 4.5 },
                        borderRadius: 5,
                        border: "1px solid",
                        borderColor: "divider",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
                        bgcolor: "background.paper",
                    }}
                >
                    {/* Title Heading with generous spacing */}
                    <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
                        <ShareIcon color="primary" sx={{ fontSize: 30 }} />
                        <Typography variant="h5" fontWeight={800} color="#0f172a">
                            Social & Professional Profiles
                        </Typography>
                    </Stack>

                    <Typography variant="body1" color="text.secondary" mb={3.5} fontWeight={500}>
                        Connect with {student.studentName} on professional and developer platforms:
                    </Typography>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5} flexWrap="wrap" gap={2}>
                        {student.linkedinLink ? (
                            <Button
                                variant="contained"
                                startIcon={<LinkedInIcon sx={{ fontSize: "24px !important" }} />}
                                href={student.linkedinLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    bgcolor: "#0077b5",
                                    color: "white",
                                    fontWeight: 700,
                                    borderRadius: 3,
                                    px: 3.5,
                                    py: 1.4,
                                    fontSize: "0.95rem",
                                    textTransform: "none",
                                    boxShadow: "0 4px 16px rgba(0,119,181,0.25)",
                                    "&:hover": { bgcolor: "#005582", transform: "translateY(-2px)" },
                                    transition: "all 0.2s ease",
                                }}
                            >
                                Connect on LinkedIn
                            </Button>
                        ) : (
                            <Chip
                                label="LinkedIn Profile Not Provided"
                                variant="outlined"
                                sx={{ py: 2, px: 1, borderRadius: 2.5, fontWeight: 600 }}
                            />
                        )}

                        {student.githubLink ? (
                            <Button
                                variant="contained"
                                startIcon={<GitHubIcon sx={{ fontSize: "24px !important" }} />}
                                href={student.githubLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    bgcolor: "#181717",
                                    color: "white",
                                    fontWeight: 700,
                                    borderRadius: 3,
                                    px: 3.5,
                                    py: 1.4,
                                    fontSize: "0.95rem",
                                    textTransform: "none",
                                    boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
                                    "&:hover": { bgcolor: "#000", transform: "translateY(-2px)" },
                                    transition: "all 0.2s ease",
                                }}
                            >
                                View GitHub Repositories
                            </Button>
                        ) : (
                            <Chip
                                label="GitHub Profile Not Provided"
                                variant="outlined"
                                sx={{ py: 2, px: 1, borderRadius: 2.5, fontWeight: 600 }}
                            />
                        )}
                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
};

export default PlacedStudentProfilePage;
