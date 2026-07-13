import {
    Box,
    Typography,
} from "@mui/material";

const AchievementsSection = ({
                                 achievements,
                             }) => {

    if (!achievements?.length) return null;

    return (

        <Box>

            <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                    borderBottom: "2px solid #1976d2",
                    mb: 2,
                    pb: 0.5,
                }}
            >
                Achievements
            </Typography>

            {achievements.map((achievement, index) => (

                <Typography key={index}>

                    • {achievement.title}

                </Typography>

            ))}

        </Box>

    );

};

export default AchievementsSection;