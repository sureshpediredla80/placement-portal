
import {Box, Card, CardContent, Typography, Chip, Stack, Divider,Button,} from "@mui/material";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCompanyById,deleteCompany, } from "../../coordinators/api/coordinatorApi";
import CreateCompanyDialog from "../../coordinators/components/CreateCompanyDialog.jsx";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import {
    useNavigate,
} from "react-router-dom";

const AdminCompanyDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] =
        useState(false);
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
    const handleDeleteCompany =
        async () => {
            console.log(
                "Delete button clicked"
            );

            try {

                await deleteCompany(
                    company.id
                );
                console.log(
                    "Delete success"
                );
                {/*  navigate(
                    "/coordinator/companies"
                );*/}

            } catch (error) {

                console.error(
                    "Delete Error",
                    error.response?.data
                );

            }
        };


    return (
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
            <Box
                sx={{
                    mt: 3,
                    display: "flex",
                    gap: 2,
                }}
            >
                <Button
                    variant="contained"
                    onClick={() =>
                        setOpenUpdateDialog(true)
                    }
                >
                    Update Company
                </Button>

                <Button
                    variant="outlined"
                    color="error"
                    onClick={() =>
                        setOpenDeleteDialog(true)
                    }
                >
                    Delete Company
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() =>
                        navigate(
                            `/admin/companies/${company.id}/applications`
                        )
                    }
                >
                    View Applications
                </Button>
            </Box>



            <CreateCompanyDialog
                open={openUpdateDialog}
                onClose={() =>
                    setOpenUpdateDialog(false)
                }
                company={company}
                mode="update"
            />
            <Dialog
                open={openDeleteDialog}
                onClose={() =>
                    setOpenDeleteDialog(false)
                }
            >
                <DialogTitle>
                    Delete Company
                </DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        Are you sure you want
                        to delete this company?
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() =>
                            setOpenDeleteDialog(
                                false
                            )
                        }
                    >
                        Cancel
                    </Button>

                    <Button
                        color="error"
                        variant="contained"
                        onClick={
                            handleDeleteCompany
                        }
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>


        </Box>



    );

};


export default AdminCompanyDetailsPage;