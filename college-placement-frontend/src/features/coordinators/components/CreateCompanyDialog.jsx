import { useState, useEffect } from "react";

import {

    createCompany,updateCompany,
} from "../api/coordinatorApi";
import AppSnackbar
    from "../../../components/common/AppSnackbar";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    ListItemText,
    Switch,
    FormControlLabel, Typography,
} from "@mui/material";

import {
    getBranches,
} from "../api/coordinatorApi";

const CreateCompanyDialog = ({
                                 open,
                                 onClose,
                                 onSuccess,
                                company,
                                mode="create"
                             }) => {
    const [companyName, setCompanyName] =
        useState("");

    const [roleOffered, setRoleOffered] =
        useState("");

    const [
        packageOffered,
        setPackageOffered,
    ] = useState("");

    const [minimumCgpa, setMinimumCgpa] =
        useState("");

    const [driveDate, setDriveDate] =
        useState("");

    const [
        applyDeadline,
        setApplyDeadline,
    ] = useState("");

    const [
        jobDescription,
        setJobDescription,
    ] = useState("");

    const [
        backlogsAllowed,
        setBacklogsAllowed,
    ] = useState(false);

    const [
        allowedBranchIds,
        setAllowedBranchIds,
    ] = useState([]);

    const [
        allowedYears,
        setAllowedYears,
    ] = useState([]);

    const [
        preparationResources,
        setPreparationResources,
    ] = useState("");

    const [branches, setBranches] =
        useState([]);
    const [snackbarOpen, setSnackbarOpen] =
        useState(false);

    const [snackbarMessage, setSnackbarMessage] =
        useState("");
    const [snackbarSeverity, setSnackbarSeverity] =
        useState("success");
    const fetchBranches = async () => {
        try {
            const response =
                await getBranches();

            setBranches(response);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (open) {
            fetchBranches();
        }
    }, [open]);
    useEffect(() => {

        if (
            mode === "update" &&
            company
        ) {

            setCompanyName(
                company.companyName || ""
            );

            setRoleOffered(
                company.roleOffered || ""
            );

            setPackageOffered(
                company.packageOffered || ""
            );

            setMinimumCgpa(
                company.minimumCgpa || ""
            );

            setBacklogsAllowed(
                company.backlogsAllowed || false
            );

            setJobDescription(
                company.jobDescription || ""
            );

            setAllowedYears(
                company.allowedYears || []
            );

            setAllowedBranchIds(
                company.allowedBranches?.map(
                    (branch) => branch.id
                ) || []
            );

            setPreparationResources(
                company.preparationResources?.join(", ") || ""
            );

            setDriveDate(
                company.driveDate || ""
            );

            setApplyDeadline(
                company.applyDeadline || ""
            );
        }

    }, [company, mode]);
    const handleCreateCompany =
        async () => {

            try {

                const payload = {

                    companyName,

                    roleOffered,

                    packageOffered:
                        Number(packageOffered),

                    minimumCgpa:
                        Number(minimumCgpa),

                    backlogsAllowed,

                    driveDate,

                    applyDeadline,

                    jobDescription,

                    preparationResources:
                        preparationResources
                            .split(",")
                            .map((item) =>
                                item.trim()
                            ),

                    allowedBranchIds,

                    allowedYears,
                };

                let response;

                if (mode === "update") {

                    response =
                        await updateCompany(
                            company.id,
                            payload
                        );

                } else {

                    response =
                        await createCompany(
                            payload
                        );
                }

                setSnackbarMessage(
                    `${response.companyName} ${
                        mode === "update"
                            ? "updated"
                            : "created"
                    } successfully`
                );

                setSnackbarSeverity(
                    "success"
                );

                setSnackbarOpen(true);

                onSuccess?.();

                setTimeout(() => {
                    onClose();
                }, 1000);

            } catch (error) {

                console.error(error);

                setSnackbarSeverity(
                    "error"
                );

                setSnackbarMessage(
                    mode === "update"
                        ? "Failed to update company"
                        : "Failed to create company"
                );

                setSnackbarOpen(true);
            }
        };


    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>
                {
                    mode === "update"
                        ? "Update Company"
                        : "Create Company"
                }
            </DialogTitle>

            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Company Name"
                            value={companyName}
                            onChange={(e) =>
                                setCompanyName(
                                    e.target.value
                                )
                            }
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Role Offered"
                            value={roleOffered}
                            onChange={(e) =>
                                setRoleOffered(
                                    e.target.value
                                )
                            }
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Package Offered"
                            value={packageOffered}
                            onChange={(e) =>
                                setPackageOffered(
                                    e.target.value
                                )
                            }
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} md={4} >
                        <TextField
                            fullWidth
                            type="number"
                            label="Minimum CGPA"
                            value={minimumCgpa}
                            onChange={(e) =>
                                setMinimumCgpa(
                                    e.target.value
                                )
                            }
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel>
                                Allowed Branches
                            </InputLabel>

                            <Select
                                multiple
                                value={
                                    allowedBranchIds
                                }
                                label="Allowed Branches"
                                onChange={(e) =>
                                    setAllowedBranchIds(
                                        e.target.value
                                    )
                                }
                                renderValue={(selected) =>
                                    branches
                                        .filter(
                                            (b) =>
                                                selected.includes(
                                                    b.id
                                                )
                                        )
                                        .map(
                                            (b) =>
                                                b.name
                                        )
                                        .join(", ")
                                }
                            >
                                {branches.map(
                                    (branch) => (
                                        <MenuItem
                                            key={
                                                branch.id
                                            }
                                            value={
                                                branch.id
                                            }
                                        >
                                            <Checkbox
                                                checked={allowedBranchIds.includes(
                                                    branch.id
                                                )}
                                            />

                                            <ListItemText
                                                primary={
                                                    branch.name
                                                }
                                            />
                                        </MenuItem>
                                    )
                                )}
                            </Select>
                        </FormControl>
                    </Grid>
                    </Grid>

                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 500,
                            mb: 1,
                        }}
                    >
                        Drive Date
                    </Typography>

                        <TextField
                            fullWidth
                            type="datetime-local"
                            value={driveDate}
                            onChange={(e) =>
                                setDriveDate(e.target.value)
                            }
                        />


                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 500,
                            mb: 1,
                        }}
                    >
                        Apply Deadline
                    </Typography>

                    <TextField
                        fullWidth
                        type="datetime-local"
                        value={applyDeadline}
                        onChange={(e) =>
                            setApplyDeadline(e.target.value)
                        }
                    />
                    </Grid>
                <Grid container spacing={12} sx={{ mt: 1} }>
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                        <InputLabel>
                            Allowed Years
                        </InputLabel>

                        <Select
                            multiple
                            value={allowedYears}
                            label="Allowed Years"
                            onChange={(e) =>
                                setAllowedYears(
                                    e.target.value
                                )
                            }
                        >
                            {[1, 2, 3, 4].map(
                                (year) => (
                                    <MenuItem
                                        key={year}
                                        value={year}
                                    >
                                        <Checkbox
                                            checked={allowedYears.includes(
                                                year
                                            )}
                                        />
                                        <ListItemText
                                            primary={`Year ${year}`}
                                        />
                                    </MenuItem>
                                )
                            )}
                        </Select>
                    </FormControl>
                </Grid>

                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={
                                        backlogsAllowed
                                    }
                                    onChange={(e) =>
                                        setBacklogsAllowed(
                                            e.target
                                                .checked
                                        )
                                    }
                                />
                            }
                            label="Backlogs Allowed"
                        />
                    </Grid>
                    </Grid>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Job Description"
                            value={jobDescription}
                            onChange={(e) =>
                                setJobDescription(
                                    e.target.value
                                )
                            }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Preparation Resources"
                            helperText="Separate using commas"
                            value={
                                preparationResources
                            }
                            onChange={(e) =>
                                setPreparationResources(
                                    e.target.value
                                )
                            }
                        />
                    </Grid>


                    </Grid>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={
                        handleCreateCompany
                    }
                >
                    <DialogTitle>
                        {
                            mode === "update"
                                ? "Update Company"
                                : "Create Company"
                        }
                    </DialogTitle>
                </Button>
            </DialogActions>

            <AppSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={() =>
                    setSnackbarOpen(false)
                }
            />
</Dialog>

);

};

export default CreateCompanyDialog;