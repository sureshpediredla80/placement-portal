import {
    Box,
    Typography,
} from "@mui/material";

const EducationSection = ({
                              education,
                          }) => {

    if (!education) {
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
                EDUCATION
            </Typography>

            <Typography
                sx={{
                    fontWeight: 700,
                    fontSize: 16,
                }}
            >
                {education.degree}
            </Typography>

            <Typography
                sx={{
                    fontSize: 14,
                    mt: .5,
                }}
            >
                {education.specialization}
            </Typography>

            <Typography
                sx={{
                    fontSize: 14,
                    mt: .5,
                }}
            >
                {education.college}
            </Typography>

            <Typography
                sx={{
                    fontSize: 14,
                    mt: .5,
                }}
            >
                <strong>CGPA :</strong> {education.cgpa}
            </Typography>

            <Typography
                sx={{
                    fontSize: 14,
                    mt: .5,
                }}
            >
                <strong>Graduation :</strong> {education.graduationYear}
            </Typography>

        </Box>

    );

};

export default EducationSection;