import {
    WorkspacePremium,
    Visibility,
} from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import {
    Card,
    CardContent,
    Typography,
    Chip,
    Box,
    Stack,
    Divider,
    Button,
    IconButton,
} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { useState } from "react";
const CertificateTemplateCard = ({
                                     certificate,
                                     onDelete,
                                     onApprove,
                                     onReject,
                                     showActions = false,
                                     showDelete = false,
                                 }) => {
    const [hovered, setHovered] = useState(false); const [openDeleteOverlay, setOpenDeleteOverlay] = useState(false);   const getStatusStyle = (status) => {
        switch (status) {
            case "APPROVED":
                return {
                    bgcolor: "#E8F5E9",
                    color: "#2E7D32",
                };

            case "REJECTED":
                return {
                    bgcolor: "#FDECEA",
                    color: "#D32F2F",
                };

            default:
                return {
                    bgcolor: "#FFF8E1",
                    color: "#ED6C02",
                };
        }
    };

    return (
        <Card
            elevation={4}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            sx={{
                width: "100%",
                height: "100%",
                minHeight: 380,

                display: "flex",
                flexDirection: "column",

                borderRadius: 5,
                border: "1px solid #e5e7eb",
                background:
                    "linear-gradient(to bottom,#ffffff,#f8fafc)",

                transition: ".3s",

                "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 8,
                },
            }}
        >
            <CardContent
                sx={{
                    position: "relative",
                    overflow: "hidden",

                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                }}
            >
                {/* Delete Button */}


                {/* Header */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        position: "relative",
                    }}
                >
                    <Box>
                        <Typography
                            variant="overline"
                            color="primary"
                            fontWeight={700}
                        >
                            CERTIFICATE
                        </Typography>

                        <Typography
                            variant="h5"
                            fontWeight={700}
                        >
                            {
                                certificate.certificateName
                            }
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <Chip
                            label={certificate.status}
                            sx={{
                                fontWeight: 700,
                                borderRadius: "8px",
                                ...getStatusStyle(certificate.status),
                            }}
                        />
                        {showDelete && onDelete && (
                            <IconButton
                                onClick={() => setOpenDeleteOverlay(true)}
                                sx={{
                                    color: "#d32f2f",

                                    opacity: hovered ? 1 : 0,

                                    transform: hovered
                                        ? "translateX(0)"
                                        : "translateX(10px)",

                                    transition: "all .25s ease",

                                    "&:hover": {
                                        bgcolor: "#FDECEA",
                                    },
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        )}
                    </Box>
                </Box>

                <Divider
                    sx={{ my: 2 }}
                />

                {/* Watermark Badge */}
                <Box
                    sx={{
                        position:
                            "absolute",
                        top: "50%",
                        left: "50%",
                        transform:
                            "translate(-50%, -50%)",
                        opacity: 0.10,
                        zIndex: 0,
                        pointerEvents:
                            "none",
                    }}
                >
                    <WorkspacePremium
                        sx={{
                            fontSize: 220,
                            color: "#f4c430",
                        }}
                    />
                </Box>

                {/* Content */}
                <Box
                    sx={{
                        position:
                            "relative",
                        zIndex: 1,
                    }}
                >
                    <Box sx={{ mt: 2 }}>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 2,
                            }}
                        >
                            <Typography
                                sx={{
                                    width: 120,
                                    fontWeight: 700,
                                }}
                            >
                                Issued By
                            </Typography>

                            <Typography sx={{ mx: 2, fontWeight: 700 }}>
                                :
                            </Typography>

                            <Typography color="text.secondary">
                                {certificate.provider}
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 2,
                            }}
                        >
                            <Typography
                                sx={{
                                    width: 120,
                                    fontWeight: 700,
                                }}
                            >
                                Type
                            </Typography>

                            <Typography sx={{ mx: 2, fontWeight: 700 }}>
                                :
                            </Typography>

                            <Typography color="text.secondary">
                                {certificate.certificateType}
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 2,
                            }}
                        >
                            <Typography
                                sx={{
                                    width: 120,
                                    fontWeight: 700,
                                }}
                            >
                                Issue Date
                            </Typography>

                            <Typography sx={{ mx: 2, fontWeight: 700 }}>
                                :
                            </Typography>

                            <Typography color="text.secondary">
                                {new Date(certificate.issueDate).toLocaleDateString()}
                            </Typography>
                        </Box>

                    </Box>

                    {/* Skills */}
                    <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        mt={2}
                        mb={1.5}
                    >
                        Skills Earned:
                    </Typography>

                    <Box
                        sx={{
                            mt: 1,
                            mb: 4,          // <-- View button ki gap
                            maxHeight: 80,  // <-- Fixed height
                            overflowY: "auto",
                            pr: 0.5,

                            "&::-webkit-scrollbar": {
                                width: 5,
                            },

                            "&::-webkit-scrollbar-thumb": {
                                background: "#d6d6d6",
                                borderRadius: 10,
                            },

                            "&::-webkit-scrollbar-track": {
                                background: "transparent",
                            },
                        }}
                    >
                        <Stack
                            direction="row"
                            spacing={1}
                            flexWrap="wrap"
                            useFlexGap
                        >
                            {certificate.skills?.map((skill) => (
                                <Chip
                                    key={skill.id}
                                    label={skill.name}
                                    size="small"
                                    variant="outlined"
                                />
                            ))}
                        </Stack>
                    </Box>

                    {/* View Certificate */}
                    <Box
                        sx={{
                            mt: "auto",
                            pt: 2,
                        }}
                    >
                        <Button
                            variant="contained"
                            startIcon={<Visibility />}
                            href={certificate.certificateUrl}
                            target="_blank"
                            fullWidth
                            sx={{
                                height: 52,
                                borderRadius: 3,
                                textTransform: "none",
                                fontSize: 16,
                                fontWeight: 700,

                                boxShadow: "0 8px 20px rgba(25,118,210,.25)",

                                transition: ".3s",

                                "&:hover": {
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 12px 24px rgba(25,118,210,.35)",
                                },
                            }}
                        >
                            View Certificate
                        </Button>
                    </Box>

                    {showActions &&
                        certificate.status === "PENDING" && (
                            <Stack
                                direction="row"
                                spacing={3}
                                justifyContent="center"
                                sx={{ mt: 2 }}
                            >
                                <IconButton
                                    onClick={() =>
                                        onApprove?.(certificate.id)
                                    }
                                    sx={{
                                        bgcolor: "#E8F5E9",

                                        "&:hover": {
                                            bgcolor: "#C8E6C9",
                                            transform: "scale(1.08)",
                                        },

                                        transition: ".25s",
                                    }}
                                >
                                    <CheckCircleIcon
                                        color="success"
                                        fontSize="large"
                                    />
                                </IconButton>

                                <IconButton
                                    onClick={() =>
                                        onReject?.(certificate.id)
                                    }
                                    sx={{
                                        bgcolor: "#FDECEA",

                                        "&:hover": {
                                            bgcolor: "#F8D7DA",
                                            transform: "scale(1.08)",
                                        },

                                        transition: ".25s",
                                    }}
                                >
                                    <CancelIcon
                                        color="error"
                                        fontSize="large"
                                    />
                                </IconButton>
                            </Stack>
                        )}

                    {/* Footer */}

                </Box>
                {openDeleteOverlay && (
                    <Box
                        sx={{
                            position: "absolute",
                            inset: 0,
                            bgcolor: "rgba(255,255,255,0.88)",
                            backdropFilter: "blur(6px)",
                            zIndex: 20,

                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",

                            animation: "fadeIn .25s ease",

                            "@keyframes fadeIn": {
                                from: {
                                    opacity: 0,
                                },
                                to: {
                                    opacity: 1,
                                },
                            },
                        }}
                    >
                        <Box
                            sx={{
                                bgcolor: "white",
                                borderRadius: 4,
                                p: 3,
                                width: "82%",
                                textAlign: "center",
                                boxShadow: 6,

                                animation: "popup .25s ease",

                                "@keyframes popup": {
                                    from: {
                                        opacity: 0,
                                        transform: "scale(.9)",
                                    },
                                    to: {
                                        opacity: 1,
                                        transform: "scale(1)",
                                    },
                                },
                            }}
                        >
                            <Typography
                                variant="h6"
                                fontWeight={700}
                            >
                                Delete Certificate?
                            </Typography>

                            <Typography
                                color="text.secondary"
                                sx={{
                                    mt: 1,
                                    mb: 3,
                                }}
                            >
                                This action cannot be undone.
                            </Typography>

                            <Stack
                                direction="row"
                                spacing={2}
                            >
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={() =>
                                        setOpenDeleteOverlay(false)
                                    }
                                >
                                    Cancel
                                </Button>

                                <Button
                                    fullWidth
                                    color="error"
                                    variant="contained"
                                    onClick={() => {
                                        onDelete(certificate.id);
                                        setOpenDeleteOverlay(false);
                                    }}
                                >
                                    Delete
                                </Button>
                            </Stack>
                        </Box>
                    </Box>
                )}

            </CardContent>
        </Card>
    );
};

export default CertificateTemplateCard;