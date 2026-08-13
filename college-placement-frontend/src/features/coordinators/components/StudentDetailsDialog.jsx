

import SchoolIcon from "@mui/icons-material/School";
import LinkIcon from "@mui/icons-material/Link";

import maleAvatar from "../../../assets/avatars/male.png";
import femaleAvatar from "../../../assets/avatars/female.png";
import otherAvatar from "../../../assets/avatars/other.png";

import EditIcon from "@mui/icons-material/Edit";

import UpdateStudentDialog
    from "./UpdateStudentDialog";

import {
    getStudentDetails
} from "../api/coordinatorApi";
import {
    FaGithub,
    FaLinkedin,
    FaFilePdf,
    FaExternalLinkAlt
} from "react-icons/fa";
import {
    FaPhoneAlt,
    FaHome,
    FaMapMarkerAlt, FaIdCard,
} from "react-icons/fa";
import {
    FaUser,
    FaEnvelope,
    FaVenusMars,
    FaTint,
    FaBirthdayCake,
} from "react-icons/fa";
import {
    FaUserGraduate,
    FaGraduationCap,
} from "react-icons/fa";

import {
    MdCreditCard,
    MdVerified
} from "react-icons/md";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Stack,
    Chip,

} from "@mui/material";
import {
    Avatar,
    Grid,


    Paper,
} from "@mui/material";
import {
    useState,
    useEffect
} from "react";
import StudentApplicationsDialog from "./StudentApplicationsDialog";
const formatEnum = (value) => {
    if (!value) return "-";

    return value
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
};
const InfoCard = ({
                      icon,
                      title,
                      value,
                  }) => {

    return (

        <Stack
            direction="row"
            spacing={2.5}
            alignItems="flex-start"
        >

            <Avatar
                sx={{
                    width: 58,
                    height: 58,
                    bgcolor: "#EEF4FF",
                    color: "#1976d2",
                    flexShrink: 0,
                }}
            >
                {icon}
            </Avatar>

            <Box>

                <Typography
                    sx={{
                        color: "#667085",
                        fontWeight: 500,
                        fontSize: 18,
                    }}
                >
                    {title}
                </Typography>

                <Typography
                    sx={{
                        mt: .6,
                        fontWeight: 700,
                        fontSize: 20,
                        wordBreak: "break-word",
                    }}
                >
                    {value}
                </Typography>

            </Box>

        </Stack>

    );

};
const StudentDetailsDialog = ({
                                  open,
                                  onClose,
                                  student,
                              }) => {
    const avatarImage =
        student?.gender === "FEMALE"
            ? femaleAvatar
            : student?.gender === "OTHER"
                ? otherAvatar
                : maleAvatar;
    const [openApplications, setOpenApplications] =
        useState(false);
    const [
        openUpdateDialog,
        setOpenUpdateDialog
    ] = useState(false);

    const [
        studentData,
        setStudentData
    ] = useState(student);
    useEffect(() => {

        setStudentData(student);

    }, [student]);
    const refreshStudent = async () => {

        const response =
            await getStudentDetails(studentData.id);

        setStudentData(response);

    };
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>
                Student Details
            </DialogTitle>

            <DialogContent>
                <Box
                    sx={{
                        mb: 4,
                        borderRadius: 4,
                        background:
                            "linear-gradient(135deg,#1565C0,#42A5F5)",
                        color: "white",
                        py: 5,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        boxShadow: 5,
                    }}
                >
                    <Avatar
                        src={avatarImage}
                        sx={{
                            width: 110,
                            height: 110,
                            border: "4px solid white",
                            mb: 2,
                        }}
                    />

                    <Typography
                        variant="h4"
                        fontWeight={700}
                    >
                        {student?.user?.fullName}
                    </Typography>

                    <Typography
                        sx={{
                            opacity: .9,
                            mt: .5
                        }}
                    >
                        {student?.rollNumber}
                    </Typography>

                    <Typography
                        sx={{
                            mt: 2,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            fontWeight: 500
                        }}
                    >
                        <FaGraduationCap />

                        {student?.branch?.code}

                        •

                        {student?.year} Year

                        •

                        {student?.cgpa} CGPA
                    </Typography>

                    <Chip
                        sx={{
                            mt: 3,
                            fontWeight: 700,
                            bgcolor: "white",
                            color: "primary.main"
                        }}
                        label={student?.placementStatus?.replaceAll("_"," ")}
                    />
                </Box>
                {student && (
                    <Stack spacing={3}>
                        <Paper
                            elevation={6}
                            sx={{
                                borderRadius: 6,
                                overflow: "hidden",
                                boxShadow: "0 12px 35px rgba(0,0,0,.12)",
                            }}
                        >

                            {/* Heading */}

                            <Box
                                sx={{
                                    p: 4,
                                    pb: 2,
                                }}
                            >

                                <Stack
                                    direction="row"
                                    spacing={3}
                                    alignItems="center"
                                >

                                    <Avatar
                                        sx={{
                                            width: 70,
                                            height: 70,
                                            bgcolor: "#EEF4FF",
                                        }}
                                    >
                                        <FaUser
                                            size={34}
                                            color="#1976d2"
                                        />
                                    </Avatar>

                                    <Box>

                                        <Typography
                                            fontWeight={800}
                                            fontSize={42}
                                        >
                                            Personal Information
                                        </Typography>

                                        <Box
                                            sx={{
                                                width: 90,
                                                height: 5,
                                                bgcolor: "primary.main",
                                                borderRadius: 5,
                                                mt: 2,
                                            }}
                                        />

                                    </Box>

                                </Stack>

                            </Box>

                            <Box
                                sx={{
                                    px: 4,
                                    pb: 4,
                                }}
                            >

                                <Grid container spacing={4}>

                                    <Grid item xs={12} md={3}>
                                        <InfoCard
                                            icon={
                                                <FaUser
                                                    size={28}
                                                    color="#2979ff"
                                                />
                                            }
                                            title="Full Name"
                                            value={student.user.fullName}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={3}>
                                        <InfoCard
                                            icon={
                                                <FaEnvelope
                                                    size={28}
                                                    color="#2979ff"
                                                />
                                            }
                                            title="College Email"
                                            value={student.user.email}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={3}>
                                        <InfoCard
                                            icon={
                                                <FaEnvelope
                                                    size={28}
                                                    color="#2979ff"
                                                />
                                            }
                                            title="Personal Email"
                                            value={
                                                student.personalEmail || "-"
                                            }
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={3}>
                                        <InfoCard
                                            icon={
                                                <FaVenusMars
                                                    size={28}
                                                    color="#2979ff"
                                                />
                                            }
                                            title="Gender"
                                            value={formatEnum(student.gender)}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={3}>
                                        <InfoCard
                                            icon={
                                                <FaBirthdayCake
                                                    size={28}
                                                    color="#2979ff"
                                                />
                                            }
                                            title="Date Of Birth"
                                            value={
                                                student.dateOfBirth || "-"
                                            }
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={3}>
                                        <InfoCard
                                            icon={
                                                <FaTint
                                                    size={28}
                                                    color="red"
                                                />
                                            }
                                            title="Blood Group"
                                            value={formatEnum(student.bloodGroup)}
                                        />
                                    </Grid>

                                </Grid>

                            </Box>

                        </Paper>
                        <Paper
                            elevation={6}
                            sx={{
                                borderRadius: 6,
                                overflow: "hidden",
                                boxShadow: "0 12px 35px rgba(0,0,0,.12)",
                            }}
                        >

                            <Box
                                sx={{
                                    p: 4,
                                    pb: 2,
                                }}
                            >

                                <Stack
                                    direction="row"
                                    spacing={3}
                                    alignItems="center"
                                >

                                    <Avatar
                                        sx={{
                                            width: 70,
                                            height: 70,
                                            bgcolor: "#EEF4FF",
                                        }}
                                    >
                                        <FaGraduationCap
                                            size={34}
                                            color="#1976d2"
                                        />
                                    </Avatar>

                                    <Box>

                                        <Typography
                                            fontWeight={800}
                                            fontSize={42}
                                        >
                                            Academic Information
                                        </Typography>

                                        <Box
                                            sx={{
                                                width: 90,
                                                height: 5,
                                                bgcolor: "primary.main",
                                                borderRadius: 5,
                                                mt: 2,
                                            }}
                                        />

                                    </Box>

                                </Stack>

                            </Box>

                            <Box
                                sx={{
                                    px: 4,
                                    pb: 4,
                                }}
                            >

                                <Grid
                                    container
                                    spacing={4}
                                >

                                    <Grid item xs={12} md={3}>
                                        <InfoCard
                                            icon={
                                                <FaUserGraduate
                                                    size={28}
                                                    color="#2979ff"
                                                />
                                            }
                                            title="Roll Number"
                                            value={student.rollNumber}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={3}>
                                        <InfoCard
                                            icon={
                                                <SchoolIcon
                                                    sx={{
                                                        fontSize:30,
                                                        color:"#2979ff"
                                                    }}
                                                />
                                            }
                                            title="Branch"
                                            value={student.branch?.name}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={3}>
                                        <InfoCard
                                            icon={
                                                <MdVerified
                                                    size={30}
                                                    color="#2E7D32"
                                                />
                                            }
                                            title="Year"
                                            value={`${student.year} Year`}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={3}>
                                        <InfoCard
                                            icon={
                                                <FaGraduationCap
                                                    size={30}
                                                    color="#1976d2"
                                                />
                                            }
                                            title="CGPA"
                                            value={student.cgpa}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={3}>
                                        <InfoCard
                                            icon={
                                                <FaGraduationCap
                                                    size={30}
                                                    color="#FF9800"
                                                />
                                            }
                                            title="SSC Percentage"
                                            value={student.sscPercentage}

                                        />
                                    </Grid>

                                    <Grid item xs={12} md={3}>
                                        <InfoCard
                                            icon={
                                                <FaGraduationCap
                                                    size={30}
                                                    color="#8E24AA"
                                                />
                                            }
                                            title="Intermediate Percentage"
                                            value={student.intermediatePercentage}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <InfoCard
                                            icon={
                                                <FaGraduationCap
                                                    size={30}
                                                    color="#6A1B9A"
                                                />
                                            }
                                            title="Diploma CGPA"
                                            value={student.diplomaCgpa}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={3}>
                                        <InfoCard
                                            icon={
                                                <MdVerified
                                                    size={30}
                                                    color="#D32F2F"
                                                />
                                            }
                                            title="Backlogs"
                                            value={student.backlogs}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={3}>
                                        <InfoCard
                                            icon={
                                                <MdVerified
                                                    size={30}
                                                    color="#2E7D32"
                                                />
                                            }
                                            title="First Attempt"
                                            value={
                                                student.firstAttemptInAllSemesters
                                                    ? "Yes"
                                                    : "No"
                                            }
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={3}>
                                        <InfoCard
                                            icon={
                                                <SchoolIcon
                                                    sx={{
                                                        fontSize:30,
                                                        color:"#3949AB"
                                                    }}
                                                />
                                            }
                                            title="Admission"
                                            value={student.admissionType}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={3}>
                                        <InfoCard
                                            icon={
                                                <SchoolIcon
                                                    sx={{
                                                        fontSize:30,
                                                        color:"#5E35B1"
                                                    }}
                                                />
                                            }
                                            title="Entrance Exam"
                                            value={student.entranceExam}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={3}>
                                        <InfoCard
                                            icon={
                                                <MdVerified
                                                    size={30}
                                                    color="#1565C0"
                                                />
                                            }
                                            title="Entrance Rank"
                                            value={student.entranceRank}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={3}>
                                        <InfoCard
                                            icon={
                                                <MdVerified
                                                    size={30}
                                                    color="#2E7D32"
                                                />
                                            }
                                            title="Graduated"
                                            value={
                                                student.graduated
                                                    ? "Yes"
                                                    : "No"
                                            }
                                        />
                                    </Grid>

                                </Grid>

                            </Box>

                        </Paper>
                        <Paper
                            elevation={6}
                            sx={{
                                borderRadius: 6,
                                overflow: "hidden",
                                boxShadow: "0 12px 35px rgba(0,0,0,.12)",
                            }}
                        >

                            {/* Heading */}

                            <Box
                                sx={{
                                    p: 4,
                                    pb: 2,
                                }}
                            >

                                <Stack
                                    direction="row"
                                    spacing={3}
                                    alignItems="center"
                                >

                                    <Avatar
                                        sx={{
                                            width: 70,
                                            height: 70,
                                            bgcolor: "#EEF4FF",
                                        }}
                                    >
                                        <FaEnvelope
                                            size={34}
                                            color="#1976d2"
                                        />
                                    </Avatar>

                                    <Box>

                                        <Typography
                                            fontWeight={800}
                                            fontSize={42}
                                        >
                                            Contact Information
                                        </Typography>

                                        <Box
                                            sx={{
                                                width: 90,
                                                height: 5,
                                                bgcolor: "primary.main",
                                                borderRadius: 5,
                                                mt: 2,
                                            }}
                                        />

                                    </Box>

                                </Stack>

                            </Box>

                            <Box
                                sx={{
                                    px: 4,
                                    pb: 4,
                                }}
                            >

                                <Grid
                                    container
                                    spacing={4}
                                >

                                    <Grid item xs={12} md={4}>
                                        <InfoCard
                                            icon={
                                                <FaPhoneAlt
                                                    size={28}
                                                    color="#2E7D32"
                                                />
                                            }
                                            title="WhatsApp Number"
                                            value={
                                                student.whatsappNumber || "-"
                                            }
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={4}>
                                        <InfoCard
                                            icon={
                                                <FaEnvelope
                                                    size={28}
                                                    color="#1976d2"
                                                />
                                            }
                                            title="Personal Email"
                                            value={
                                                student.personalEmail || "-"
                                            }
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={4}>
                                        <InfoCard
                                            icon={
                                                <FaPhoneAlt
                                                    size={28}
                                                    color="#FF9800"
                                                />
                                            }
                                            title="Parent Contact"
                                            value={
                                                student.parentContactNumber || "-"
                                            }
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <InfoCard
                                            icon={
                                                <FaEnvelope
                                                    size={28}
                                                    color="#8E24AA"
                                                />
                                            }
                                            title="Parent Email"
                                            value={
                                                student.parentEmail || "-"
                                            }
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <InfoCard
                                            icon={
                                                <FaHome
                                                    size={28}
                                                    color="#1565C0"
                                                />
                                            }
                                            title="Residence Type"
                                            value={
                                                formatEnum(student.residenceType)
                                            }
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Paper
                                            variant="outlined"
                                            sx={{
                                                p: 3,
                                                borderRadius: 4,
                                                bgcolor: "#FAFBFC",
                                                border: "1px solid #E5E7EB",
                                            }}
                                        >

                                            <Stack
                                                direction="row"
                                                spacing={2}
                                                alignItems="flex-start"
                                            >

                                                <Avatar
                                                    sx={{
                                                        width: 58,
                                                        height: 58,
                                                        bgcolor: "#EEF4FF",
                                                    }}
                                                >
                                                    <FaMapMarkerAlt
                                                        size={24}
                                                        color="#1976d2"
                                                    />
                                                </Avatar>

                                                <Box>

                                                    <Typography
                                                        sx={{
                                                            color: "#667085",
                                                            fontWeight: 500,
                                                            fontSize: 18,
                                                        }}
                                                    >
                                                        Residential Address
                                                    </Typography>

                                                    <Typography
                                                        sx={{
                                                            mt: 1,
                                                            fontSize: 24,
                                                            fontWeight: 700,
                                                            lineHeight: 1.7,
                                                        }}
                                                    >
                                                        {
                                                            student.residentialAddress
                                                            || "-"
                                                        }
                                                    </Typography>

                                                </Box>

                                            </Stack>

                                        </Paper>
                                    </Grid>

                                </Grid>

                            </Box>

                        </Paper>


                        <Paper
                            elevation={6}
                            sx={{
                                borderRadius: 6,
                                overflow: "hidden",
                                boxShadow: "0 12px 35px rgba(0,0,0,.12)",
                            }}
                        >
                            {/* Heading */}

                            <Box
                                sx={{
                                    p: 4,
                                    pb: 2,
                                }}
                            >
                                <Stack
                                    direction="row"
                                    spacing={3}
                                    alignItems="center"
                                >
                                    <Avatar
                                        sx={{
                                            width: 70,
                                            height: 70,
                                            bgcolor: "#EEF4FF",
                                        }}
                                    >
                                        <FaIdCard
                                            size={34}
                                            color="#1976d2"
                                        />
                                    </Avatar>

                                    <Box>
                                        <Typography
                                            fontWeight={800}
                                            fontSize={42}
                                        >
                                            Identity Details
                                        </Typography>

                                        <Box
                                            sx={{
                                                width: 90,
                                                height: 5,
                                                bgcolor: "primary.main",
                                                borderRadius: 5,
                                                mt: 2,
                                            }}
                                        />
                                    </Box>
                                </Stack>
                            </Box>

                            {/* Content */}

                            <Box
                                sx={{
                                    px: 4,
                                    pb: 4,
                                }}
                            >
                                <Grid
                                    container
                                    spacing={4}
                                >
                                    <Grid item xs={12} md={4}>
                                        <InfoCard
                                            icon={
                                                <FaIdCard
                                                    size={28}
                                                    color="#1976d2"
                                                />
                                            }
                                            title="Aadhaar Number"
                                            value={student.aadhaarNumber || "-"}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={4}>
                                        <InfoCard
                                            icon={
                                                <MdCreditCard
                                                    size={28}
                                                    color="#8E24AA"
                                                />
                                            }
                                            title="PAN Number"
                                            value={student.panNumber || "-"}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={4}>
                                        <InfoCard
                                            icon={
                                                <FaHome
                                                    size={28}
                                                    color="#1565C0"
                                                />
                                            }
                                            title="Residence Type"
                                            value={formatEnum(student.residenceType)}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Paper
                                            variant="outlined"
                                            sx={{
                                                p: 3,
                                                borderRadius: 4,
                                                bgcolor: "#FAFBFC",
                                                border: "1px solid #E5E7EB",
                                            }}
                                        >
                                            <Stack
                                                direction="row"
                                                spacing={2}
                                                alignItems="flex-start"
                                            >
                                                <Avatar
                                                    sx={{
                                                        width: 58,
                                                        height: 58,
                                                        bgcolor: "#EEF4FF",
                                                    }}
                                                >
                                                    <FaMapMarkerAlt
                                                        size={24}
                                                        color="#1976d2"
                                                    />
                                                </Avatar>

                                                <Box>
                                                    <Typography
                                                        sx={{
                                                            color: "#667085",
                                                            fontWeight: 500,
                                                            fontSize: 18,
                                                        }}
                                                    >
                                                        Residential Address
                                                    </Typography>

                                                    <Typography
                                                        sx={{
                                                            mt: 1,
                                                            fontSize: 24,
                                                            fontWeight: 700,
                                                            lineHeight: 1.7,
                                                        }}
                                                    >
                                                        {student.residentialAddress || "-"}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>

                        <Paper
                            elevation={2}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                            }}
                        >
                            <Typography
                                variant="h6"
                                fontWeight={700}
                                mb={2}
                            >
                                Skills
                            </Typography>

                            <Stack
                                direction="row"
                                spacing={1}
                                useFlexGap
                                flexWrap="wrap"
                            >
                                {student.skills?.map(
                                    (skill) => (
                                        <Chip
                                            key={skill.id}
                                            label={skill.name}
                                            color="primary"
                                            variant="outlined"
                                        />
                                    )
                                )}
                            </Stack>
                        </Paper>

                        <Paper
                            elevation={3}
                            sx={{
                                p:4,
                                borderRadius:4
                            }}
                        >

                            <Typography
                                variant="h6"
                                fontWeight={700}
                                mb={3}
                                display="flex"
                                alignItems="center"
                                gap={1}
                            >
                                <LinkIcon color="primary"/>

                                Professional Links
                            </Typography>

                            <Grid
                                container
                                spacing={3}
                            >

                                {/* Github */}

                                <Grid item xs={12} md={6}>

                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p:3,
                                            borderRadius:4,
                                            height:"100%",
                                            transition:"all .35s ease",
                                            cursor:"pointer",

                                            "&:hover":{
                                                transform:"translateY(-8px)",
                                                boxShadow:8,
                                                borderColor:"#000"
                                            }
                                        }}
                                    >

                                        <Stack
                                            spacing={2}
                                            alignItems="center"
                                        >

                                            <Box
                                                sx={{
                                                    width:70,
                                                    height:70,
                                                    borderRadius:"50%",
                                                    bgcolor:"#f5f5f5",
                                                    display:"flex",
                                                    justifyContent:"center",
                                                    alignItems:"center"
                                                }}
                                            >
                                                <FaGithub
                                                    size={40}
                                                    color="#000"
                                                />
                                            </Box>

                                            <Typography
                                                fontWeight={700}
                                            >
                                                GitHub
                                            </Typography>

                                            <Chip
                                                color={
                                                    student.githubLink
                                                        ? "success"
                                                        : "default"
                                                }
                                                label={
                                                    student.githubLink
                                                        ? "Connected"
                                                        : "Not Added"
                                                }
                                            />

                                            <Button
                                                fullWidth
                                                variant="contained"
                                                endIcon={
                                                    <FaExternalLinkAlt/>
                                                }
                                                disabled={
                                                    !student.githubLink
                                                }
                                                href={
                                                    student.githubLink
                                                }
                                                target="_blank"
                                            >
                                                Open Profile
                                            </Button>

                                        </Stack>

                                    </Paper>

                                </Grid>

                                {/* LinkedIn */}

                                <Grid item xs={12} md={6}>

                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p:3,
                                            borderRadius:4,
                                            height:"100%",
                                            transition:"all .35s ease",
                                            cursor:"pointer",

                                            "&:hover":{
                                                transform:"translateY(-8px)",
                                                boxShadow:8,
                                                borderColor:"#0A66C2"
                                            }
                                        }}
                                    >

                                        <Stack
                                            spacing={2}
                                            alignItems="center"
                                        >

                                            <Box
                                                sx={{
                                                    width:70,
                                                    height:70,
                                                    borderRadius:"50%",
                                                    bgcolor:"#E3F2FD",
                                                    display:"flex",
                                                    justifyContent:"center",
                                                    alignItems:"center"
                                                }}
                                            >
                                                <FaLinkedin
                                                    size={38}
                                                    color="#0A66C2"
                                                />
                                            </Box>

                                            <Typography
                                                fontWeight={700}
                                            >
                                                LinkedIn
                                            </Typography>

                                            <Chip
                                                color={
                                                    student.linkedinLink
                                                        ? "success"
                                                        : "default"
                                                }
                                                label={
                                                    student.linkedinLink
                                                        ? "Connected"
                                                        : "Not Added"
                                                }
                                            />

                                            <Button
                                                fullWidth
                                                variant="contained"
                                                endIcon={
                                                    <FaExternalLinkAlt/>
                                                }
                                                disabled={
                                                    !student.linkedinLink
                                                }
                                                href={
                                                    student.linkedinLink
                                                }
                                                target="_blank"
                                                sx={{
                                                    borderRadius:3,
                                                    textTransform:"none",
                                                    fontWeight:700,

                                                    "&:hover":{
                                                        transform:"scale(1.04)"
                                                    }
                                                }}
                                            >
                                                Open Profile
                                            </Button>

                                        </Stack>

                                    </Paper>

                                </Grid>

                                {/* Resume */}

                                <Grid item xs={12}>

                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p:3,
                                            borderRadius:4,
                                            transition:".35s",

                                            "&:hover":{
                                                transform:"translateY(-6px)",
                                                boxShadow:8
                                            }
                                        }}
                                    >

                                        <Stack
                                            direction="row"
                                            justifyContent="space-between"
                                            alignItems="center"
                                        >

                                            <Stack
                                                direction="row"
                                                spacing={2}
                                                alignItems="center"
                                            >

                                                <Box
                                                    sx={{
                                                        width:70,
                                                        height:70,
                                                        borderRadius:3,
                                                        bgcolor:"#FFEBEE",
                                                        display:"flex",
                                                        justifyContent:"center",
                                                        alignItems:"center"
                                                    }}
                                                >
                                                    <FaFilePdf
                                                        size={42}
                                                        color="#E53935"
                                                    />
                                                </Box>

                                                <Box>

                                                    <Typography
                                                        fontWeight={700}
                                                    >
                                                        Resume
                                                    </Typography>

                                                    <Typography
                                                        color="text.secondary"
                                                    >
                                                        {
                                                            student.resumeUrl
                                                                ? "Resume Uploaded"
                                                                : "Resume Not Uploaded"
                                                        }
                                                    </Typography>

                                                </Box>

                                            </Stack>

                                            <Button
                                                variant="contained"
                                                sx={{
                                                    borderRadius:3,
                                                    px:3,
                                                    textTransform:"none",
                                                    fontWeight:700,

                                                    "&:hover":{
                                                        transform:"scale(1.05)"
                                                    }
                                                }}
                                                endIcon={
                                                    <FaExternalLinkAlt/>
                                                }
                                                disabled={
                                                    !student.resumeUrl
                                                }
                                                href={
                                                    student.resumeUrl
                                                }
                                                target="_blank"
                                            >
                                                View Resume
                                            </Button>

                                        </Stack>

                                    </Paper>

                                </Grid>

                            </Grid>

                        </Paper>
                    </Stack>
                )}
            </DialogContent>


            <DialogActions
                sx={{
                    justifyContent: "space-between",
                    px: 3,
                    pb: 3,
                }}
            >

                <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() =>
                        setOpenUpdateDialog(true)
                    }
                >
                    Modify
                </Button>

                <Stack
                    direction="row"
                    spacing={2}
                >

                    <Button
                        variant="contained"
                        onClick={() =>
                            setOpenApplications(true)
                        }
                    >
                        Application History
                    </Button>

                    <Button
                        onClick={onClose}
                    >
                        Close
                    </Button>

                </Stack>

            </DialogActions>
            <StudentApplicationsDialog
                open={openApplications}
                onClose={() =>
                    setOpenApplications(false)
                }
                studentId={student?.id}
            />
            <UpdateStudentDialog

                open={openUpdateDialog}

                onClose={() =>
                    setOpenUpdateDialog(false)
                }

                student={studentData}

                onSuccess={refreshStudent}

            />
        </Dialog>
    );
};

export default StudentDetailsDialog;