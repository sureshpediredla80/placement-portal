import { useEffect, useState } from "react";
import {
    Container,
    Card,
    CardContent,
    Typography,
    Box,
    Avatar,
    Chip,
    Button,
    Stack,
    Alert,
    ToggleButton,
    ToggleButtonGroup,
    Grid,
    Paper,
    Fade
} from "@mui/material";
import AppSnackbar from "../../../components/common/AppSnackbar";
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import UpdateProfileDialog from "../components/UpdateProfileDialog";
import axiosInstance from "../../../services/axiosInstance";
import AppLoader from "../../../components/common/AppLoader";
import LinkIcon from "@mui/icons-material/Link";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import DescriptionIcon from "@mui/icons-material/Description";
import CodeIcon from "@mui/icons-material/Code";
import EditIcon from "@mui/icons-material/Edit";

// Icons for the Info Cards
import {
    FaUser,
    FaEnvelope,
    FaVenusMars,
    FaTint,
    FaBirthdayCake,
    FaUserGraduate,
    FaGraduationCap,
    FaPhoneAlt,
    FaHome,
    FaMapMarkerAlt,
    FaIdCard
} from "react-icons/fa";
import { MdVerified, MdAssignmentTurnedIn } from "react-icons/md";

// Assuming you have these avatars based on your earlier code
import maleAvatar from "../../../assets/avatars/male.png";
import femaleAvatar from "../../../assets/avatars/female.png";
import otherAvatar from "../../../assets/avatars/other.png";

// Helper to format values elegantly
const formatEnum = (value) => {
    if (value === undefined || value === null || value === "") return "-";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    return String(value)
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
};

// Reusable elegant Info Card
const InfoCard = ({ icon, title, value, iconColor = "#1976d2" }) => (
    <Stack direction="row" spacing={2.5} alignItems="flex-start">
        <Avatar
            sx={{
                width: 58,
                height: 58,
                bgcolor: "#EEF4FF",
                color: iconColor,
                flexShrink: 0,
            }}
        >
            {icon}
        </Avatar>
        <Box>
            <Typography sx={{ color: "#667085", fontWeight: 500, fontSize: 15 }}>
                {title}
            </Typography>
            <Typography sx={{ mt: 0.5, fontWeight: 700, fontSize: 17, wordBreak: "break-word" }}>
                {value || "-"}
            </Typography>
        </Box>
    </Stack>
);

const StudentProfilePage = () => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const [activeSection, setActiveSection] = useState("personal");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axiosInstance.get("/api/students/me");
            setStudent(res.data);
        } catch (err) {
            setError("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <AppLoader />;
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    // Determine avatar
    const avatarImage =
        student?.gender === "FEMALE"
            ? femaleAvatar
            : student?.gender === "OTHER"
                ? otherAvatar
                : maleAvatar;

    return (
        <>
            <Container maxWidth="xl" sx={{ py: 4 }}>
                {/* Premium Header Profile Card */}
                <Box
                    sx={{
                        mb: 5,
                        borderRadius: 5,
                        background: "linear-gradient(135deg, #1565C0, #42A5F5)",
                        color: "white",
                        p: { xs: 4, md: 5 },
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        alignItems: "center",
                        justifyContent: "space-between",
                        boxShadow: "0 20px 40px rgba(21, 101, 192, 0.25)",
                        position: "relative",
                        overflow: "hidden"
                    }}
                >
                    <Box display="flex" flexDirection={{ xs: "column", md: "row" }} alignItems="center" gap={4} zIndex={1}>
                        <Avatar
                            src={avatarImage}
                            alt={student?.user?.fullName}
                            sx={{
                                width: 130,
                                height: 130,
                                border: "5px solid white",
                                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                                bgcolor: "white",
                                color: "#1976d2",
                                fontSize: 48,
                                fontWeight: 700
                            }}
                        >
                            {/* Fallback to initials if image is missing */}
                            {student?.user?.fullName?.charAt(0)}
                        </Avatar>

                        <Box textAlign={{ xs: "center", md: "left" }}>
                            <Typography variant="h3" fontWeight={800} letterSpacing={-0.5}>
                                {student?.user?.fullName}
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9, mt: 0.5, letterSpacing: 1 }}>
                                {student?.rollNumber}
                            </Typography>
                            <Typography
                                sx={{
                                    mt: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: { xs: "center", md: "flex-start" },
                                    gap: 1.5,
                                    fontWeight: 600,
                                    fontSize: '1.1rem',
                                    flexWrap: "wrap"
                                }}
                            >
                                <FaGraduationCap size={22} />
                                {student?.branch?.name} • {student?.year} Year • {student?.cgpa} CGPA
                            </Typography>
                            <Chip
                                sx={{
                                    mt: 2.5,
                                    fontWeight: 800,
                                    bgcolor: "white",
                                    color: "primary.main",
                                    fontSize: '1rem',
                                    py: 2.5,
                                    px: 2,
                                    borderRadius: 3
                                }}
                                label={student?.user?.isActive ? "Active Student" : "Inactive"}
                            />
                        </Box>
                    </Box>

                    <Box mt={{ xs: 4, md: 0 }} zIndex={1}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<EditIcon />}
                            onClick={() => setOpenUpdateDialog(true)}
                            sx={{
                                bgcolor: 'white',
                                color: '#1565C0',
                                fontWeight: 700,
                                px: 4,
                                py: 1.5,
                                borderRadius: 3,
                                fontSize: '1.05rem',
                                boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                                '&:hover': {
                                    bgcolor: '#f8f9fa',
                                    transform: 'translateY(-2px)',
                                    boxShadow: "0 12px 20px rgba(0,0,0,0.15)"
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Update Profile
                        </Button>
                    </Box>
                </Box>

                {/* Styled Toggle Tabs */}
                <Box sx={{ display: "flex", justifyContent: "center", mb: 5 }}>
                    <ToggleButtonGroup
                        exclusive
                        value={activeSection}
                        onChange={(e, value) => {
                            if (value !== null) setActiveSection(value);
                        }}
                        sx={{
                            backgroundColor: "#F5F7FA",
                            borderRadius: "20px",
                            padding: "6px",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            "& .MuiToggleButton-root": {
                                border: "none",
                                borderRadius: "16px !important",
                                px: 4,
                                py: 1.5,
                                mx: 0.5,
                                textTransform: "none",
                                fontWeight: 700,
                                fontSize: '1rem',
                                color: "#667085",
                                transition: "all .3s ease",
                                "&:hover": {
                                    backgroundColor: "#EAF2FF",
                                    color: "#1976d2",
                                    transform: "translateY(-2px)",
                                },
                            },
                            "& .Mui-selected": {
                                backgroundColor: "#1976d2 !important",
                                color: "#fff !important",
                                boxShadow: "0 8px 16px rgba(25,118,210,.3)",
                            },
                        }}
                    >
                        <ToggleButton value="personal">
                            <PersonIcon sx={{ mr: 1, fontSize: 22 }} /> Personal
                        </ToggleButton>
                        <ToggleButton value="academic">
                            <SchoolIcon sx={{ mr: 1, fontSize: 22 }} /> Academic
                        </ToggleButton>
                        <ToggleButton value="admission">
                            <HowToRegIcon sx={{ mr: 1, fontSize: 22 }} /> Admission
                        </ToggleButton>
                        <ToggleButton value="links">
                            <LinkIcon sx={{ mr: 1, fontSize: 22 }} /> Links
                        </ToggleButton>
                        <ToggleButton value="skills">
                            <CodeIcon sx={{ mr: 1, fontSize: 22 }} /> Skills
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                <Box sx={{ minHeight: "50vh" }}>
                    {/* Personal Information */}
                    {activeSection === "personal" && (
                        <Fade in={true} timeout={400}>
                            <Paper elevation={0} sx={{ p: 5, borderRadius: 6, boxShadow: "0 12px 35px rgba(0,0,0,.06)", border: '1px solid #f0f0f0', mx: "auto", maxWidth: 1200 }}>
                                <Box sx={{ mb: 6 }}>
                                    <Typography
                                        variant="h5"
                                        fontWeight={800}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1.5,
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                bgcolor: "#EEF4FF",
                                                color: "#1976d2",
                                                width: 48,
                                                height: 48,
                                            }}
                                        >
                                            <FaUser size={20} />
                                        </Avatar>

                                        Personal Information
                                    </Typography>
                                </Box>
                                <Grid container spacing={4}>
                                    <Grid item xs={12} md={4}><InfoCard icon={<FaUser size={24} />} title="Full Name" value={student?.user?.fullName} /></Grid>
                                    <Grid item xs={12} md={4}><InfoCard icon={<FaEnvelope size={24} />} title="College Email" value={student?.user?.email} /></Grid>
                                    <Grid item xs={12} md={4}><InfoCard icon={<FaVenusMars size={24} />} title="Gender" value={formatEnum(student?.gender)} /></Grid>
                                    <Grid item xs={12} md={4}><InfoCard icon={<FaBirthdayCake size={24} />} title="Date Of Birth" value={student?.dateOfBirth} /></Grid>
                                    <Grid item xs={12} md={4}><InfoCard icon={<FaTint size={24} />} iconColor="#d32f2f" title="Blood Group" value={formatEnum(student?.bloodGroup)} /></Grid>
                                    <Grid item xs={12} md={4}><InfoCard icon={<FaHome size={24} />} title="Residence Type" value={formatEnum(student?.residenceType)} /></Grid>
                                    <Grid item xs={12} md={4}>
                                        <InfoCard
                                            icon={<FaIdCard size={24} />}
                                            title="Aadhaar Number"
                                            value={student?.aadhaarNumber}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}><InfoCard icon={<FaPhoneAlt size={24} />} iconColor="#2E7D32" title="WhatsApp Number" value={student?.whatsappNumber} /></Grid>
                                    <Grid item xs={12} md={4}><InfoCard icon={<FaEnvelope size={24} />} title="Personal Email" value={student?.personalEmail} /></Grid>
                                    <Grid item xs={12} md={4}><InfoCard icon={<FaPhoneAlt size={24} />} iconColor="#FF9800" title="Parent Contact" value={student?.parentContactNumber} /></Grid>
                                    <Grid item xs={12} md={4}><InfoCard icon={<FaEnvelope size={24} />} iconColor="#8E24AA" title="Parent Email" value={student?.parentEmail} /></Grid>
                                    <Grid item xs={12} md={4}><InfoCard icon={<MdVerified size={24} />} title="Account Status" value={student?.user?.isActive ? "Active" : "Inactive"} /></Grid>
                                    <Grid item xs={12}>
                                        <Paper variant="outlined" sx={{ p: 3, borderRadius: 4, bgcolor: "#FAFBFC", border: "1px solid #E5E7EB" }}>
                                            <Stack direction="row" spacing={3} alignItems="flex-start">
                                                <Avatar sx={{ width: 58, height: 58, bgcolor: "#EEF4FF", color: "#1976d2" }}>
                                                    <FaMapMarkerAlt size={24} />
                                                </Avatar>
                                                <Box>
                                                    <Typography sx={{ color: "#667085", fontWeight: 600, fontSize: 16 }}>Residential Address</Typography>
                                                    <Typography sx={{ mt: 0.5, fontSize: 18, fontWeight: 700 }}>{student?.residentialAddress || "Not Provided"}</Typography>
                                                </Box>
                                            </Stack>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Fade>
                    )}

                    {/* Academic Information */}
                    {activeSection === "academic" && (
                        <Fade in={true} timeout={400}>
                            <Paper elevation={0} sx={{ p: 5, borderRadius: 6, boxShadow: "0 12px 35px rgba(0,0,0,.06)", border: '1px solid #f0f0f0', mx: "auto", maxWidth: 1200 }}>
                                <Box sx={{ mb: 6 }}>
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        spacing={2}
                                        mb={4}
                                    >
                                        <Avatar
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                bgcolor: "#EEF4FF",
                                                color: "#1976d2",
                                            }}
                                        >
                                            <FaGraduationCap size={24} />
                                        </Avatar>

                                        <Typography
                                            variant="h5"
                                            fontWeight={800}
                                        >
                                            Academic Information
                                        </Typography>
                                    </Stack>
                                </Box>
                                <Grid container spacing={4}>
                                    <Grid item xs={12} md={4}><InfoCard icon={<FaUserGraduate size={24} />} title="Roll Number" value={student?.rollNumber} /></Grid>
                                    <Grid item xs={12} md={4}><InfoCard icon={<SchoolIcon sx={{ fontSize: 28 }} />} title="Branch" value={student?.branch?.name} /></Grid>
                                    <Grid item xs={12} md={4}><InfoCard icon={<SchoolIcon sx={{ fontSize: 28 }} />} title="Branch Code" value={student?.branch?.code} /></Grid>
                                    <Grid item xs={12} md={4}><InfoCard icon={<SchoolIcon sx={{ fontSize: 28 }} />} title="Department" value={student?.branch?.department} /></Grid>
                                    <Grid item xs={12} md={4}><InfoCard icon={<MdVerified size={28} />} iconColor="#2E7D32" title="Year" value={`${student?.year} Year`} /></Grid>
                                    <Grid item xs={12} md={4}><InfoCard icon={<FaGraduationCap size={28} />} title="CGPA" value={student?.cgpa} /></Grid>
                                    <Grid item xs={12} md={4}>
                                        <InfoCard
                                            icon={<FaGraduationCap size={28} />}
                                            title="Diploma Percentage"
                                            value={student?.diplomaPercentage}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}><InfoCard icon={<FaGraduationCap size={28} />} iconColor="#FF9800" title="SSC Percentage" value={student?.sscPercentage} /></Grid>
                                    <Grid item xs={12} md={4}><InfoCard icon={<FaGraduationCap size={28} />} iconColor="#8E24AA" title="Intermediate Percentage" value={student?.intermediatePercentage} /></Grid>
                                    <Grid item xs={12} md={4}><InfoCard icon={<MdVerified size={28} />} iconColor="#D32F2F" title="Backlogs" value={student?.backlogs} /></Grid>
                                    <Grid item xs={12} md={4}><InfoCard icon={<MdVerified size={28} />} iconColor="#2E7D32" title="First Attempt Passed" value={formatEnum(student?.firstAttemptInAllSemesters)} /></Grid>
                                </Grid>
                            </Paper>
                        </Fade>
                    )}

                    {/* Admission Information */}
                    {activeSection === "admission" && (
                        <Fade in={true} timeout={400}>
                            <Paper elevation={0} sx={{ p: 5, borderRadius: 6, boxShadow: "0 12px 35px rgba(0,0,0,.06)", border: '1px solid #f0f0f0', mx: "auto", maxWidth: 1000 }}>
                                <Box sx={{ mb: 6 }}>
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        spacing={2}
                                        mb={4}
                                    >
                                        <Avatar
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                bgcolor: "#EEF4FF",
                                                color: "#1976d2",
                                            }}
                                        >
                                            <HowToRegIcon sx={{ fontSize: 26 }} />
                                        </Avatar>

                                        <Typography
                                            variant="h5"
                                            fontWeight={800}
                                        >
                                            Admission Information
                                        </Typography>
                                    </Stack>
                                </Box>
                                <Grid container spacing={4}>
                                    <Grid item xs={12} md={6}><InfoCard icon={<MdAssignmentTurnedIn size={28} />} title="Admission Type" value={student?.admissionType} /></Grid>
                                    <Grid item xs={12} md={6}><InfoCard icon={<FaIdCard size={28} />} title="Entrance Exam" value={student?.entranceExam} /></Grid>
                                    <Grid item xs={12} md={6}><InfoCard icon={<MdVerified size={28} />} iconColor="#2E7D32" title="Entrance Rank" value={student?.entranceRank} /></Grid>
                                    <Grid item xs={12} md={6}><InfoCard icon={<FaUser size={28} />} title="Role" value="Student" /></Grid>
                                    <Grid item xs={12} md={6}><InfoCard icon={<FaGraduationCap size={28} />} iconColor="#2E7D32" title="Graduated" value={formatEnum(student?.graduated)} /></Grid>
                                </Grid>
                            </Paper>
                        </Fade>
                    )}

                    {/* Professional Links */}
                    {activeSection === "links" && (
                        <Fade in={true} timeout={400}>
                            <Paper elevation={0} sx={{ p: 5, borderRadius: 6, boxShadow: "0 12px 35px rgba(0,0,0,.06)", border: '1px solid #f0f0f0', mx: "auto", maxWidth: 850 }}>
                                <Box sx={{ mb: 6 }}>
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        spacing={2}
                                        mb={4}
                                    >
                                        <Avatar
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                bgcolor: "#EEF4FF",
                                                color: "#1976d2",
                                            }}
                                        >
                                            <LinkIcon sx={{ fontSize: 26 }} />
                                        </Avatar>

                                        <Typography
                                            variant="h5"
                                            fontWeight={800}
                                        >
                                            Professional Links
                                        </Typography>
                                    </Stack>
                                </Box>
                                <Stack spacing={3}>
                                    <Button
                                        startIcon={<GitHubIcon size={24} />}
                                        variant="outlined"
                                        component="a"
                                        href={student?.githubLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        disabled={!student?.githubLink}
                                        sx={{ borderRadius: 3, py: 1.5, fontSize: '1.1rem', fontWeight: 700, justifyContent: "flex-start", px: 4 }}
                                    >
                                        {student?.githubLink ? "View GitHub Profile" : "GitHub Not Provided"}
                                    </Button>
                                    <Button
                                        startIcon={<LinkedInIcon size={24} />}
                                        variant="outlined"
                                        component="a"
                                        href={student?.linkedinLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        disabled={!student?.linkedinLink}
                                        sx={{ borderRadius: 3, py: 1.5, fontSize: '1.1rem', fontWeight: 700, justifyContent: "flex-start", px: 4 }}
                                    >
                                        {student?.linkedinLink ? "View LinkedIn Profile" : "LinkedIn Not Provided"}
                                    </Button>
                                    <Button
                                        startIcon={<DescriptionIcon size={24} />}
                                        variant="contained"
                                        component="a"
                                        href={student?.resumeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        disabled={!student?.resumeUrl}
                                        sx={{ borderRadius: 3, py: 1.5, fontSize: '1.1rem', fontWeight: 700, justifyContent: "flex-start", px: 4, boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}
                                    >
                                        {student?.resumeUrl ? "View Resume Document" : "Resume Not Provided"}
                                    </Button>
                                </Stack>
                            </Paper>
                        </Fade>
                    )}

                    {/* Skills */}
                    {activeSection === "skills" && (
                        <Fade in={true} timeout={400}>
                            <Paper elevation={0} sx={{ p: 5, borderRadius: 6, boxShadow: "0 12px 35px rgba(0,0,0,.06)", border: '1px solid #f0f0f0', mx: "auto", maxWidth: 850 }}>
                                <Box sx={{ mb: 6 }}>
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        spacing={2}
                                        mb={4}
                                    >
                                        <Avatar
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                bgcolor: "#EEF4FF",
                                                color: "#1976d2",
                                            }}
                                        >
                                            <CodeIcon sx={{ fontSize: 26 }} />
                                        </Avatar>

                                        <Typography
                                            variant="h5"
                                            fontWeight={800}
                                        >
                                            Technical Skills
                                        </Typography>
                                    </Stack>
                                </Box>
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                                    {student?.skills?.length > 0 ? (
                                        student.skills.map((skill) => (
                                            <Chip
                                                key={skill.id}
                                                label={skill.name}
                                                color="primary"
                                                sx={{ fontSize: '1.05rem', py: 2.5, px: 2, borderRadius: 3, fontWeight: 700 }}
                                            />
                                        ))
                                    ) : (
                                        <Typography color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                                            No skills added yet.
                                        </Typography>
                                    )}
                                </Box>
                            </Paper>
                        </Fade>
                    )}
                </Box>

                {/* Dialogs and Snackbars */}
                <UpdateProfileDialog
                    open={openUpdateDialog}
                    onClose={() => setOpenUpdateDialog(false)}
                    student={student}
                    onSuccess={fetchProfile}
                    showSnackbar={showSnackbar}
                />
            </Container>

            <AppSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={handleCloseSnackbar}
            />
        </>
    );
};

export default StudentProfilePage;