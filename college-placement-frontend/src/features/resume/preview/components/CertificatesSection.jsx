import {
    Box,
    Typography,
} from "@mui/material";

const CertificatesSection = ({
                                 certificates,
                             }) => {

    if (
        !certificates ||
        certificates.length === 0
    ) {
        return null;
    }

    return (

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
                CERTIFICATIONS
            </Typography>

            {

                certificates.map((certificate,index)=>(

                    <Box
                        key={index}
                        mb={1.5}
                    >

                        <Typography
                            fontWeight={600}
                        >
                            {certificate.certificateName}
                        </Typography>

                        <Typography
                            fontSize={14}
                        >

                            {certificate.issuingOrganization}

                            {

                                certificate.issueDate &&
                                ` | ${certificate.issueDate}`

                            }

                        </Typography>

                    </Box>

                ))

            }

        </Box>

    );

};

export default CertificatesSection;