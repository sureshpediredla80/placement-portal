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

const transformNumber = (value, originalValue) =>
    originalValue === "" || originalValue === null || originalValue === undefined
        ? null
        : (isNaN(value) ? null : Number(value));

const schema = yup.object({

    sscPercentage: yup
        .number()
        .typeError("SSC Percentage must be a valid number")
        .min(0, "SSC Percentage must be at least 0")
        .max(100, "SSC Percentage cannot exceed 100")
        .required("SSC Percentage is required"),

    intermediatePercentage: yup
        .number()
        .nullable()
        .transform(transformNumber)
        .min(0, "Intermediate Percentage must be at least 0")
        .max(100, "Intermediate Percentage cannot exceed 100"),

    diplomaPercentage: yup
        .number()
        .nullable()
        .transform(transformNumber)
        .min(0, "Diploma Percentage must be at least 0")
        .max(100, "Diploma Percentage cannot exceed 100"),

    cgpa: yup
        .number()
        .typeError("CGPA must be a valid number")
        .min(0, "CGPA must be at least 0")
        .max(10, "CGPA cannot exceed 10")
        .required("CGPA is required"),

    backlogs: yup
        .number()
        .typeError("Backlogs must be a valid number")
        .min(0, "Backlogs cannot be negative")
        .required("Backlogs are required"),

    admissionType: yup
        .string()
        .required("Admission Type is required"),

    entranceExam: yup
        .string()
        .required("Entrance Exam is required"),

    entranceRank: yup
        .number()
        .typeError("Entrance Rank must be a valid number")
        .min(0, "Entrance Rank cannot be negative")
        .required("Entrance Rank is required"),

    placementStatus: yup
        .string()
        .required("Placement Status is required"),

    graduated: yup
        .boolean()
        .required()

}).test(
    "inter-or-diploma",
    "Either Intermediate Percentage or Diploma Percentage is required",
    function (values) {
        const inter = values?.intermediatePercentage;
        const diploma = values?.diplomaPercentage;
        const hasInter = inter !== null && inter !== undefined && inter !== "" && !isNaN(inter);
        const hasDiploma = diploma !== null && diploma !== undefined && diploma !== "" && !isNaN(diploma);
        return hasInter || hasDiploma;
    }
);

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

            intermediatePercentage: null,

            diplomaPercentage: null,

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

                intermediatePercentage: student.intermediatePercentage ?? null,

                diplomaPercentage: student.diplomaPercentage ?? null,

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
                                name="diplomaPercentage"
                                label="Diploma Percentage (%)"
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