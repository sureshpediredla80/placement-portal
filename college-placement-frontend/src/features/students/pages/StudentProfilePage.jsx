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
} from "@mui/material";
import AppSnackbar from "../../../components/common/AppSnackbar";
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
import Fade from "@mui/material/Fade";
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
            console.log("Student Data:", res.data);
            console.log("GitHub:", res.data.githubLink);
            console.log("LinkedIn:", res.data.linkedinLink);
            console.log("Resume:", res.data.resumeUrl);
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
        return <Alert severity="error">{error}</Alert>;
    }

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({
            ...prev,
            open: false,
        }));
    };
    const showSnackbar = (message, severity) => {
        setSnackbar({
            open: true,
            message,
            severity,
        });
    };
    return (
        <>
        <Container maxWidth="lg" sx={{ py: 3 }}>
            {/* Header */}
            <Card sx={{  mb: 4,
                borderRadius: 4,
                boxShadow: 4,
                background:
                    "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                color: "white",

            }}>
                <CardContent>
                    <Stack
                        direction="column"
                        alignItems="center"
                        spacing={2}
                    >
                        <Avatar
                            sx={{
                                bgcolor: "white",
                                color: "#1976d2",
                                width: 90,
                                height: 90,
                                fontSize: 36,
                                fontWeight: 700,
                                mb: 2,
                            }}
                        >
                            {student?.user?.fullName?.charAt(0)}
                        </Avatar>

                        <Typography variant="h4" fontWeight={700}>
                            {student?.user?.fullName}
                        </Typography>

                        <Typography color="text.secondary">
                            {student?.branch?.name}
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => setOpenUpdateDialog(true)}
                            sx={{

                                mt: 2,
                                bgcolor: "white",
                                color: "#1976d2",
                                fontWeight: 700,}}
                        >
                            Update Profile
                        </Button>

                    </Stack>
                </CardContent>
            </Card>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    mb: 4,
                }}
            >
                <ToggleButtonGroup
                    exclusive
                    value={activeSection}
                    onChange={(e, value) => {
                        if (value !== null) {
                            setActiveSection(value);
                        }
                    }}
                    sx={{
                        backgroundColor: "#F5F7FA",
                        borderRadius: "16px",
                        padding: "5px",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.08)",

                        "& .MuiToggleButton-root": {
                            border: "none",
                            borderRadius: "12px",
                            px: 3,
                            py: 1.3,
                            textTransform: "none",
                            fontWeight: 600,
                            color: "#555",
                            transition: "all .3s ease",

                            "&:hover": {
                                backgroundColor: "#EAF2FF",
                                transform: "translateY(-2px)",
                            },
                        },

                        "& .Mui-selected": {
                            backgroundColor: "#1976d2 !important",
                            color: "#fff !important",
                            boxShadow: "0 4px 12px rgba(25,118,210,.35)",
                        },
                    }}
                >
                    <ToggleButton value="personal">
                        <PersonIcon sx={{ mr: 1, fontSize: 18 }} />
                        Personal
                    </ToggleButton>

                    <ToggleButton value="academic">
                        <SchoolIcon sx={{ mr: 1, fontSize: 18 }} />
                        Academic
                    </ToggleButton>

                    <ToggleButton value="links">
                        <LinkIcon sx={{ mr: 1, fontSize: 18 }} />
                        Links
                    </ToggleButton>

                    <ToggleButton value="skills">
                        <CodeIcon sx={{ mr: 1, fontSize: 18 }} />
                        Skills
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <Box>
                {/* Personal Information */}
                <Fade
                    in={activeSection === "personal"}
                    timeout={300}
                    mountOnEnter
                    unmountOnExit
                >
                    <Card
                        sx={{
                            maxWidth: 850,
                            mx: "auto",
                            borderRadius: 4,
                            boxShadow: 4,
                        }}
                    >
                        <CardContent>
                            <Typography
                                variant="h6"
                                gutterBottom
                                fontWeight={600}
                            >
                                <PersonIcon color="primary" rt={3} />
                                Personal Information
                            </Typography>

                            <Typography>
                                <strong>Name:</strong>{" "}
                                {student?.user?.fullName}
                            </Typography>

                            <Typography>
                                <strong>Email:</strong>{" "}
                                {student?.user?.email}
                            </Typography>

                            <Typography>
                                <strong>Phone:</strong>{" "}
                                {student?.phone}
                            </Typography>

                            <Typography>
                                <strong>Role:</strong> Student
                            </Typography>

                            <Typography>
                                <strong>Status:</strong>{" "}
                                {student?.user?.isActive
                                    ? "Active"
                                    : "Inactive"}
                            </Typography>
                        </CardContent>
                    </Card>
                </Fade>

                {/* Academic Information */}
                <Fade
                    in={activeSection === "academic"}
                    timeout={300}
                    mountOnEnter
                    unmountOnExit
                >
                    <Card
                        sx={{
                            maxWidth: 850,
                            mx: "auto",
                            borderRadius: 4,
                            boxShadow: 4,
                        }}
                    >
                        <CardContent>
                            <Typography
                                variant="h6"
                                gutterBottom
                                fontWeight={600}
                            >
                                <SchoolIcon color="primary" />
                                Academic Information
                            </Typography>

                            <Typography>
                                <strong>Roll Number:</strong>{" "}
                                {student?.rollNumber}
                            </Typography>

                            <Typography>
                                <strong>Year:</strong>{" "}
                                {student?.year}
                            </Typography>

                            <Typography>
                                <strong>CGPA:</strong>{" "}
                                {student?.cgpa}
                            </Typography>

                            <Typography>
                                <strong>Branch:</strong>{" "}
                                {student?.branch?.name}
                            </Typography>

                            <Typography>
                                <strong>Department:</strong>{" "}
                                {student?.branch?.department}
                            </Typography>

                            <Typography>
                                <strong>Branch Code:</strong>{" "}
                                {student?.branch?.code}
                            </Typography>
                        </CardContent>
                    </Card>
                </Fade>

                {/* Professional Links */}
                <Fade
                    in={activeSection === "links"}
                    timeout={300}
                    mountOnEnter
                    unmountOnExit
                >
                    <Card
                        sx={{
                            maxWidth: 850,
                            mx: "auto",
                            borderRadius: 4,
                            boxShadow: 4,
                        }}
                    >
                        <CardContent>
                            <Typography
                                variant="h6"
                                gutterBottom
                                fontWeight={600}
                            >

                                <LinkIcon color="primary" />
                                Professional Links
                            </Typography>

                            <Stack spacing={2}>
                                <Button
                                    startIcon={<GitHubIcon />}
                                    variant="outlined"
                                    component="a"
                                    href={student?.githubLink}
                                    target="_blank"
                                   rel="noopener noreferrer"
                                >
                                    GitHub
                                </Button>

                                <Button
                                    startIcon={<LinkedInIcon />}
                                    variant="outlined"
                                    component="a"
                                    href={student?.linkedinLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    LinkedIn
                                </Button>

                                <Button
                                    startIcon={<DescriptionIcon />}
                                    variant="outlined"
                                    component="a"
                                    href={student?.resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Resume
                                </Button>
                            </Stack>

                        </CardContent>
                    </Card>
                </Fade>

                {/* Skills & Placement */}
                <Fade
                    in={activeSection === "skills"}
                    timeout={300}
                    mountOnEnter
                    unmountOnExit
                >
                    <Card
                        sx={{
                            maxWidth: 850,
                            mx: "auto",
                            borderRadius: 4,
                            boxShadow: 4,
                        }}
                    >
                        <CardContent>
                            <Typography
                                variant="h6"
                                gutterBottom
                                fontWeight={600}
                            >
                                Skills
                            </Typography>



                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 1,
                                }}
                            >
                                {student?.skills?.length > 0 ? (
                                    student.skills.map((skill) => (
                                        <Chip
                                            key={skill.id}
                                            label={skill.name}
                                        />
                                    ))
                                ) : (
                                    <Typography color="text.secondary">
                                        No skills added yet.
                                    </Typography>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Fade>
            </Box>
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