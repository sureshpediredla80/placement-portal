import {
    Box,
    Typography,
} from "@mui/material";

const SkillRow = ({
                      label,
                      value,
                  }) => {

    if (!value || value.trim() === "") {
        return null;
    }

    return (

        <Box
            sx={{
                display: "flex",
                mb: 1,
            }}
        >

            <Typography
                sx={{
                    width: 150,
                    fontWeight: 700,
                    fontSize: 14,
                }}
            >
                {label}
            </Typography>

            <Typography
                sx={{
                    fontSize: 14,
                }}
            >
                {value}
            </Typography>

        </Box>

    );

};

const SkillsSection = ({
                           skills,
                       }) => {

    if (!skills) {
        return null;
    }

    return (

        <Box
            sx={{
                mb: 3,
            }}
        >

            <Typography
                sx={{
                    fontWeight: 700,
                    fontSize: 18,
                    borderBottom: "1px solid #000",
                    mb: 2,
                    pb: .5,
                }}
            >
                TECHNICAL SKILLS
            </Typography>

            <SkillRow

                label="Languages"

                value={skills.programming}

            />

            <SkillRow

                label="Frameworks"

                value={skills.frameworks}

            />

            <SkillRow

                label="Databases"

                value={skills.databases}

            />

            <SkillRow

                label="Tools"

                value={skills.tools}

            />

            <SkillRow

                label="Soft Skills"

                value={skills.softSkills}

            />

        </Box>

    );

};

export default SkillsSection;