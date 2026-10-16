import { Outlet } from "react-router-dom";
import { Box, Paper, Typography } from "@mui/material";

const AuthLayout = () => {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                position: "relative",
                overflow: "hidden",

                background:
                    "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #3b82f6 100%)",

                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                px: 3,
                py: 4,
            }}
        >
            {/* Background Blur Circle 1 */}
            <Box
                sx={{
                    position: "absolute",
                    top: "-120px",
                    left: "-120px",
                    width: 320,
                    height: 320,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.12)",
                    filter: "blur(80px)",
                    zIndex: 0,
                }}
            />

            {/* Background Blur Circle 2 */}
            <Box
                sx={{
                    position: "absolute",
                    bottom: "-100px",
                    right: "-100px",
                    width: 280,
                    height: 280,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.10)",
                    filter: "blur(90px)",
                    zIndex: 0,
                }}
            />

            {/* Background Blur Circle 3 */}
            <Box
                sx={{
                    position: "absolute",
                    top: "40%",
                    left: "45%",
                    width: 220,
                    height: 220,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.08)",
                    filter: "blur(70px)",
                    zIndex: 0,
                }}
            />
            {/* Main Content */}
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",

                    position: "relative",
                    zIndex: 1,
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        maxWidth: "1200px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 8,
                    }}
                >
                    {/* Left Branding Section */}
                    <Box
                        sx={{
                            flex: 1,
                            color: "#fff",
                            display: {
                                xs: "none",
                                md: "flex",
                            },
                            flexDirection: "column",
                            justifyContent: "center",
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: "72px",
                                mb: 2,
                            }}
                        >
                            🎓
                        </Typography>

                        <Typography
                            variant="h3"
                            fontWeight={700}
                            sx={{
                                lineHeight: 1.2,
                                mb: 3,
                            }}
                        >
                            College Placement
                            <br />
                            Portal
                        </Typography>

                        <Typography
                            variant="h6"
                            sx={{
                                lineHeight: 1.8,
                                opacity: 0.9,
                                mb: 5,
                            }}
                        >
                            Supporting every student from
                            <strong> 1st Year </strong>
                            to
                            <strong> Final Placement Success.</strong>
                        </Typography>

                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                            }}
                        >
                            <Typography variant="h6">
                                ✔ Year-wise Learning Roadmap
                            </Typography>
                            <Typography variant="h6">
                                ✔ Workshops & Placement Sessions
                            </Typography>

                            <Typography variant="h6">
                                ✔ Resume & Certificate Management
                            </Typography>

                            <Typography variant="h6">
                                ✔ Company Eligibility & Applications
                            </Typography>

                            <Typography variant="h6">
                                ✔ Placement Progress Tracking
                            </Typography>

                            <Typography variant="h6">
                                ✔ Dream Career Opportunities
                            </Typography>
                        </Box>
                    </Box>

                    {/* Right Side Login Card */}
                    <Paper
                        elevation={0}
                        sx={{
                            width: "100%",
                            maxWidth: 460,

                            p: "40px",

                            borderRadius: "20px",

                            background: "rgba(255,255,255,.75)",

                            backdropFilter: "blur(18px)",
                            WebkitBackdropFilter: "blur(18px)",

                            border: "1px solid rgba(255,255,255,.3)",

                            boxShadow: "0 20px 50px rgba(0,0,0,.12)",

                            transition: "all 0.3s ease",

                            "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: "0 30px 60px rgba(0,0,0,.16)",
                            },
                        }}
                    >
                        <Outlet />
                    </Paper>
                </Box>
            </Box>


            {/* Footer */}
            <Box
                sx={{
                    textAlign: "center",

                    position: "relative",
                    zIndex: 1,

                    color: "rgba(255,255,255,.8)",

                    mt: 4,
                }}
            >
                <Typography variant="body2">
                    © College Placement Portal
                </Typography>

                <Typography
                    variant="caption"
                    sx={{
                        display: "block",
                        mt: 0.5,
                    }}
                >
                </Typography>
            </Box>
        </Box>
    );
};

export default AuthLayout;