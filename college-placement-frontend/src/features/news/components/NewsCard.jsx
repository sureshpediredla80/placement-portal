import {
    Avatar,
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
} from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
dayjs.extend(relativeTime);
const getInitials = (name) => {

    if (!name) return "NA";

    return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase();
};

const formatDate = (date) => {

    return new Date(date)
        .toLocaleDateString();
};
const isNewNews = (createdAt) => {

    const created = dayjs(createdAt);

    return dayjs().diff(created, "hour") <= 48;

};
const getCategoryColor = (category) => {

    switch (category?.toLowerCase()) {

        case "placement":
            return "#2e7d32"; // Green

        case "workshop":
            return "#ed6c02"; // Orange

        case "exam":
            return "#d32f2f"; // Red

        case "general":
            return "#1976d2"; // Blue

        default:
            return "#616161"; // Grey
    }
};
const NewsCard = ({
                      news,
                 onDelete
                  }) => {

    return (

        <Card
            sx={{
                borderRadius: 4,
                mb: 3,

                borderLeft: `6px solid ${getCategoryColor(news.category)}`,
                borderTop: "2px solid transparent",
                borderRight: "2px solid transparent",
                borderBottom: "2px solid transparent",

                boxShadow: 1,
                transition: "all .25s ease",

                "&:hover": {
                    cursor: "pointer",
                    transform: "translateY(-6px)",
                    borderColor: "#1976d2",
                    backgroundColor: "#fafcff",
                    boxShadow:
                        "0 10px 30px rgba(25,118,210,.25)",
                },
            }}
        >

            <CardContent>

                {/* Header */}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems:
                            "flex-start",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems:
                                "center",
                            gap: 2,
                        }}
                    >
                    <Avatar
                        sx={{
                            bgcolor: "primary.main",
                            width: 52,
                            height: 52,
                            fontWeight: 700,
                        }}
                    >
                        {getInitials(
                            news.createdBy
                                ?.fullName
                        )}
                    </Avatar>


                    <Box>

                        <Typography
                            sx={{
                                fontWeight: 700,
                                fontSize: "18px",
                                color: "#1a1a1a",
                            }}
                        >
                            {
                                news.createdBy
                                    ?.fullName
                            }
                        </Typography>

                        <Typography
                            color="text.secondary"
                            variant="body2"
                        >
                            {
                                dayjs(news.createdAt).fromNow()
                            }
                        </Typography>

                    </Box>


                    </Box>
                    {
                        onDelete && (

                            <IconButton
                                onClick={() =>
                                    onDelete(news.id)
                                }
                            >
                                <DeleteIcon />
                            </IconButton>

                        )
                    }
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mt: 3,
                        }}
                    >

                        {isNewNews(news.createdAt) && (

                            <Chip
                                label="NEW"
                                color="error"
                                size="small"
                                sx={{
                                    fontWeight: 700,
                                    animation: "pulse 1.5s infinite",

                                    "@keyframes pulse": {
                                        "0%": {
                                            transform: "scale(1)",
                                        },
                                        "50%": {
                                            transform: "scale(1.08)",
                                        },
                                        "100%": {
                                            transform: "scale(1)",
                                        },
                                    },
                                }}
                            />

                        )}

                        <Chip
                            label={news.category}
                            size="small"
                            sx={{
                                color: getCategoryColor(news.category),
                                borderColor: getCategoryColor(news.category),
                                fontWeight: 600,
                            }}
                            variant="outlined"
                        />

                    </Box>

                </Box>


                {/* Title */}

                <Typography
                    sx={{
                        mt: 2,
                        fontWeight: 700,
                        fontSize:
                            "20px",
                    }}
                >
                    {news.title}
                </Typography>

                {/* Description */}

                <Typography
                    sx={{
                        mt: 2,

                        overflow: "hidden",
                        display: "-webkit-box",

                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                    }}
                >
                    {
                        news.description
                    }
                </Typography>
                <Typography
                    sx={{
                        mt: 1,
                        fontWeight: 600,
                        cursor: "pointer",
                        color: "primary.main",
                    }}
                >
                    Read More
                </Typography>

                {/* Category */}



            </CardContent>

        </Card>

    );
};

export default NewsCard;