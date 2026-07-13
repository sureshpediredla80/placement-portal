import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";

import bg1 from "../../../assets/dashboard/bg1.png";
import bg2 from "../../../assets/dashboard/bg2.png";
import bg3 from "../../../assets/dashboard/bg3.jpg";
//import bg4 from "../../../assets/dashboard/bg4.jpg";

const images = [bg1, bg2, bg3,];

const StudentDashboard = () => {

    const [currentImage, setCurrentImage] = useState(0);

    // 🔁 Auto Slide
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) =>
                prev === images.length - 1 ? 0 : prev + 1
            );
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Box sx={{ width: "100%" }}>

            {/* 🔥 SLIDER */}
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

        </Box>
    );
};

export default StudentDashboard;