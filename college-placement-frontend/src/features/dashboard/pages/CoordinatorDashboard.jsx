import { useState, useEffect } from "react";
//import { useAuthContext } from "../../../hooks/useAuthContext";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Cell,
    LabelList,
} from "recharts";
import {
    Box,
    Typography,
    CircularProgress,
    Grid,
    Card,
    CardContent,
} from "@mui/material";
import {
    getCoordinatorDashboard
} from "../api/dashboardApi";
const CoordinatorDashboardPage = () => {
    const texts = [
        "Manage Placements.",
        "Build Careers.",
        "Track Student Progress.",
        "Coordinate Recruitment Drives."
    ];
    const [dashboard, setDashboard] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const chartData = [
        {
            name: "Applied",
            value:
                dashboard?.applicationStatistics
                    ?.appliedApplications || 0,
        },
        {
            name: "Shortlisted",
            value:
                dashboard?.applicationStatistics
                    ?.shortlistedApplications || 0,
        },
        {
            name: "Selected",
            value:
                dashboard?.applicationStatistics
                    ?.selectedApplications || 0,
        },
        {
            name: "Rejected",
            value:
                dashboard?.applicationStatistics
                    ?.rejectedApplications || 0,
        },
    ];
    const selectionRatio =
        dashboard?.applicationStatistics
            ?.appliedApplications > 0
            ? (
                (
                    dashboard
                        .applicationStatistics
                        .selectedApplications /
                    dashboard
                        .applicationStatistics
                        .appliedApplications
                ) * 100
            ).toFixed(1)
            : 0;

    const COLORS = [
        "#1976d2",
        "#42a5f5",
        "#66bb6a",
        "#ef5350",
    ];
    const [currentText, setCurrentText] = useState(0);
    //const { user } = useAuthContext();

    const fetchDashboard = async () => {
        setLoading(true);

        try {
            const response =
                await getCoordinatorDashboard();

            setDashboard(response);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchDashboard();
    }, []);
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentText((prev) =>
                (prev + 1) % texts.length
            );
        }, 2500);

        return () => clearInterval(interval);
    }, []);
    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 5,
                }}
            >
                <CircularProgress />
            </Box>
        );
    }


    return (

        <Box>

            <Box
                sx={{
                    py: 8,
                    px: 4,
                    mb: 5,
                    borderRadius: 4,
                    background:
                        "linear-gradient(135deg, #ffffff 0%, #eef4ff 50%, #ffffff 100%)",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        right: -80,
                        top: -80,
                        width: 250,
                        height: 250,
                        borderRadius: "50%",
                        bgcolor: "rgba(25,118,210,0.08)",
                    }}
                />
                <Typography
                    sx={{
                        fontSize: {
                            xs: "2rem",
                            md: "3.5rem",
                        },
                        fontWeight: 800,
                        lineHeight: 1.2,
                        position: "relative",
                        zIndex: 1,
                    }}
                >

                    Hello

                </Typography>
                <Typography
                    sx={{
                        mt: 2,
                        color: "text.secondary",
                        fontSize: "1rem",
                        position: "relative",
                        zIndex: 1,
                    }}
                >
                    Welcome back. Here's what's happening today.
                </Typography>


                <Typography
                    sx={{
                        fontSize: {
                            xs: "2rem",
                            md: "3.5rem",
                        },
                        fontWeight: 700,
                        fontFamily: "'Poppins', sans-serif",

                        color: "primary.main",
                        lineHeight: 1.2,
                        position: "relative",
                        zIndex: 1,

                    }}
                >
                    {texts[currentText]}
                </Typography>
            </Box>


            <Grid
                container
                spacing={3}
                sx={{ mt: 2 }}
            >
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography
                                color="text.secondary"
                            >
                                Total Students
                            </Typography>

                            <Typography
                                variant="h4"
                                fontWeight={700}
                            >
                                {
                                    dashboard
                                        ?.studentStatistics
                                        ?.totalStudents
                                }
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography
                                color="text.secondary"
                            >
                                Eligible Students
                            </Typography>

                            <Typography
                                variant="h4"
                                fontWeight={700}
                            >
                                {
                                    dashboard
                                        ?.studentStatistics
                                        ?.eligibleStudents
                                }
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography
                                color="text.secondary"
                            >
                                Selected Students
                            </Typography>

                            <Typography
                                variant="h4"
                                fontWeight={700}
                            >
                                {
                                    dashboard
                                        ?.studentStatistics
                                        ?.selectedStudents
                                }
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography
                                color="text.secondary"
                            >
                                Total Applications
                            </Typography>

                            <Typography
                                variant="h4"
                                fontWeight={700}
                            >
                                {
                                    dashboard
                                        ?.applicationStatistics
                                        ?.totalApplications
                                }
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>


            <Grid
                container
                spacing={3}
                sx={{ mt: 1 }}
            >
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography
                                color="text.secondary"
                            >
                                Total Companies
                            </Typography>

                            <Typography
                                variant="h4"
                                fontWeight={700}
                            >
                                {
                                    dashboard
                                        ?.companyStatistics
                                        ?.totalCompanies
                                }
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography
                                color="text.secondary"
                            >
                                Active Drives
                            </Typography>

                            <Typography
                                variant="h4"
                                fontWeight={700}
                            >
                                {
                                    dashboard
                                        ?.companyStatistics
                                        ?.activeDrives
                                }
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography
                                color="text.secondary"
                            >
                                Upcoming Drives
                            </Typography>

                            <Typography
                                variant="h4"
                                fontWeight={700}
                            >
                                {
                                    dashboard
                                        ?.companyStatistics
                                        ?.upcomingDrives
                                }
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Grid
                container
                spacing={3}
                sx={{ mt: 1 }}
            >
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography
                                color="text.secondary"
                            >
                                Total Sessions
                            </Typography>

                            <Typography
                                variant="h4"
                                fontWeight={700}
                            >
                                {
                                    dashboard
                                        ?.sessionStatistics
                                        ?.totalSessions
                                }
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography
                                color="text.secondary"
                            >
                                Upcoming Sessions
                            </Typography>

                            <Typography
                                variant="h4"
                                fontWeight={700}
                            >
                                {
                                    dashboard
                                        ?.sessionStatistics
                                        ?.upcomingSessions
                                }
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography
                                color="text.secondary"
                            >
                                Total Topics
                            </Typography>

                            <Typography
                                variant="h4"
                                fontWeight={700}
                            >
                                {
                                    dashboard
                                        ?.topicStatistics
                                        ?.totalTopics
                                }
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography
                                color="text.secondary"
                            >
                                Branch Topics
                            </Typography>

                            <Typography
                                variant="h4"
                                fontWeight={700}
                            >
                                {
                                    dashboard
                                        ?.topicStatistics
                                        ?.branchTopics
                                }
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Grid
                container
                spacing={3}
                sx={{ mt: 2 }}
            >
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography
                                variant="h6"
                                fontWeight={600}
                                mb={2}
                            >
                                Application Statistics
                            </Typography>

                            <ResponsiveContainer
                                width="100%"
                                height={320}
                            >
                                <BarChart data={chartData}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                    />

                                    <XAxis dataKey="name" />

                                    <YAxis />

                                    <Tooltip />

                                    <Bar
                                        dataKey="value"
                                        radius={[8, 8, 0, 0]}
                                    >
                                        <LabelList
                                            dataKey="value"
                                            position="top"
                                        />

                                        {chartData.map(
                                            (entry, index) => (
                                                <Cell
                                                    key={index}
                                                    fill={
                                                        COLORS[
                                                        index %
                                                        COLORS.length
                                                            ]
                                                    }
                                                />
                                            )
                                        )}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card
                        sx={{
                            height: "100%",
                            borderRadius: 4,
                            background:
                                "linear-gradient(135deg,#1976d2,#42a5f5)",
                            color: "white",
                            boxShadow:
                                "0 10px 30px rgba(25,118,210,0.3)",
                        }}
                    >
                        <CardContent>
                            <Typography
                                variant="h6"
                                fontWeight={600}
                            >
                                Selection Ratio
                            </Typography>

                            <Typography
                                variant="h1"
                                fontWeight={800}
                                sx={{ mt: 3 }}
                            >
                                {selectionRatio}%
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 2,
                                    opacity: 0.9,
                                }}
                            >
                                Selected Applications
                                vs Applied Applications
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

</Box>

) ;

};

export default CoordinatorDashboardPage;