import { Box, Typography } from "@mui/material";
import {
    motion,
    useMotionValue,
    useTransform,
    useAnimation,
} from "framer-motion";
import { useEffect, useState } from "react";

import bagImage from "../assets/certificate-bag.png";
import zipperHandle from "../assets/zipper-handle.png";

const CertificateBag = ({

                            onOpen,
                        }) => {
    const zipperX = useMotionValue(0);
    const progress = useTransform(
        zipperX,
        [0, 230],
        ["0%", "100%"]
    );
    const glow = useTransform(
        zipperX,
        [0, 230],
        [
            "0 0 0px rgba(255,193,7,0)",
            "0 0 60px rgba(255,193,7,.65)",
        ]
    );
    const controls = useAnimation();
    const [unlocking, setUnlocking] =
        useState(false);

    useEffect(() => {

        controls.start({

            scale: 1,
            opacity: 1,

            transition: {
                duration: 0.6,
            },

        });

        const unsubscribe =
            zipperX.on(
                "change",
                async (value) => {

                    if (value >= 230 && !unlocking) {

                        setUnlocking(true);

                        await controls.start({

                            x: [-5, 5, -4, 4, 0],

                            transition: {
                                duration: 0.35,
                            },

                        });

                        setTimeout(() => {

                            onOpen();

                        }, 600);

                    }

                }
            );

        return unsubscribe;

    }, [zipperX, controls, onOpen, unlocking]);

    return (

        <Box
            sx={{
                height: "78vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
            }}
        >
            <Box
                sx={{
                    position: "relative",
                    width: 320,
                }}
            >
            <motion.img

                src={bagImage}

                alt="Certificate Bag"

                initial={{
                    scale: 0.8,
                    opacity: 0,
                }}

                animate={controls}

                whileHover={{
                    scale: 1.05,
                    rotate: -2,
                }}

                transition={{
                    duration: 0.5,
                }}


                style={{
                    width: 320,
                    userSelect: "none",
                    boxShadow: glow,
                    borderRadius: 18,
                }}

            />
                <Box
                    sx={{
                        position: "absolute",
                        left: 44,
                        top: 113,
                        width: 232,
                        height: 8,
                        borderRadius: 10,
                        background: "#d8d8d8",
                        overflow: "hidden",
                    }}
                >

                    <motion.div
                        style={{
                            width: progress,
                            height: "100%",
                            background:
                                "linear-gradient(90deg,#FFD54F,#FFB300)",
                        }}
                    />

                </Box>
                <motion.div
                    drag="x"
                    dragConstraints={{
                        left: 0,
                        right: 230,
                    }}
                    dragElastic={0}
                    style={{
                        x: zipperX,
                        position: "absolute",
                        top: 92,
                        left: 28,
                        width: 34,
                        height: 52,

                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "grab",
                        boxShadow:
                         "none",
                    }}
                    whileHover={{

                        scale:1.12,

                        y:-3,

                    }}
                    whileTap={{
                        scale: 1.18,
                        cursor: "grabbing",
                    }}
                    animate={{
                        rotate: [0, -5, 5, -3, 0],
                    }}

                    transition={{
                        repeat: Infinity,
                        duration: 2.5,
                    }}
                >
                    <motion.img

                        src={zipperHandle}

                        alt="zipper"

                        draggable={false}

                        style={{

                            width: 30,

                            userSelect: "none",

                            pointerEvents: "none",


                        }}

                    />


                </motion.div>
                {unlocking && (

                    <motion.div

                        initial={{
                            opacity: 0,
                            scale: 0.8,
                        }}

                        animate={{
                            opacity: 1,
                            scale: 1,
                        }}

                        transition={{
                            duration: 0.3,
                        }}

                        style={{

                            position: "absolute",

                            inset: 0,

                            display: "flex",

                            justifyContent: "center",

                            alignItems: "center",

                            background: "rgba(255,215,64,.18)",

                            backdropFilter: "blur(3px)",

                            borderRadius: 18,

                        }}

                    >

                        <Box textAlign="center">

                            <Typography
                                variant="h3"
                            >
                                🔓
                            </Typography>

                            <Typography
                                variant="h6"
                                fontWeight={700}
                                color="white"
                            >
                                UNLOCKED
                            </Typography>

                        </Box>

                    </motion.div>

                )}

</Box>
            <motion.div
                animate={{
                    opacity: [1, .6, 1],
                }}
                transition={{
                    repeat: Infinity,
                    duration: 2,
                }}
            >

                <Typography
                    mt={4}
                    variant="h4"
                    fontWeight={700}
                >
                    {unlocking
                        ? "Opening..."
                        : "My Certificates"}
                </Typography>

            </motion.div>

            <Typography
                mt={1}
                color="text.secondary"
            >
                {unlocking
                    ? "Preparing your certificates..."
                    : "Drag the zipper to unlock your certificates"}
            </Typography>

        </Box>

    );

};

export default CertificateBag;