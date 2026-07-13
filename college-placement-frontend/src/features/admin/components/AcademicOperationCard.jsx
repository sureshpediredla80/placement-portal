import {
    Card,
    CardActionArea,
    CardContent,
    Typography,
    Box,
} from "@mui/material";

const AcademicOperationCard = ({
                                   icon,
                                   title,
                                   description,
                                   onClick,
                                   selected = false,
                               }) => {

    return (

        <Card
            sx={{
                height: 220,
                borderRadius: 4,

                cursor: "pointer",

                backgroundColor: selected
                    ? "#EAF4FF"
                    : "#FFFFFF",

                border:selected
                    ? "2px solid #1976d2"
                    : "2px solid transparent",

                boxShadow: selected
                    ? `
0 0 0 1px rgba(25,118,210,.25),
0 10px 25px rgba(25,118,210,.20),
0 0 30px rgba(25,118,210,.12)
`
                    : "0 4px 15px rgba(0,0,0,.08)",

                transition: "all .3s ease",

                "&:hover": {

                    transform:"translateY(-8px) scale(1.02)",

                    boxShadow:
                        "0 18px 40px rgba(0,0,0,.15)",

                },
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: selected ? 6 : 0,

                    backgroundColor: "#1976d2",

                    transition: "all .3s ease",
                }}
            />

            <CardActionArea
                onClick={onClick}
                sx={{
                    height: "100%",
                }}
            >
                <CardContent
                    sx={{
                        height: "100%",

                        display: "flex",

                        flexDirection: "column",

                        justifyContent: "center",

                        alignItems: "center",

                        px: 3,
                    }}
                >

                    <Box
                        sx={{
                            position: "relative",
                            overflow: "hidden",
                            width: 72,
                            height: 72,

                            borderRadius: "50%",
                            backgroundColor: selected
                                ? "#1976d2"
                                : "#EAF3FF",

                            transition:"all .35s ease",

                            transform:selected
                                ? "scale(1.08)"
                                : "scale(1)",

                            display: "flex",

                            alignItems: "center",

                            justifyContent: "center",

                            mb: 2,
                        }}
                    >
                        {icon}
                    </Box>

                    <Typography
                        variant="h6"
                        fontWeight={700}
                        align="center"
                        sx={{
                            mb: 1,
                        }}
                    >
                        {title}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                        sx={{
                            lineHeight: 1.7,
                        }}
                    >
                        {description}
                    </Typography>

                </CardContent>


            </CardActionArea>

        </Card>

    );

};

export default AcademicOperationCard;