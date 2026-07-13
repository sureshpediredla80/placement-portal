import { useEffect, useState } from "react";

import {
    Box,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Avatar,
    Grid,
    Chip,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";


import {
    getMyCoordinatorProfile,
} from "../api/coordinatorApi.jsx";

const CoordinatorProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchProfile = async () => {
        setLoading(true);

        try {
            const response =
                await getMyCoordinatorProfile();

            setProfile(response);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <Box
                sx={{
                    textAlign: "center",
                    mt: 5,
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Profile Header */}
            <Card
                sx={{
                    mb: 4,
                    borderRadius: 4,
                    boxShadow: 4,
                    background:
                        "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                    color: "white",
                }}
            >
                <CardContent>
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
                        {profile?.user?.fullName
                            ?.charAt(0)
                            ?.toUpperCase()}
                    </Avatar>

                    <Typography
                        variant="h4"
                        fontWeight={700}
                    >
                        {profile?.user?.fullName}
                    </Typography>

                    <Typography
                        variant="h6"
                        sx={{
                            mt: 1,
                            opacity: 0.9,
                        }}
                    >
                        {profile?.department}
                    </Typography>

                    <Chip
                        label="Coordinator"
                        sx={{
                            mt: 2,
                            bgcolor: "white",
                            color: "#1976d2",
                            fontWeight: 700,
                        }}
                    />
                </CardContent>
            </Card>

            <Grid
                container
                spacing={3}
            >
                {/* Personal Information */}
                <Grid
                    item
                    xs={12}
                    md={6}
                >
                    <Card
                        sx={{
                            height: "100%",
                            borderRadius: 4,
                            boxShadow: 2,
                            transition:
                                "all 0.3s ease",
                            "&:hover": {
                                transform:
                                    "translateY(-5px)",
                                boxShadow: 6,
                            },
                        }}
                    >
                        <CardContent>
                            <Box
                                display="flex"
                                alignItems="center"
                                gap={1}
                                mb={3}
                            >


                                <Typography
                                    variant="h5"
                                    fontWeight={700}
                                >
                                    <PersonIcon color="primary" />
                                    Personal Information
                                </Typography>
                            </Box>

                            <Box display="flex" alignItems="center" mb={2}>
                                <Typography mt={10}>
                                <AccountCircleIcon
                                    color="primary"
                                    sx={{ mr: 1}}
                                />


                                    <strong>Full Name :</strong>{" "}
                                    {profile?.user?.fullName}
                                </Typography>
                            </Box>

                            <Box display="flex" alignItems="center" mb={2}>


                                <Typography>
                                    <EmailIcon
                                        color="primary"
                                        sx={{ mr: 1 }}
                                    />
                                    <strong>Email :</strong>{" "}
                                    {profile?.user?.email}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Coordinator Information */}
                <Grid
                    item
                    xs={12}
                    md={6}
                >
                    <Card
                        sx={{
                            height: "100%",
                            borderRadius: 4,
                            boxShadow: 2,
                            transition:
                                "all 0.3s ease",
                            "&:hover": {
                                transform:
                                    "translateY(-5px)",
                                boxShadow: 6,
                            },
                        }}
                    >
                        <CardContent>
                            <Box
                                display="flex"
                                alignItems="center"
                                gap={1}
                                mb={3}
                            >


                                <Typography
                                    variant="h5"
                                    fontWeight={700}
                                >
                                    <SchoolIcon color="primary" />
                                    Coordinator Information
                                </Typography>
                            </Box>



                            <Box mb={4}>
                                <Typography mt={2}>
                                    <strong>Department :</strong>{" "}
                                    {profile?.department}
                                </Typography>
                            </Box>


                            <Box mb={2}>
                                <Typography mt={5}>
                                    <strong>Branch :</strong>{" "}
                                    {profile?.branch?.name}
                                </Typography>
                            </Box>


                            <Box display="flex" alignItems="center" gap={1}>
                                <Typography>
                                    <strong>Branch Code :</strong>
                                </Typography>

                                <Chip
                                    label={profile?.branch?.code}
                                    color="success"
                                    size="small"
                                />
                            </Box>

                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default CoordinatorProfilePage;