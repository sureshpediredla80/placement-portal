
import {Box, Card, CardContent, Typography, Chip, Stack, Divider,Button,} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
    useEffect,
    useState,
    useRef,
} from "react";
import AppSnackbar from "../../../components/common/AppSnackbar";
import { useParams } from "react-router-dom";
import { getCompanyById } from "../api/coordinatorApi";
import CreateCompanyDialog from "../components/CreateCompanyDialog.jsx";
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
import {
    deleteCompany,
    bulkUploadResults,
} from "../api/coordinatorApi";
const CoordinatorCompanyDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] =
        useState(false);
    const [openResultDialog, setOpenResultDialog] =
        useState(false);
    const [selectedFile, setSelectedFile] =
        useState(null);
    const [uploading, setUploading] =
        useState(false);
    const [uploadResult, setUploadResult] =
        useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const fileInputRef = useRef(null);
    const [openUploadDialog, setOpenUploadDialog] =
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
    const handleUploadResults =
        async () => {

            if (!selectedFile) {

                setSnackbar({
                    open: true,
                    message: "Please select an Excel file.",
                    severity: "warning",
                });

                return;
            }

            try {

                setUploading(true);

                const response =
                    await bulkUploadResults(
                        company.id,
                        selectedFile
                    );

                setUploadResult(response);

                setOpenUploadDialog(false);
                setOpenResultDialog(true);
                setSnackbar({

                    open: true,

                    message: "Results uploaded successfully.",

                    severity: "success",

                });
                setSelectedFile(null);
            } catch (error) {

                console.error(error);
                setSnackbar({

                    open: true,

                    message:
                        error.response?.data?.message ??
                        "Upload failed.",

                    severity: "error",

                });

            } finally {

                setUploading(false);

            }
        };
    const handleSnackbarClose = () => {

        setSnackbar((prev) => ({
            ...prev,
            open: false,
        }));

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
                            `/coordinator/companies/${company.id}/applications`
                        )
                    }
                >
                    View Applications
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    startIcon={<UploadFileIcon />}
                    onClick={() =>
                        fileInputRef.current.click()
                    }
                >

                    {selectedFile
                        ? selectedFile.name
                        : "Choose Excel"}

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



            <Dialog
                open={openUploadDialog}
                onClose={() =>
                    setOpenUploadDialog(false)
                }
            >
                <DialogTitle>
                    Upload Placement Results
                </DialogTitle>

                <DialogContent>

                    <DialogContentText>
                        Please confirm that you want to upload
                        this Excel file.
                    </DialogContentText>

                    <Typography
                        sx={{
                            mt: 2,
                            fontWeight: 600,
                        }}
                    >
                        Selected File:
                    </Typography>

                    <Typography
                        color="primary"
                    >
                        {selectedFile?.name}
                    </Typography>

                </DialogContent>

                <DialogActions>

                    <Button
                        onClick={() =>
                            setOpenUploadDialog(false)
                        }
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleUploadResults}
                        disabled={uploading}
                    >
                        {uploading ? "Uploading..." : "Upload"}
                    </Button>

                </DialogActions>

            </Dialog>
            <Dialog
                open={openResultDialog}
                onClose={() =>
                    setOpenResultDialog(false)
                }
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Bulk Upload Result
                </DialogTitle>
                <Divider />
                <DialogContent>

                    <Stack spacing={2} sx={{ mt: 1 }}>

                        <Typography>
                            <strong>Total Emails:</strong>{" "}
                            {uploadResult?.totalEmails}
                        </Typography>

                        <Typography color="success.main">
                            <strong>Selected:</strong>{" "}
                            {uploadResult?.selectedCount}
                        </Typography>

                        <Typography color="error.main">
                            <strong>Rejected:</strong>{" "}
                            {uploadResult?.rejectedCount}
                        </Typography>

                        <Typography color="warning.main">
                            <strong>Not Found:</strong>{" "}
                            {uploadResult?.notFoundCount}
                        </Typography>

                    </Stack>
                    {
                        uploadResult?.notFoundCount > 0 && (
                            <>
                                <Divider sx={{ my: 3 }} />

                                <Typography
                                    variant="h6"
                                    fontWeight={600}
                                    gutterBottom
                                >
                                    Emails Not Found
                                </Typography>

                                <Box
                                    sx={{
                                        maxHeight: 200,
                                        overflowY: "auto",
                                        border: "1px solid",
                                        borderColor: "divider",
                                        borderRadius: 2,
                                        p: 2,
                                    }}
                                >
                                    <Stack spacing={1}>
                                        {uploadResult.notFoundEmails.map(
                                            (email) => (
                                                <Typography
                                                    key={email}
                                                    color="error"
                                                >
                                                    • {email}
                                                </Typography>
                                            )
                                        )}
                                    </Stack>
                                </Box>
                            </>
                        )
                    }

                </DialogContent>

                <DialogActions>

                    <Button
                        onClick={() => {

                            setOpenResultDialog(false);

                            setUploadResult(null);

                        }}
                    >
                        Close
                    </Button>
                </DialogActions>

            </Dialog>

            <input
                type="file"
                ref={fileInputRef}
                hidden
                accept=".xlsx,.xls"
                onChange={(event) => {

                    if (
                        event.target.files &&
                        event.target.files.length > 0
                    ) {

                        const file =
                            event.target.files[0];

                        setSelectedFile(file);

                        setOpenUploadDialog(true);

                    }

                }}
            />
            <AppSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={handleSnackbarClose}
            />

            </Box>



    );

};


export default CoordinatorCompanyDetailsPage;