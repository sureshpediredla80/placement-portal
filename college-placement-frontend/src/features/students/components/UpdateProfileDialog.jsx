import { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Stack,
} from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { updateProfile } from "../api/studentApi";
import AppFormField from "../../../components/common/AppFormField";

const schema = yup.object({
    cgpa: yup
        .number()
        .typeError("CGPA must be a number")
        .min(0, "CGPA cannot be less than 0")
        .max(10, "CGPA cannot be greater than 10")
        .required("CGPA is required"),

    phone: yup
        .string()
        .required("Phone number is required"),

    githubLink: yup
        .string()
        .nullable()
        .transform((value) => (value === "" ? null : value))
        .url("Invalid GitHub URL"),

    linkedinLink: yup
        .string()
        .nullable()
        .transform((value) => (value === "" ? null : value))
        .url("Invalid LinkedIn URL"),

    resumeUrl: yup
        .string()
        .nullable()
        .transform((value) => (value === "" ? null : value))
        .url("Invalid Resume URL"),
});

const UpdateProfileDialog = ({
                                 open,
                                 onClose,
                                 student,
                                 onSuccess,
                                 showSnackbar,
                             }) => {
    const [isUpdating, setIsUpdating] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            cgpa: "",
            phone: "",
            githubLink: "",
            linkedinLink: "",
            resumeUrl: "",
        },
    });

    useEffect(() => {
        if (student) {
            reset({
                cgpa: student.cgpa || "",
                phone: student.phone || "",
                githubLink: student.githubLink || "",
                linkedinLink: student.linkedinLink || "",
                resumeUrl: student.resumeUrl || "",
            });
        }
    }, [student, reset]);

    const onSubmit = async (data) => {
        try {
            setIsUpdating(true);

            await updateProfile(data);

            if (onSuccess) {
                await onSuccess();
            }

            showSnackbar(
                "Profile updated successfully.",
                "success"
            );

            onClose();
        }catch (error) {
            console.error("Profile update failed:", error);

            showSnackbar(
                error.response?.data?.message ||
                error.message ||
                "Failed to update profile.",
                "error"
            );
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                Update Profile
            </DialogTitle>

            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <AppFormField
                        control={control}
                        name="cgpa"
                        label="CGPA"
                    />

                    <AppFormField
                        control={control}
                        name="phone"
                        label="Phone Number"
                    />

                    <AppFormField
                        control={control}
                        name="githubLink"
                        label="GitHub Link"
                    />

                    <AppFormField
                        control={control}
                        name="linkedinLink"
                        label="LinkedIn Link"
                    />

                    <AppFormField
                        control={control}
                        name="resumeUrl"
                        label="Resume URL"
                    />
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSubmit(onSubmit)}
                    disabled={isUpdating}
                >
                    {isUpdating ? "Updating..." : "Update"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateProfileDialog;