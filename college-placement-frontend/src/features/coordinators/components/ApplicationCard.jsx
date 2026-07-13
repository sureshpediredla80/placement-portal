import {
    Card,
    CardContent,
    Typography,
    Button,
    Stack,
    Chip,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

const ApplicationCard = ({
                             application,
                         }) => {
    const navigate =
        useNavigate();

    return (
        <Card
            sx={{
                borderRadius: 4,
            }}
        >
            <CardContent>
                <Typography
                    variant="h6"
                    fontWeight={700}
                >
                    {
                        application.fullName
                    }
                </Typography>

                <Typography>
                    {
                        application.rollNumber
                    }
                </Typography>

                <Typography
                    sx={{ mt: 1 }}
                >
                    Company :
                    {" "}
                    {
                        application.companyName
                    }
                </Typography>

                <Typography>
                    Role :
                    {" "}
                    {
                        application.roleOffered
                    }
                </Typography>

                <Typography>
                    Package :
                    {" "}
                    {
                        application.packageOffered
                    }
                </Typography>

                <Stack
                    direction="row"
                    sx={{ mt: 2 }}
                >
                    <Chip
                        label={
                            application.status
                        }
                        color="primary"
                    />
                </Stack>

                <Button
                    sx={{ mt: 2 }}
                    fullWidth
                    variant="contained"
                    onClick={() =>
                        navigate(
                            `/coordinator/applications/${application.id}`
                        )
                    }
                >
                    View Details
                </Button>
            </CardContent>
        </Card>
    );
};

export default ApplicationCard;