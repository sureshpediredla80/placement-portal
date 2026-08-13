import { useEffect, useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Stack,
    Divider,
    Typography,
    Grid,
    Select,
    MenuItem,
    FormControl,
} from "@mui/material";

import { useController } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import * as yup from "yup";

import AppFormField from "../../../components/common/AppFormField";

import {
    updateStudent,
} from "../api/coordinatorApi";

const schema = yup.object({

    sscPercentage: yup
        .number()
        .min(0)
        .max(100)
        .required("SSC Percentage is required"),

    intermediatePercentage: yup
        .number()
        .min(0)
        .max(100)
        .required("Intermediate Percentage is required"),

    diplomaCgpa: yup
        .number()
        .min(0)
        .max(10)
        .required("Diploma CGPA is required"),

    cgpa: yup
        .number()
        .min(0)
        .max(10)
        .required("CGPA is required"),

    backlogs: yup
        .number()
        .min(0)
        .required("Backlogs are required"),

    admissionType: yup
        .string()
        .required("Admission Type is required"),

    entranceExam: yup
        .string()
        .required("Entrance Exam is required"),

    entranceRank: yup
        .number()
        .min(0)
        .required("Entrance Rank is required"),

    placementStatus: yup
        .string()
        .required("Placement Status is required"),

    graduated: yup
        .boolean()
        .required()

});

const admissionOptions = [
    "CQ",
    "MQ"
];

const entranceOptions = [
    "EAPCET",
    "ECET"
];

const placementOptions = [
    "NOT_PREPARED",
    "PREPARING",
    "ELIGIBLE",
    "APPLIED",
    "SELECTED",
    "REJECTED"
];

const AppSelectField = ({
                            control,
                            name,
                            label,
                            options,
                        }) => {

    const {
        field,
        fieldState,
    } = useController({
        control,
        name,
    });

    return (

        <FormControl
            fullWidth
            error={!!fieldState.error}
        >

            <Select
                {...field}
                displayEmpty
                renderValue={(selected) => {

                    if (
                        selected === "" ||
                        selected === null ||
                        selected === undefined
                    ) {

                        return (
                            <span
                                style={{
                                    color: "#888",
                                }}
                            >
                                {label}
                            </span>
                        );

                    }

                    if (
                        typeof selected === "boolean"
                    ) {

                        return selected
                            ? "Yes"
                            : "No";

                    }

                    return selected.replaceAll(
                        "_",
                        " "
                    );

                }}
            >

                {options.map((option) => (

                    <MenuItem
                        key={option.toString()}
                        value={option}
                    >

                        {typeof option === "boolean"
                            ? option
                                ? "Yes"
                                : "No"
                            : option.replaceAll(
                                "_",
                                " "
                            )}

                    </MenuItem>

                ))}

            </Select>

            {fieldState.error && (

                <Typography
                    color="error"
                    variant="caption"
                    sx={{
                        ml: 2,
                        mt: 0.5,
                    }}
                >
                    {fieldState.error.message}
                </Typography>

            )}

        </FormControl>

    );

};

const UpdateStudentDialog = ({
                                 open,
                                 onClose,
                                 student,
                                 onSuccess,
                             }) => {

    const [
        isUpdating,
        setIsUpdating,
    ] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
    } = useForm({

        resolver: yupResolver(schema),

        defaultValues: {

            sscPercentage: 0,

            intermediatePercentage: 0,

            diplomaCgpa: 0,

            cgpa: 0,

            backlogs: 0,

            admissionType: "",

            entranceExam: "",

            entranceRank: 0,

            placementStatus: "",

            graduated: false,

        },

    });

    useEffect(() => {

        if (student) {

            reset({

                sscPercentage: student.sscPercentage,

                intermediatePercentage: student.intermediatePercentage,

                diplomaCgpa: student.diplomaCgpa,

                cgpa: student.cgpa,

                backlogs: student.backlogs,

                admissionType: student.admissionType,

                entranceExam: student.entranceExam,

                entranceRank: student.entranceRank,

                placementStatus: student.placementStatus,

                graduated: student.graduated,

            });

        }

    }, [student, reset]);

    const onSubmit = async (
        data
    ) => {

        try {

            setIsUpdating(true);

            await updateStudent(
                student.id,
                data
            );

            if (onSuccess) {
                await onSuccess();
            }

            onClose();

        } catch (error) {

            console.error(error);

        } finally {

            setIsUpdating(false);

        }

    };

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            PaperProps={{
                sx: {
                    borderRadius: 4,
                },
            }}
        >

            <DialogTitle
                sx={{
                    fontWeight: 700,
                    borderBottom:
                        "1px solid #eee",
                }}
            >
                Update Student
            </DialogTitle>

            <DialogContent>

                <Stack
                    spacing={3}
                    sx={{
                        mt: 2,
                    }}
                >

                    <Typography variant="h6">
                        Academic Information
                    </Typography>

                    <Divider />

                    <Grid
                        container
                        spacing={2}
                    >

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >
                            <AppFormField
                                control={control}
                                name="sscPercentage"
                                label="SSC Percentage"
                                type="number"
                            />
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >
                            <AppFormField
                                control={control}
                                name="intermediatePercentage"
                                label="Intermediate Percentage"
                                type="number"
                            />
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >
                            <AppFormField
                                control={control}
                                name="diplomaCgpa"
                                label="Diploma CGPA"
                                type="number"
                            />
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >
                            <AppFormField
                                control={control}
                                name="cgpa"
                                label="B.Tech CGPA"
                                type="number"
                            />
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >
                            <AppFormField
                                control={control}
                                name="backlogs"
                                label="Backlogs"
                                type="number"
                            />
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >
                            <AppSelectField
                                control={control}
                                name="admissionType"
                                label="Admission Type"
                                options={admissionOptions}
                            />
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >
                            <AppSelectField
                                control={control}
                                name="entranceExam"
                                label="Entrance Exam"
                                options={entranceOptions}
                            />
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >
                            <AppFormField
                                control={control}
                                name="entranceRank"
                                label="Entrance Rank"
                                type="number"
                            />
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >
                            <AppSelectField
                                control={control}
                                name="placementStatus"
                                label="Placement Status"
                                options={placementOptions}
                            />
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >
                            <AppSelectField
                                control={control}
                                name="graduated"
                                label="Graduated"
                                options={[true, false]}
                            />
                        </Grid>

                    </Grid>

                </Stack>

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={onClose}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSubmit(onSubmit)}
                    disabled={isUpdating}
                >
                    {
                        isUpdating
                            ? "Updating..."
                            : "Update Student"
                    }
                </Button>

            </DialogActions>

        </Dialog>

    );

};

export default UpdateStudentDialog;