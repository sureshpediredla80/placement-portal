
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import LinkIcon from "@mui/icons-material/Link";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import DescriptionIcon from "@mui/icons-material/Description";

import EmailIcon from "@mui/icons-material/Description";
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
    Divider,
    Link,
} from "@mui/material";
import {
    Avatar,
    Grid,


    Paper,
} from "@mui/material";
import { useState } from "react";
import StudentApplicationsDialog from "./StudentApplicationsDialog";
const StudentDetailsDialog = ({
                                  open,
                                  onClose,
                                  student,
                              }) => {
    const [openApplications, setOpenApplications] =
        useState(false);
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
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        mb: 4,
                    }}
                >
                    <Avatar
                        sx={{
                            width: 90,
                            height: 90,
                            fontSize: 32,
                            fontWeight: 700,
                            mb: 2,
                        }}
                    >
                        {student?.user?.fullName?.charAt(
                            0
                        )}
                    </Avatar>

                    <Typography
                        variant="h5"
                        fontWeight={700}
                    >
                        {student?.user?.fullName}
                    </Typography>

                    <Typography
                        color="text.secondary"
                    >
                        {student?.rollNumber}
                    </Typography>
                </Box>
                {student && (
                    <Stack spacing={3}>
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
                                <PersonIcon color="primary" rt={5} />
                                Personal Information
                            </Typography>

                            <Grid
                                container
                                spacing={2}
                            >
                                <Grid size={6}>
                                    <Typography>
                                        Name
                                    </Typography>

                                    <Typography fontWeight={600}>
                                        {student.user.fullName}
                                    </Typography>
                                </Grid>

                                <Grid size={6}>
                                    <Typography>

                                        Email
                                    </Typography>

                                    <Typography fontWeight={600}>
                                        {student.user.email}
                                    </Typography>
                                </Grid>

                                <Grid size={6}>
                                    <Typography>
                                        Phone
                                    </Typography>

                                    <Typography fontWeight={600}>
                                        {student.phone || "-"}
                                    </Typography>
                                </Grid>
                            </Grid>
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
                                <SchoolIcon color="primary" rt={3} />
                                Academic Information
                            </Typography>

                            <Grid
                                container
                                spacing={2}
                            >
                                <Grid size={6}>
                                    <Typography>
                                        Roll Number
                                    </Typography>

                                    <Typography fontWeight={600}>
                                        {student.rollNumber}
                                    </Typography>
                                </Grid>

                                <Grid size={6}>
                                    <Typography>
                                        Branch
                                    </Typography>

                                    <Typography fontWeight={600}>
                                        {student.branch?.name}
                                    </Typography>
                                </Grid>

                                <Grid size={6}>
                                    <Typography>
                                        Year
                                    </Typography>

                                    <Typography fontWeight={600}>
                                        {student.year}
                                    </Typography>
                                </Grid>

                                <Grid size={6}>
                                    <Typography>
                                        CGPA
                                    </Typography>

                                    <Typography fontWeight={600}>
                                        {student.cgpa}
                                    </Typography>
                                </Grid>
                            </Grid>
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
                                Placement Information
                            </Typography>

                            <Chip
                                label={student.placementStatus}
                                color={
                                    student.placementStatus ===
                                    "SELECTED"
                                        ? "success"
                                        : student.placementStatus ===
                                        "APPLIED"
                                            ? "primary"
                                            : "warning"
                                }
                            />
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
                                <LinkIcon color="primary" rt={3} />
                                Professional Links
                            </Typography>

                            <Stack
                                direction="row"
                                spacing={2}
                                flexWrap="wrap"
                            >
                                <Button
                                    variant="outlined"
                                    href={student.githubLink}
                                    target="_blank"
                                    disabled={!student.githubLink}
                                >
                                    <GitHubIcon color="primary" rt={3} />
                                    GitHub
                                </Button>

                                <Button
                                    variant="outlined"
                                    href={student.linkedinLink}
                                    target="_blank"
                                    disabled={!student.linkedinLink}
                                >   <
                                    LinkedInIcon color="primary" rt={3} />
                                    LinkedIn
                                </Button>

                                <Button
                                    variant="contained"
                                    href={student.resumeUrl}
                                    target="_blank"
                                    disabled={!student.resumeUrl}
                                >
                                    <DescriptionIcon color="primary" rt={3} />
                                    Resume
                                </Button>
                            </Stack>
                        </Paper>
                    </Stack>
                )}
            </DialogContent>


            <DialogActions>
                <Button
                    variant="contained"
                    onClick={() =>
                        setOpenApplications(true)
                    }
                >
                    Application History
                </Button>

                <Button onClick={onClose}>
                    Close
                </Button>
            </DialogActions>
            <StudentApplicationsDialog
                open={openApplications}
                onClose={() =>
                    setOpenApplications(false)
                }
                studentId={student?.id}
            />
        </Dialog>
    );
};

export default StudentDetailsDialog;