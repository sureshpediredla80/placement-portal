
import {Box, Card, CardContent, Typography, Chip, Stack, Divider,Button,} from "@mui/material";

import AppSnackbar from "../../../components/common/AppSnackbar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCompanyById } from "../api/companyApi";
import { applyToCompany } from "../../applications/api/applicationApi";
const StudentCompanyDetailsPage = () => {
    const { id } = useParams();

    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const fetchCompany = async () => {
        try {
            const data = await getCompanyById(id);
            setCompany(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchCompany();
    }, []);
    if (loading) {
        return <div>Loading...</div>;
    }
    const packageLpa = `${(
        company.packageOffered / 100000
    ).toFixed(1)} LPA`;
    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({
            ...prev,
            open: false,
        }));
    };
    const handleApply = async () => {
        try {
            await applyToCompany(company.id);

            setSnackbar({
                open: true,
                message: "Application submitted successfully.",
                severity: "success",
            });

        } catch (error) {
            console.error(error);

            setSnackbar({
                open: true,
                message:
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to apply",
                severity: "error",
            });
        }
    };

    return (
        <>
        <Box>
            <Card
                sx={{
                    borderRadius: 4,
                    boxShadow: 3,
                }}
            >
                <CardContent>
                    <Typography
                        variant="h4"
                        fontWeight={700}
                        gutterBottom
                    >
                        {company.companyName}
                    </Typography>

                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{ mb: 2 }}
                    >
                        <Chip
                            label={company.roleOffered}
                            color="primary"
                        />

                        <Chip
                            label={packageLpa}
                            color="success"
                        />
                    </Stack>
                    <Box sx={{ mt: 3 }}>
                        <Typography sx={{ mb: 1.5 }}>
                            <strong>Minimum CGPA:</strong> {company.minimumCgpa}
                        </Typography>

                        <Typography sx={{ mb: 1.5 }}>
                            <strong>Backlogs Allowed:</strong>{" "}
                            {company.backlogsAllowed ? "Yes" : "No"}
                        </Typography>

                        <Typography sx={{ mb: 1.5 }}>
                            <strong>Apply Deadline:</strong>{" "}
                            {new Date(company.applyDeadline).toLocaleDateString()}
                        </Typography>

                        <Typography>
                            <strong>Drive Date:</strong>{" "}
                            {new Date(company.driveDate).toLocaleDateString()}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
            <Card sx={{ mt: 3 ,
                borderRadius: 4,
                boxShadow: 3,
                         }}>
                <CardContent>
                    <Typography
                        variant="h6"
                        fontWeight={600}
                        gutterBottom
                    >
                        Job Description
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    <Typography>
                        {company.jobDescription}
                    </Typography>
                </CardContent>
            </Card>
            <Card sx={{ mt: 3 , borderRadius: 4,
                boxShadow: 3,}}>
                <CardContent>
                    <Typography
                        variant="h6"
                        fontWeight={600}
                        gutterBottom
                    >
                        Eligible Branches
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    <Stack
                        direction="row"
                        spacing={1}
                        useFlexGap
                        flexWrap="wrap"
                    >
                        {company.allowedBranches?.map((branch) => (
                            <Chip
                                key={branch.id}
                                label={branch.code}
                                color="primary"
                                variant="outlined"
                            />
                        ))}
                    </Stack>
                </CardContent>
            </Card>
            <Card sx={{ mt: 3 , borderRadius: 4,
                boxShadow: 3,}}>
                <CardContent>
                    <Typography
                        variant="h6"
                        fontWeight={600}
                        gutterBottom
                    >
                        Allowed Years
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    <Stack
                        direction="row"
                        spacing={1}
                    >
                        {company.allowedYears?.map((year) => (
                            <Chip
                                key={year}
                                label={`${year} Year`}
                                color="secondary"
                            />
                        ))}
                    </Stack>
                </CardContent>
            </Card>
            <Card sx={{ mt: 3 , borderRadius: 4,
                boxShadow: 3,}}>
                <CardContent>
                    <Typography
                        variant="h6"
                        fontWeight={600}
                        gutterBottom
                    >
                        Preparation Resources
                    </Typography>

                    <Divider sx={{ mb: 2 }} />
                    {company.preparationResources?.length > 0 ? (
                        <Stack spacing={1}>
                            {company.preparationResources.map((resource, index) => (
                                <a
                                    key={index}
                                    href={resource}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {resource}
                                </a>
                            ))}
                        </Stack>
                    ) : (
                        <Typography color="text.secondary">
                            No preparation resources available.
                        </Typography>
                    )}
                </CardContent>
            </Card>
            <Box sx={{ mt: 3 }}>
                <Button
                    variant="contained"
                    size="large"
                    onClick={handleApply}
                >
                    Apply Now
                </Button>
            </Box>
        </Box>

    <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
    />
</>

    );

};

export default StudentCompanyDetailsPage;