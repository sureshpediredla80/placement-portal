import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Stack,
    Divider,
    Button,
    CircularProgress,
    useTheme,
    alpha,
    Container,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from "@mui/material";

// Using react-icons to completely avoid @mui/icons-material Vite build errors
import { 
    MdBusiness, 
    MdOutlineWork, 
    MdPayments, 
    MdEventAvailable, 
    MdSchool, 
    MdRule, 
    MdOutlineDescription, 
    MdCheckCircle, 
    MdCancel, 
    MdLibraryBooks, 
    MdLink,
    MdFileUpload,
    MdEdit,
    MdDelete,
    MdPeople,
    MdAdminPanelSettings
} from "react-icons/md";

import AppSnackbar from "../../../components/common/AppSnackbar";
import { getCompanyById, deleteCompany, bulkUploadResults } from "../api/coordinatorApi";
import CreateCompanyDialog from "../components/CreateCompanyDialog.jsx";

// Helper components for clean reusability
const DetailItem = ({ icon, label, value }) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <Box sx={{ mr: 2, display: 'flex', color: 'primary.main', fontSize: 24 }}>
                {icon}
            </Box>
            <Box>
                <Typography variant="caption" color="text.secondary" display="block" fontWeight={600}>
                    {label}
                </Typography>
                <Typography variant="body1" fontWeight={500} color="text.primary">
                    {value !== null && value !== undefined && value !== '' && value !== 0 ? value : 'N/A'}
                </Typography>
            </Box>
        </Box>
    );
};

const BooleanItem = ({ label, value }) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <Box sx={{ mr: 2, display: 'flex', color: value ? 'success.main' : 'error.main', fontSize: 24 }}>
                {value ? <MdCheckCircle /> : <MdCancel />}
            </Box>
            <Box>
                 <Typography variant="caption" color="text.secondary" display="block" fontWeight={600}>
                    {label}
                </Typography>
                <Typography variant="body1" fontWeight={500} color={value ? 'success.dark' : 'error.dark'}>
                    {value ? 'Yes' : 'No'}
                </Typography>
            </Box>
        </Box>
    );
};

const CoordinatorCompanyDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();

    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Dialog States
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openResultDialog, setOpenResultDialog] = useState(false);
    const [openUploadDialog, setOpenUploadDialog] = useState(false);
    
    // Upload States
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState(null);
    const fileInputRef = useRef(null);

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
    }, [id]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress size={60} thickness={4} />
            </Box>
        );
    }

    if (!company) {
        return (
             <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <Typography variant="h5" color="text.secondary">Company not found.</Typography>
            </Box>
        );
    }

    // Formatting helpers
    const formatLpa = (val) => val ? `${(val / 100000).toFixed(1)} LPA` : "N/A";
    const packageRange = company.maximumPackage && company.maximumPackage !== company.minimumPackage 
        ? `${formatLpa(company.minimumPackage)} - ${formatLpa(company.maximumPackage)}`
        : formatLpa(company.minimumPackage);
        
    const formatDate = (dateString) => dateString 
        ? new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) 
        : "N/A";

    const handleDeleteCompany = async () => {
        try {
            await deleteCompany(company.id);
            setSnackbar({
                open: true,
                message: "Company deleted successfully",
                severity: "success"
            });
            setTimeout(() => {
                navigate("/coordinator/companies");
            }, 1000);
        } catch (error) {
            console.error("Delete Error", error.response?.data);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || "Failed to delete company",
                severity: "error"
            });
            setOpenDeleteDialog(false);
        }
    };

    const handleUploadResults = async () => {
        if (!selectedFile) {
            setSnackbar({ open: true, message: "Please select an Excel file.", severity: "warning" });
            return;
        }

        try {
            setUploading(true);
            const response = await bulkUploadResults(company.id, selectedFile);
            setUploadResult(response);
            setOpenUploadDialog(false);
            setOpenResultDialog(true);
            setSnackbar({ open: true, message: "Results uploaded successfully.", severity: "success" });
            setSelectedFile(null);
            
            // Reset the file input
            if(fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
            console.error(error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message ?? "Upload failed.",
                severity: "error"
            });
        } finally {
            setUploading(false);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, md: 4 } }}>
            {/* Header Section */}
            <Card
                sx={{
                    borderRadius: 4,
                    boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.light, 0.1)} 100%)`,
                    mb: 4,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                }}
            >
                <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <MdBusiness size={56} color={theme.palette.primary.main} />
                        <Typography variant="h3" fontWeight={800} color="text.primary" sx={{ letterSpacing: '-0.5px' }}>
                            {company.companyName}
                        </Typography>
                    </Box>
                    
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
                        <Chip
                            icon={<Box sx={{ display: 'flex', pl: 1 }}><MdOutlineWork size={20} /></Box>}
                            label={company.roleOffered}
                            color="primary"
                            sx={{ fontWeight: 600, px: 1, py: 2.5, borderRadius: 3, fontSize: '1.05rem' }}
                        />
                        <Chip
                            icon={<Box sx={{ display: 'flex', pl: 1 }}><MdPayments size={20} /></Box>}
                            label={packageRange}
                            color="success"
                            variant="outlined"
                            sx={{ fontWeight: 600, px: 1, py: 2.5, borderRadius: 3, fontSize: '1.05rem', bgcolor: 'background.paper' }}
                        />
                    </Stack>
                </CardContent>
            </Card>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 4 }}>
                {/* Left Column - Main Details */}
                <Box>
                    {/* Job Description */}
                    <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.04)', mb: 4, border: '1px solid', borderColor: 'divider' }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box display="flex" alignItems="center" gap={1.5} mb={3}>
                                <Box sx={{ display: 'flex', color: 'primary.main', fontSize: 28 }}><MdOutlineDescription /></Box>
                                <Typography variant="h5" fontWeight={700}>
                                    Job Description
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 3 }} />
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                                {company.jobDescription || "No job description provided."}
                            </Typography>
                        </CardContent>
                    </Card>

                    {/* Eligibility & Requirements */}
                    <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.04)', mb: 4, border: '1px solid', borderColor: 'divider' }}>
                        <CardContent sx={{ p: 4 }}>
                             <Box display="flex" alignItems="center" gap={1.5} mb={3}>
                                <Box sx={{ display: 'flex', color: 'primary.main', fontSize: 28 }}><MdRule /></Box>
                                <Typography variant="h5" fontWeight={700}>
                                    Eligibility Criteria
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 4 }} />
                            
                            <Box>
                                {/* Academic Criteria Section */}
                                <Typography variant="subtitle1" fontWeight={700} color="primary.main" gutterBottom sx={{ textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    Academic Requirements
                                </Typography>
                                
                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 3, mt: 2, mb: 4 }}>
                                    <DetailItem icon={<MdSchool />} label="Min CGPA" value={company.minimumCgpa} />
                                    <DetailItem icon={<MdSchool />} label="Max CGPA" value={company.maximumCgpa} />
                                    <DetailItem icon={<MdSchool />} label="SSC Minimum %" value={company.minimumSscPercentage} />
                                    <DetailItem icon={<MdSchool />} label="Inter Minimum %" value={company.minimumInterPercentage} />
                                    <DetailItem icon={<MdSchool />} label="Diploma Min CGPA" value={company.minimumDiplomaCgpa} />
                                    <DetailItem icon={<MdSchool />} label="Max EAMCET Rank" value={company.maximumEmcetRank} />
                                    <DetailItem icon={<MdSchool />} label="Max ECET Rank" value={company.maximumEcetRank} />
                                </Box>

                                <Divider sx={{ my: 3 }} />

                                {/* Rules & Allowances Section */}
                                <Typography variant="subtitle1" fontWeight={700} color="primary.main" gutterBottom sx={{ textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    Rules & Allowances
                                </Typography>
                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 3, mt: 2 }}>
                                    <BooleanItem label="Backlogs Allowed" value={company.backlogsAllowed} />
                                    <BooleanItem label="First Attempt Required" value={company.firstAttemptRequired} />
                                    <DetailItem icon={<MdSchool />} label="Gender Eligibility" value={company.genderEligibility} />
                                    <BooleanItem label="Placed Students Allowed" value={company.allowAlreadyPlacedStudents} />
                                    <DetailItem icon={<MdPayments />} label="Max Prev. Package" value={formatLpa(company.maximumPreviousPackage)} />
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>

                {/* Right Column - Side Panels & Actions */}
                <Box>
                    {/* Coordinator Actions Panel */}
                    <Card sx={{ 
                        borderRadius: 4, 
                        boxShadow: '0 8px 24px rgba(0,0,0,0.06)', 
                        mb: 4, 
                        background: theme.palette.mode === 'dark' ? alpha(theme.palette.secondary.main, 0.1) : alpha(theme.palette.secondary.main, 0.04),
                        border: `1px solid ${theme.palette.secondary.main}`
                    }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={800} gutterBottom display="flex" alignItems="center" gap={1.5} color="secondary.main">
                                <Box sx={{ display: 'flex', fontSize: 24 }}><MdAdminPanelSettings /></Box> Coordinator Actions
                            </Typography>
                            <Divider sx={{ mb: 3 }} />
                            
                            <Stack spacing={2}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="large"
                                    startIcon={<MdPeople size={20} />}
                                    onClick={() => navigate(`/coordinator/companies/${company.id}/applications`)}
                                    sx={{ py: 1.5, fontWeight: 700, borderRadius: 2 }}
                                >
                                    View Applications
                                </Button>
                                
                                <Button
                                    variant="contained"
                                    color="success"
                                    size="large"
                                    startIcon={<MdFileUpload size={20} />}
                                    onClick={() => fileInputRef.current.click()}
                                    sx={{ py: 1.5, fontWeight: 700, borderRadius: 2 }}
                                >
                                    {selectedFile ? selectedFile.name : "Upload Excel Results"}
                                </Button>
                                
                                <Divider sx={{ my: 1 }} />
                                
                                <Stack direction="row" spacing={2}>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        fullWidth
                                        startIcon={<MdEdit size={18} />}
                                        onClick={() => setOpenUpdateDialog(true)}
                                        sx={{ fontWeight: 600, borderRadius: 2 }}
                                    >
                                        Update
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        fullWidth
                                        startIcon={<MdDelete size={18} />}
                                        onClick={() => setOpenDeleteDialog(true)}
                                        sx={{ fontWeight: 600, borderRadius: 2 }}
                                    >
                                        Delete
                                    </Button>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>

                    {/* Important Dates */}
                    <Card sx={{ 
                        borderRadius: 4, 
                        boxShadow: '0 4px 20px rgba(0,0,0,0.04)', 
                        mb: 4, 
                        border: '1px solid', 
                        borderColor: 'divider'
                    }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={800} gutterBottom display="flex" alignItems="center" gap={1.5}>
                                <Box sx={{ display: 'flex', color: 'primary.main', fontSize: 24 }}><MdEventAvailable /></Box> Key Dates
                            </Typography>
                            <Divider sx={{ mb: 3 }} />
                            
                            <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                                <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase" display="block" mb={0.5}>
                                    Apply Deadline
                                </Typography>
                                <Typography variant="h6" fontWeight={700} color="error.main">
                                    {formatDate(company.applyDeadline)}
                                </Typography>
                            </Box>
                            
                            <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                                <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase" display="block" mb={0.5}>
                                    Drive Date
                                </Typography>
                                <Typography variant="h6" fontWeight={700} color="primary.main">
                                    {formatDate(company.driveDate)}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Eligible Branches & Years */}
                    <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.04)', mb: 4, border: '1px solid', borderColor: 'divider' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={800} gutterBottom>
                                Eligible Branches
                            </Typography>
                            <Divider sx={{ mb: 3 }} />
                            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" mb={4}>
                                {company.allowedBranches?.length > 0 ? company.allowedBranches.map((branch) => (
                                    <Chip
                                        key={branch.id}
                                        label={branch.code}
                                        color="primary"
                                        variant="filled"
                                        sx={{ fontWeight: 600, borderRadius: 2 }}
                                    />
                                )) : <Typography variant="body2" color="text.secondary">Any Branch</Typography>}
                            </Stack>

                            <Typography variant="h6" fontWeight={800} gutterBottom>
                                Allowed Years
                            </Typography>
                            <Divider sx={{ mb: 3 }} />
                            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                                {company.allowedYears?.length > 0 ? company.allowedYears.map((year) => (
                                    <Chip
                                        key={year}
                                        label={`${year}${year === 1 ? 'st' : year === 2 ? 'nd' : year === 3 ? 'rd' : 'th'} Year`}
                                        color="secondary"
                                        variant="filled"
                                        sx={{ fontWeight: 600, borderRadius: 2 }}
                                    />
                                )) : <Typography variant="body2" color="text.secondary">Any Year</Typography>}
                            </Stack>
                        </CardContent>
                    </Card>

                    {/* Resources */}
                    <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid', borderColor: 'divider' }}>
                        <CardContent sx={{ p: 3 }}>
                             <Typography variant="h6" fontWeight={800} gutterBottom display="flex" alignItems="center" gap={1.5}>
                                <Box sx={{ display: 'flex', color: 'primary.main', fontSize: 24 }}><MdLibraryBooks /></Box> Resources
                            </Typography>
                            <Divider sx={{ mb: 3 }} />
                            {company.preparationResources?.length > 0 ? (
                                <Stack spacing={2}>
                                    {company.preparationResources.map((resource, index) => (
                                        <Button
                                            key={index}
                                            variant="outlined"
                                            color="primary"
                                            href={resource}
                                            target="_blank"
                                            rel="noreferrer"
                                            startIcon={<MdLink size={20} />}
                                            sx={{ 
                                                justifyContent: 'flex-start', 
                                                textTransform: 'none', 
                                                borderRadius: 2,
                                                py: 1.5,
                                                fontWeight: 600
                                            }}
                                        >
                                            Resource Link {index + 1}
                                        </Button>
                                    ))}
                                </Stack>
                            ) : (
                                <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'background.default', borderRadius: 2 }}>
                                    <Typography color="text.secondary" variant="body2" fontWeight={500}>
                                        No preparation resources provided.
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Box>
            </Box>

            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                hidden
                accept=".xlsx,.xls"
                onChange={(event) => {
                    if (event.target.files && event.target.files.length > 0) {
                        const file = event.target.files[0];
                        setSelectedFile(file);
                        setOpenUploadDialog(true);
                    }
                }}
            />

            {/* Dialogs */}
            <CreateCompanyDialog
                open={openUpdateDialog}
                onClose={() => setOpenUpdateDialog(false)}
                company={company}
                mode="update"
            />
            
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle sx={{ fontWeight: 700 }}>Delete Company</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this company? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setOpenDeleteDialog(false)} sx={{ fontWeight: 600 }}>
                        Cancel
                    </Button>
                    <Button color="error" variant="contained" onClick={handleDeleteCompany} sx={{ fontWeight: 600 }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openUploadDialog} onClose={() => setOpenUploadDialog(false)}>
                <DialogTitle sx={{ fontWeight: 700 }}>Upload Placement Results</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please confirm that you want to upload this Excel file for {company.companyName}.
                    </DialogContentText>
                    <Typography sx={{ mt: 3, fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', color: 'text.secondary' }}>
                        Selected File:
                    </Typography>
                    <Typography color="primary.main" fontWeight={600} sx={{ mt: 0.5 }}>
                        {selectedFile?.name}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setOpenUploadDialog(false)} sx={{ fontWeight: 600 }}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="success" onClick={handleUploadResults} disabled={uploading} sx={{ fontWeight: 600 }}>
                        {uploading ? <CircularProgress size={24} color="inherit" /> : "Upload Results"}
                    </Button>
                </DialogActions>
            </Dialog>
            
            <Dialog open={openResultDialog} onClose={() => setOpenResultDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>Bulk Upload Result</DialogTitle>
                <Divider />
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <Typography>
                            <strong>Total Emails:</strong> {uploadResult?.totalEmails}
                        </Typography>
                        <Typography color="success.main">
                            <strong>Selected:</strong> {uploadResult?.selectedCount}
                        </Typography>
                        <Typography color="error.main">
                            <strong>Rejected:</strong> {uploadResult?.rejectedCount}
                        </Typography>
                        <Typography color="warning.main">
                            <strong>Not Found:</strong> {uploadResult?.notFoundCount}
                        </Typography>
                    </Stack>
                    {uploadResult?.notFoundCount > 0 && (
                        <>
                            <Divider sx={{ my: 3 }} />
                            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                                Emails Not Found
                            </Typography>
                            <Box sx={{
                                maxHeight: 200,
                                overflowY: "auto",
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 2,
                                p: 2,
                                bgcolor: 'background.default'
                            }}>
                                <Stack spacing={1}>
                                    {uploadResult.notFoundEmails.map((email) => (
                                        <Typography key={email} color="error.main" variant="body2" fontFamily="monospace">
                                            • {email}
                                        </Typography>
                                    ))}
                                </Stack>
                            </Box>
                        </>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        variant="contained"
                        onClick={() => {
                            setOpenResultDialog(false);
                            setUploadResult(null);
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <AppSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={handleSnackbarClose}
            />
        </Container>
    );
};

export default CoordinatorCompanyDetailsPage;
