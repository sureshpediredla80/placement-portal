import {
    Box,
    Typography,
} from "@mui/material";

const ExperienceSection = ({
                               experience,
                           })=>{

    if(!experience){
        return null;
    }

    return(

        <Box mb={3}>

            <Typography
                sx={{
                    fontWeight:700,
                    fontSize:18,
                    borderBottom:"1px solid #000",
                    pb:.5,
                    mb:2,
                }}
            >
                EXPERIENCE
            </Typography>

            <Typography>

                {

                    experience.experienceLevel==="Fresher"

                        ? "Fresher"

                        :

                        `${experience.designation}
                     | ${experience.company}`

                }

            </Typography>

        </Box>

    );

};

export default ExperienceSection;