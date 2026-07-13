import {
    Box,
    Typography,
    Paper,
} from "@mui/material";

const ProjectsSection = ({ projects }) => {

    if (!projects?.length) return null;

    return (

        <Box mb={4}>

            <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                    borderBottom: "2px solid #1976d2",
                    mb: 2,
                    pb: 0.5,
                }}
            >
                Projects
            </Typography>

            {projects.map((project, index) => (

                <Paper
                    key={index}
                    variant="outlined"
                    sx={{
                        p: 2,
                        mb: 2,
                    }}
                >

                    <Typography
                        fontWeight={700}
                        fontSize={18}
                    >
                        {project.title}
                    </Typography>

                    <Typography mt={1}>
                        {project.description}
                    </Typography>

                    <Typography mt={1}>
                        <b>Tech Stack :</b>{" "}
                        {project.techStack}
                    </Typography>

                    <Typography>
                        <b>Role :</b>{" "}
                        {project.role}
                    </Typography>

                </Paper>

            ))}

        </Box>

    );

};

export default ProjectsSection;