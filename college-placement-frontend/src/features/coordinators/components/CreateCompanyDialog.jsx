import { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    ListItemText,
    Switch,
    FormControlLabel,
    Typography,
    Stack,
    Divider,
    Box, TextField
} from "@mui/material";
import { useForm, useController } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import {
    createCompany,
    updateCompany,
    getBranches,
    getPreviousCompanyDrives,
} from "../api/coordinatorApi";
import AppSnackbar from "../../../components/common/AppSnackbar";
import AppFormField from "../../../components/common/AppFormField";

// Helper function to safely transform empty number fields to null
const transformNumber = (value, originalValue) =>
    originalValue === "" || originalValue === null ? null : Number(value);

const schema = yup.object({
    companyName: yup.string().required("Company name is required"),
    roleOffered: yup.string().required("Role is required"),

    // Package Details
    minimumPackage: yup.number().nullable().transform(transformNumber),
    maximumPackage: yup.number().nullable().transform(transformNumber),

    // Academic Details
    minimumCgpa: yup.number().nullable().transform(transformNumber),
    maximumCgpa: yup.number().nullable().transform(transformNumber),
    minimumSscPercentage: yup.number().nullable().transform(transformNumber),
    minimumInterPercentage: yup.number().nullable().transform(transformNumber),
    minimumDiplomaCgpa: yup.number().nullable().transform(transformNumber),
    maximumEmcetRank: yup.number().nullable().transform(transformNumber),
    maximumEcetRank: yup.number().nullable().transform(transformNumber),

    // Booleans / Conditions
    backlogsAllowed: yup.boolean(),

    maximumAllowedBacklogs: yup
        .number()
        .nullable()
        .transform(transformNumber)
        .when("backlogsAllowed", {
            is: true,
            then: (schema) =>
                schema
                    .required("Maximum allowed backlogs is required")
                    .min(0, "Backlogs cannot be negative")
                    .integer("Backlogs must be a whole number"),
            otherwise: (schema) => schema.nullable(),
        }),

    firstAttemptRequired: yup.boolean(),

    genderEligibility: yup.string().nullable().transform(v => v === "" ? null : v),

    driveDate: yup.string().nullable().transform(v => v === "" ? null : v),
    applyDeadline: yup.string().nullable().transform(v => v === "" ? null : v),

    jobDescription: yup.string().nullable(),
    preparationResources: yup.string().nullable(),

    allowedBranchIds: yup.array().of(yup.number()),
    allowedYears: yup.array().of(yup.number()),

    allowAlreadyPlacedStudents: yup.boolean(),
    maximumPreviousPackage: yup.number().nullable().transform(transformNumber),
    includedCompanyIds: yup.array().of(yup.number()),
    excludedCompanyIds: yup.array().of(yup.number()),
});

const genderOptions = [
    "ALL",
    "MALE",
    "FEMALE",
    "OTHER"
];

// Reusable Select Component
const AppSelectField = ({ control, name, label, options }) => {
    const { field, fieldState } = useController({ name, control });

    return (
        <FormControl fullWidth error={!!fieldState.error} size="medium">
            <InputLabel id={`select-${name}-label`}>{label}</InputLabel>
            <Select
                {...field}
                labelId={`select-${name}-label`}
                label={label}
                displayEmpty
                value={field.value || ""}
            >
                {options.map((option) => (
                    <MenuItem key={option} value={option}>
                        {option.replaceAll("_", " ")}
                    </MenuItem>
                ))}
            </Select>
            {fieldState.error && (
                <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                    {fieldState.error.message}
                </Typography>
            )}
        </FormControl>
    );
};

const CreateCompanyDialog = ({
                                 open,
                                 onClose,
                                 onSuccess,
                                 company,
                                 mode = "create"
                             }) => {
    const [branches, setBranches] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [previousCompanies, setPreviousCompanies] = useState([]);
    const [previousDriveYear, setPreviousDriveYear] = useState(
        new Date().getFullYear()
    );

    const fetchBranches = async () => {
        try {
            const response = await getBranches();
            setBranches(response);
        } catch (error) {
            console.error(error);
        }
    };
    const fetchPreviousCompanies = async () => {
        try {
            const response =
                await getPreviousCompanyDrives(previousDriveYear);

            setPreviousCompanies(response);

            // For CREATE mode:
            // select all previous companies by default
            if (mode === "create") {
                setValue(
                    "includedCompanyIds",
                    response.map(company => company.id)
                );

                setValue(
                    "excludedCompanyIds",
                    []
                );
            }
        } catch (error) {
            console.error(
                "Failed to fetch previous company drives:",
                error
            );

            setPreviousCompanies([]);
        }
    };

    useEffect(() => {
        if (open) {
            fetchBranches();
        }
    }, [open]);




    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            companyName: "",
            roleOffered: "",
            minimumPackage: null,
            maximumPackage: null,
            minimumCgpa: null,
            maximumCgpa: null,

            backlogsAllowed: true,
            maximumAllowedBacklogs: null,

            minimumSscPercentage: null,
            minimumInterPercentage: null,
            minimumDiplomaCgpa: null,
            maximumEmcetRank: null,
            maximumEcetRank: null,

            firstAttemptRequired: false,
            genderEligibility: "ALL",
            driveDate: "",
            applyDeadline: "",
            jobDescription: "",
            preparationResources: "",
            allowedBranchIds: [],
            allowedYears: [],
            allowAlreadyPlacedStudents: false,
            maximumPreviousPackage: null,

            includedCompanyIds: [],
            excludedCompanyIds: [],
        },
    });

    const allowPlaced = watch("allowAlreadyPlacedStudents");

    const selectedBranchIds =
        watch("allowedBranchIds") || [];

    const selectedYears =
        watch("allowedYears") || [];

    const includedCompanyIds =
        watch("includedCompanyIds") || [];

    const excludedCompanyIds =
        watch("excludedCompanyIds") || [];
    useEffect(() => {
        if (open && allowPlaced) {
            fetchPreviousCompanies();
        }
    }, [open, allowPlaced, previousDriveYear]);

    useEffect(() => {
        if (open) {
            if (mode === "update" && company) {
                reset({
                    companyName: company.companyName || "",
                    roleOffered: company.roleOffered || "",
                    minimumPackage: company.minimumPackage ?? null,
                    maximumPackage: company.maximumPackage ?? null,
                    minimumCgpa: company.minimumCgpa ?? null,
                    maximumCgpa: company.maximumCgpa ?? null,
                    backlogsAllowed: company.backlogsAllowed ?? true,

                    maximumAllowedBacklogs:
                        company.maximumAllowedBacklogs ?? null,

                    minimumSscPercentage: company.minimumSscPercentage ?? null,
                    minimumInterPercentage: company.minimumInterPercentage ?? null,
                    minimumDiplomaCgpa: company.minimumDiplomaCgpa ?? null,
                    maximumEmcetRank: company.maximumEmcetRank ?? null,
                    maximumEcetRank: company.maximumEcetRank ?? null,
                    firstAttemptRequired: company.firstAttemptRequired || false,
                    genderEligibility: company.genderEligibility || "ALL",
                    // Substring fixes the datetime-local format from ISO strings
                    driveDate: company.driveDate ? company.driveDate.substring(0, 16) : "",
                    applyDeadline: company.applyDeadline ? company.applyDeadline.substring(0, 16) : "",
                    jobDescription: company.jobDescription || "",
                    preparationResources: company.preparationResources?.join("\n") || "",
                    allowedBranchIds: company.allowedBranchIds || company.allowedBranches?.map((b) => b.id) || [],
                    allowedYears: company.allowedYears || [],
                    allowAlreadyPlacedStudents: company.allowAlreadyPlacedStudents || false,
                    maximumPreviousPackage: company.maximumPreviousPackage ?? null,
                    includedCompanyIds:
                        company.includedCompanyIds || [],

                    excludedCompanyIds:
                        company.excludedCompanyIds || [],
                });
            } else {
                reset();
            }
        }
    }, [company, mode, open, reset]);

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);

            const payload = {
                ...data,
                preparationResources: data.preparationResources
                    ? data.preparationResources
                        .split("\n")
                        .map((item) => item.trim())
                        .filter((item) => item !== "")
                    : [],
                maximumPreviousPackage: data.allowAlreadyPlacedStudents
                    ? data.maximumPreviousPackage
                    : null
            };

            if (mode === "update") {
                await updateCompany(company.id, payload);
            } else {
                await createCompany(payload);
            }

            setSnackbarMessage(`${payload.companyName} ${mode === "update" ? "updated" : "created"} successfully`);
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            onSuccess?.();

            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (error) {
            console.error(error);
            setSnackbarSeverity("error");
            setSnackbarMessage(mode === "update" ? "Failed to update company" : "Failed to create company");
            setSnackbarOpen(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInclusionChange = (companyId) => {
        const isCurrentlySelected =
            includedCompanyIds.includes(companyId);

        if (isCurrentlySelected) {
            setValue(
                "includedCompanyIds",
                includedCompanyIds.filter(
                    id => id !== companyId
                )
            );
        } else {
            // Add to inclusion
            setValue(
                "includedCompanyIds",
                [...includedCompanyIds, companyId]
            );

            // Remove from exclusion
            setValue(
                "excludedCompanyIds",
                excludedCompanyIds.filter(
                    id => id !== companyId
                )
            );
        }
    };

    const handleExclusionChange = (companyId) => {
        const isCurrentlySelected =
            excludedCompanyIds.includes(companyId);

        if (isCurrentlySelected) {
            setValue(
                "excludedCompanyIds",
                excludedCompanyIds.filter(
                    id => id !== companyId
                )
            );
        } else {
            // Add to exclusion
            setValue(
                "excludedCompanyIds",
                [...excludedCompanyIds, companyId]
            );

            // Remove from inclusion
            setValue(
                "includedCompanyIds",
                includedCompanyIds.filter(
                    id => id !== companyId
                )
            );
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            PaperProps={{
                sx: { borderRadius: 3 }
            }}
        >
            <DialogTitle sx={{ fontWeight: 700, borderBottom: "1px solid #eee" }}>
                {mode === "update" ? "Update Company Details" : "Create New Company Drive"}
            </DialogTitle>

            <DialogContent>
                <Stack spacing={3} sx={{ mt: 2 }}>

                    {/* --- Company Information --- */}
                    <Typography variant="h6">Company Information</Typography>
                    <Divider />
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <AppFormField control={control} name="companyName" label="Company Name" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <AppFormField control={control} name="roleOffered" label="Role Offered" />
                        </Grid>
                    </Grid>

                    {/* --- Package Criteria --- */}
                    <Typography variant="h6">Package Criteria</Typography>
                    <Divider />
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <AppFormField control={control} name="minimumPackage" label="Minimum Package (LPA)" type="number" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <AppFormField control={control} name="maximumPackage" label="Maximum Package (LPA)" type="number" />
                        </Grid>
                    </Grid>

                    {/* --- Academic Criteria --- */}
                    <Typography variant="h6">Academic Criteria</Typography>
                    <Divider />
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <AppFormField control={control} name="minimumCgpa" label="Minimum CGPA" type="number" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <AppFormField control={control} name="maximumCgpa" label="Maximum CGPA" type="number" />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <AppFormField control={control} name="minimumSscPercentage" label="Minimum SSC %" type="number" />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <AppFormField control={control} name="minimumInterPercentage" label="Minimum Inter %" type="number" />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <AppFormField control={control} name="minimumDiplomaCgpa" label="Minimum Diploma CGPA" type="number" />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <AppFormField control={control} name="maximumEmcetRank" label="Maximum EAMCET Rank" type="number" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <AppFormField control={control} name="maximumEcetRank" label="Maximum ECET Rank" type="number" />
                        </Grid>
                    </Grid>

                    {/* --- Eligibility --- */}
                    <Typography variant="h6">Eligibility</Typography>
                    <Divider />
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth size="medium">
                                <InputLabel id="allowed-branches-label">Allowed Branches</InputLabel>
                                <Select
                                    labelId="allowed-branches-label"
                                    multiple
                                    value={selectedBranchIds}
                                    label="Allowed Branches"
                                    onChange={(e) => setValue("allowedBranchIds", e.target.value)}
                                    renderValue={(selected) =>
                                        branches
                                            .filter((b) => selected.includes(b.id))
                                            .map((b) => b.name)
                                            .join(", ")
                                    }
                                >
                                    {branches.map((branch) => (
                                        <MenuItem key={branch.id} value={branch.id}>
                                            <Checkbox checked={selectedBranchIds.includes(branch.id)} />
                                            <ListItemText primary={branch.name} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth size="medium">
                                <InputLabel id="allowed-years-label">Allowed Years</InputLabel>
                                <Select
                                    labelId="allowed-years-label"
                                    multiple
                                    value={selectedYears}
                                    label="Allowed Years"
                                    onChange={(e) => setValue("allowedYears", e.target.value)}
                                    renderValue={(selected) => selected.map(y => `Year ${y}`).join(", ")}
                                >
                                    {[1, 2, 3, 4].map((year) => (
                                        <MenuItem key={year} value={year}>
                                            <Checkbox checked={selectedYears.includes(year)} />
                                            <ListItemText primary={`Year ${year}`} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <AppSelectField
                                control={control}
                                name="genderEligibility"
                                label="Gender Eligibility"
                                options={genderOptions}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={watch("backlogsAllowed")}
                                        onChange={(e) => {
                                            const allowed = e.target.checked;

                                            setValue("backlogsAllowed", allowed);

                                            // If backlogs are not allowed,
                                            // clear maximum allowed backlog value
                                            if (!allowed) {
                                                setValue("maximumAllowedBacklogs", null);
                                            }
                                        }}
                                    />
                                }
                                label="Backlogs Allowed"
                            />
                        </Grid>

                        {watch("backlogsAllowed") && (
                            <Grid item xs={12} md={6}>
                                <AppFormField
                                    control={control}
                                    name="maximumAllowedBacklogs"
                                    label="Maximum Allowed Backlogs"
                                    type="number"
                                    inputProps={{
                                        min: 0,
                                        step: 1,
                                    }}
                                />
                            </Grid>
                        )}

                        <Grid item xs={12} md={6}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={watch("firstAttemptRequired")}
                                        onChange={(e) => setValue("firstAttemptRequired", e.target.checked)}
                                    />
                                }
                                label="First Attempt Required"
                            />
                        </Grid>
                    </Grid>

                    {/* --- Placement Rules --- */}
                    <Typography variant="h6">Placement Rules</Typography>
                    <Divider />

                    <Grid container spacing={2}>

                        {/* Allow Already Placed Students */}
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={allowPlaced}
                                        onChange={(e) => {
                                            const allowed =
                                                e.target.checked;

                                            setValue(
                                                "allowAlreadyPlacedStudents",
                                                allowed
                                            );

                                            if (!allowed) {
                                                setValue(
                                                    "maximumPreviousPackage",
                                                    null
                                                );

                                                setValue(
                                                    "includedCompanyIds",
                                                    []
                                                );

                                                setValue(
                                                    "excludedCompanyIds",
                                                    []
                                                );
                                            }
                                        }}
                                    />
                                }
                                label="Allow Already Placed Students"
                            />
                        </Grid>

                        {/* Previous Placement Rules */}
                        {allowPlaced && (
                            <>
                                {/* Maximum Previous Package */}
                                <Grid item xs={12} md={6}>
                                    <AppFormField
                                        control={control}
                                        name="maximumPreviousPackage"
                                        label="Maximum Previous Package (LPA)"
                                        type="number"
                                    />
                                </Grid>

                                {/* Year */}
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Previous Drive Year"
                                        type="number"
                                        value={previousDriveYear}
                                        onChange={(e) =>
                                            setPreviousDriveYear(
                                                Number(e.target.value)
                                            )
                                        }
                                        inputProps={{
                                            min: 2000,
                                            max: new Date().getFullYear()
                                        }}
                                    />
                                </Grid>

                                {/* Inclusion */}
                                <Grid item xs={12} md={6}>

                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            fontWeight: 700,
                                            mb: 1
                                        }}
                                    >
                                        Included Previous Companies
                                    </Typography>

                                    <Box
                                        sx={{
                                            border: "1px solid",
                                            borderColor: "divider",
                                            borderRadius: 2,
                                            maxHeight: 300,
                                            overflowY: "auto",
                                            p: 1
                                        }}
                                    >
                                        {previousCompanies.map(
                                            (company) => (
                                                <Box
                                                    key={company.id}
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        borderBottom:
                                                            "1px solid",
                                                        borderColor:
                                                            "divider",
                                                        py: 1
                                                    }}
                                                >
                                                    <Checkbox
                                                        checked={includedCompanyIds.includes(
                                                            company.id
                                                        )}
                                                        onChange={() =>
                                                            handleInclusionChange(
                                                                company.id
                                                            )
                                                        }
                                                    />

                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "space-between",
                                                            width: "100%",
                                                            pr: 1
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                fontWeight: 600
                                                            }}
                                                        >
                                                            {company.companyName}
                                                        </Typography>

                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            sx={{
                                                                whiteSpace: "nowrap",
                                                                ml: 2
                                                            }}
                                                        >
                                                            {new Date(company.driveDate).toLocaleDateString()}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            )
                                        )}
                                    </Box>
                                </Grid>

                                {/* Exclusion */}
                                <Grid item xs={12} md={6}>

                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            fontWeight: 700,
                                            mb: 1
                                        }}
                                    >
                                        Excluded Previous Companies
                                    </Typography>

                                    <Box
                                        sx={{
                                            border: "1px solid",
                                            borderColor: "divider",
                                            borderRadius: 2,
                                            maxHeight: 300,
                                            overflowY: "auto",
                                            p: 1
                                        }}
                                    >
                                        {previousCompanies.map(
                                            (company) => (
                                                <Box
                                                    key={company.id}
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        borderBottom:
                                                            "1px solid",
                                                        borderColor:
                                                            "divider",
                                                        py: 1
                                                    }}
                                                >
                                                    <Checkbox
                                                        checked={excludedCompanyIds.includes(
                                                            company.id
                                                        )}
                                                        onChange={() =>
                                                            handleExclusionChange(
                                                                company.id
                                                            )
                                                        }
                                                    />

                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "space-between",
                                                            width: "100%",
                                                            pr: 1
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                fontWeight: 600
                                                            }}
                                                        >
                                                            {company.companyName}
                                                        </Typography>

                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            sx={{
                                                                whiteSpace: "nowrap",
                                                                ml: 2
                                                            }}
                                                        >
                                                            {new Date(company.driveDate).toLocaleDateString()}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            )
                                        )}
                                    </Box>
                                </Grid>
                            </>
                        )}

                    </Grid>

                    {/* --- Schedule --- */}
                    <Typography variant="h6">Schedule</Typography>
                    <Divider />
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <AppFormField
                                control={control}
                                name="driveDate"
                                label="Drive Date"
                                type="datetime-local"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <AppFormField
                                control={control}
                                name="applyDeadline"
                                label="Apply Deadline"
                                type="datetime-local"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                    </Grid>

                    {/* --- Detailed Information --- */}
                    <Typography variant="h6" sx={{ mt: 2 }}>Detailed Information</Typography>
                    <Divider />
                    <Grid container spacing={3} sx={{ mt: 0 }}>
                        <Grid item xs={12}>
                            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                                <Typography variant="subtitle2" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
                                    Job Description
                                </Typography>
                                <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                                    Provide complete details about the role, responsibilities, and expectations.
                                </Typography>
                                <AppFormField
                                    control={control}
                                    name="jobDescription"
                                    label="Enter full job description here..."
                                    multiline
                                    minRows={6}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                                <Typography variant="subtitle2" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
                                    Preparation Resources
                                </Typography>
                                <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                                    Add helpful links for students to prepare (enter one URL per line).
                                </Typography>
                                <AppFormField
                                    control={control}
                                    name="preparationResources"
                                    label="https://leetcode.com/... (One URL per line)"
                                    placeholder="https://www.geeksforgeeks.org/&#10;https://takeuforward.org/&#10;https://leetcode.com/problemset/"
                                    multiline
                                    minRows={5}
                                />
                            </Box>
                        </Grid>
                    </Grid>

                </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 3, borderTop: "1px solid #eee" }}>
                <Button onClick={onClose} disabled={isSubmitting} sx={{ fontWeight: 600 }}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    sx={{ fontWeight: 700 }}
                >
                    {isSubmitting ? "Saving..." : mode === "update" ? "Update Company" : "Create Company"}
                </Button>
            </DialogActions>

            <AppSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={() => setSnackbarOpen(false)}
            />
        </Dialog>
    );
};

export default CreateCompanyDialog;