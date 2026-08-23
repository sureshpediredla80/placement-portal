import {
    Dialog,
    DialogContent,
    Box,
    Typography,
    Avatar,
    Chip,
    IconButton,
    Grid,
    Card,
    CardContent,
    Stack,
    Divider,
    Button,
    Tooltip,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import BusinessIcon from "@mui/icons-material/Business";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import CodeIcon from "@mui/icons-material/Code";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import WorkIcon from "@mui/icons-material/Work";

const PublicStudentProfileDialog = ({ open, onClose, student }) => {
    if (!student) return null;

    const initials = student.studentName
        ? student.studentName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .substring(0, 2)
        : "ST";

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    overflow: "hidden",
                    bgcolor: "background.paper",
                },
            }}
        >
            {/* Header Banner */}
            <Box
                sx={{
                    height: 140,
                    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
                    position: "relative",
                    p: 2,
                }}
            >
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        bgcolor: "rgba(0,0,0,0.4)",
                        color: "white",
                        "&:hover": { bgcolor: "rgba(0,0,0,0.6)" },
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </Box>

            {/* Profile Info Header */}
            <Box sx={{ px: 4, pb: 3, pt: 0, position: "relative", mt: -7 }}>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-end"
                    flexWrap="wrap"
                    gap={2}
                >
                    <Stack direction="row" spacing={2.5} alignItems="flex-end">
                        <Avatar
                            sx={{
                                width: 110,
                                height: 110,
                                fontSize: "2.5rem",
                                fontWeight: 800,
                                bgcolor: "primary.main",
                                color: "white",
                                border: "4px solid",
                                borderColor: "background.paper",
                                boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                            }}
                        >
                            {initials}
                        </Avatar>

                        <Box mb={1}>
                            <Typography variant="h5" fontWeight={800} color="text.primary">
                                {student.studentName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" fontWeight={600}>
                                {student.rollNumber} • {student.branchName || "Engineering"}
                            </Typography>
                            <Stack direction="row" spacing={1} mt={0.8} flexWrap="wrap">
                                <Chip
                                    label={`Placement Batch: ${student.placementYear || 2026}`}
                                    size="small"
                                    color="primary"
                                    sx={{ fontWeight: 700 }}
                                />
                                {student.academicYear && (
                                    <Chip
                                        label={`Year ${student.academicYear}`}
                                        size="small"
                                        variant="outlined"
                                        sx={{ fontWeight: 600 }}
                                    />
                                )}
                            </Stack>
                        </Box>
                    </Stack>

                    {/* Social Links */}
                    <Stack direction="row" spacing={1.5} mb={1}>
                        {student.linkedinLink && (
                            <Button
                                variant="contained"
                                startIcon={<LinkedInIcon />}
                                href={student.linkedinLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    bgcolor: "#0077b5",
                                    color: "white",
                                    fontWeight: 700,
                                    borderRadius: 2,
                                    textTransform: "none",
                                    "&:hover": { bgcolor: "#005582" },
                                }}
                            >
                                LinkedIn
                            </Button>
                        )}
                        {student.githubLink && (
                            <Button
                                variant="contained"
                                startIcon={<GitHubIcon />}
                                href={student.githubLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    bgcolor: "#24292e",
                                    color: "white",
                                    fontWeight: 700,
                                    borderRadius: 2,
                                    textTransform: "none",
                                    "&:hover": { bgcolor: "#000" },
                                }}
                            >
                                GitHub
                            </Button>
                        )}
                    </Stack>
                </Box>
            </Box>

            <Divider />

            <DialogContent sx={{ p: 4 }}>
                {/* Metric Summary Banner */}
                <Grid container spacing={2} mb={4}>
                    <Grid item xs={12} sm={4}>
                        <Card
                            elevation={0}
                            sx={{
                                bgcolor: "#f0fdf4",
                                border: "1px solid",
                                borderColor: "#bbf7d0",
                                borderRadius: 3,
                            }}
                        >
                            <CardContent sx={{ py: 2, "&:last-child": { pb: 2 } }}>
                                <Box display="flex" alignItems="center" spacing={1.5}>
                                    <EmojiEventsIcon sx={{ color: "#16a34a", fontSize: 36, mr: 1.5 }} />
                                    <Box>
                                        <Typography variant="caption" fontWeight={700} color="#16a34a" textTransform="uppercase">
                                            Top Offer Package
                                        </Typography>
                                        <Typography variant="h5" fontWeight={800} color="#15803d">
                                            ₹{student.highestPackageLpa || 0} LPA
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Card
                            elevation={0}
                            sx={{
                                bgcolor: "#eff6ff",
                                border: "1px solid",
                                borderColor: "#bfdbfe",
                                borderRadius: 3,
                            }}
                        >
                            <CardContent sx={{ py: 2, "&:last-child": { pb: 2 } }}>
                                <Box display="flex" alignItems="center">
                                    <WorkspacePremiumIcon sx={{ color: "#2563eb", fontSize: 36, mr: 1.5 }} />
                                    <Box>
                                        <Typography variant="caption" fontWeight={700} color="#2563eb" textTransform="uppercase">
                                            Job Offers Received
                                        </Typography>
                                        <Typography variant="h5" fontWeight={800} color="#1d4ed8">
                                            {student.totalOffersCount || student.placedCompanies?.length || 1} Offer(s)
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Card
                            elevation={0}
                            sx={{
                                bgcolor: "#faf5ff",
                                border: "1px solid",
                                borderColor: "#e9d5ff",
                                borderRadius: 3,
                            }}
                        >
                            <CardContent sx={{ py: 2, "&:last-child": { pb: 2 } }}>
                                <Box display="flex" alignItems="center">
                                    <CardMembershipIcon sx={{ color: "#9333ea", fontSize: 36, mr: 1.5 }} />
                                    <Box>
                                        <Typography variant="caption" fontWeight={700} color="#9333ea" textTransform="uppercase">
                                            Verified Certifications
                                        </Typography>
                                        <Typography variant="h5" fontWeight={800} color="#7e22ce">
                                            {student.certifications?.length || 0} Completed
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Section 1: Placement Offers Details */}
                <Box mb={4}>
                    <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                        <BusinessIcon color="primary" />
                        <Typography variant="h6" fontWeight={700}>
                            Placement Offers & Selections
                        </Typography>
                    </Stack>

                    <Grid container spacing={2}>
                        {student.placedCompanies && student.placedCompanies.length > 0 ? (
                            student.placedCompanies.map((offer, index) => (
                                <Grid item xs={12} sm={6} key={index}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 2.5,
                                            borderRadius: 3,
                                            border: "1px solid",
                                            borderColor: "divider",
                                            bgcolor: "background.paper",
                                            transition: "all 0.2s ease-in-out",
                                            "&:hover": { boxShadow: "0 6px 16px rgba(0,0,0,0.06)" },
                                        }}
                                    >
                                        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                            <Box>
                                                <Typography variant="subtitle1" fontWeight={800} color="text.primary">
                                                    {offer.companyName}
                                                </Typography>
                                                {offer.roleOffered && (
                                                    <Stack direction="row" alignItems="center" spacing={0.5} mt={0.5}>
                                                        <WorkIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                                                        <Typography variant="body2" color="text.secondary" fontWeight={600}>
                                                            {offer.roleOffered}
                                                        </Typography>
                                                    </Stack>
                                                )}
                                            </Box>
                                            <Chip
                                                label={`₹${offer.packageOfferedLpa || 0} LPA`}
                                                color="success"
                                                size="small"
                                                sx={{ fontWeight: 800, fontSize: "0.85rem" }}
                                            />
                                        </Box>

                                        {offer.selectionDate && (
                                            <Stack direction="row" alignItems="center" spacing={0.8} mt={1.5}>
                                                <CalendarTodayIcon sx={{ fontSize: 14, color: "text.disabled" }} />
                                                <Typography variant="caption" color="text.secondary">
                                                    Selected: {new Date(offer.selectionDate).toLocaleDateString()}
                                                </Typography>
                                            </Stack>
                                        )}
                                    </Paper>
                                </Grid>
                            ))
                        ) : (
                            <Grid item xs={12}>
                                <Typography variant="body2" color="text.secondary">
                                    No detailed selection records available.
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </Box>

                {/* Section 2: Verified Certifications */}
                {student.certifications && student.certifications.length > 0 && (
                    <Box mb={4}>
                        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                            <CardMembershipIcon sx={{ color: "#9333ea" }} />
                            <Typography variant="h6" fontWeight={700}>
                                Verified Certifications & Courses
                            </Typography>
                        </Stack>

                        <Grid container spacing={2}>
                            {student.certifications.map((cert) => (
                                <Grid item xs={12} sm={6} key={cert.id}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 2.5,
                                            borderRadius: 3,
                                            border: "1px solid",
                                            borderColor: "#e9d5ff",
                                            bgcolor: "#faf5ff",
                                        }}
                                    >
                                        <Typography variant="subtitle1" fontWeight={700} color="#6b21a8">
                                            {cert.certificateName}
                                        </Typography>
                                        {cert.provider && (
                                            <Typography variant="body2" color="text.secondary" fontWeight={600} mt={0.3}>
                                                Issued by: {cert.provider}
                                            </Typography>
                                        )}
                                        {cert.issueDate && (
                                            <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                                                Date: {new Date(cert.issueDate).toLocaleDateString()}
                                            </Typography>
                                        )}
                                        {cert.skillsLearned && cert.skillsLearned.length > 0 && (
                                            <Stack direction="row" spacing={0.8} mt={1.5} flexWrap="wrap" gap={0.5}>
                                                {cert.skillsLearned.map((sk, idx) => (
                                                    <Chip
                                                        key={idx}
                                                        label={sk}
                                                        size="small"
                                                        sx={{ bgcolor: "white", color: "#7e22ce", fontWeight: 600, fontSize: "0.75rem" }}
                                                    />
                                                ))}
                                            </Stack>
                                        )}
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}

                {/* Section 3: Technical Skills */}
                {student.skills && student.skills.length > 0 && (
                    <Box>
                        <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
                            <CodeIcon color="primary" />
                            <Typography variant="h6" fontWeight={700}>
                                Technical Skills & Expertise
                            </Typography>
                        </Stack>

                        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                            {student.skills.map((skill, idx) => (
                                <Chip
                                    key={idx}
                                    label={skill}
                                    color="primary"
                                    variant="outlined"
                                    sx={{ fontWeight: 600, borderRadius: 2 }}
                                />
                            ))}
                        </Stack>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default PublicStudentProfileDialog;
