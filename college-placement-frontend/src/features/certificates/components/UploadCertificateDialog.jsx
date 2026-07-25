import { useState } from "react";
import { useForm } from "react-hook-form";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Stack,
    Typography,

} from "@mui/material";

import AppFormField from "../../../components/common/AppFormField";
import { createCertificate } from "../api/certificateApi";

const UploadCertificateDialog = ({
                                     open,
                                     onClose,
                                     onSuccess,
                                     showSnackbar,
                                 }) => {
    const {
        control,
        handleSubmit,
        reset,
    } = useForm({
        defaultValues: {
            certificateName: "",
            certificateType: "",
            provider: "",
            issueDate: "",
            certificateUrl: "",
            skillNames: "",
        },
    });
    const today = new Date().toISOString().split("T")[0];
    const onSubmit = async (data) => {
        try {
            await createCertificate({
                certificateName: data.certificateName,
                certificateType: data.certificateType,
                provider: data.provider,
                issueDate: data.issueDate,
                certificateUrl: data.certificateUrl,
                skillNames: data.skillNames
                    .split(",")
                    .map((skill) => skill.trim()),
            });

            reset();

            if (onSuccess) {
                await onSuccess();
            }

            showSnackbar(
                "Certificate uploaded successfully.",
                "success"
            );
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Upload Certificate
                </DialogTitle>

                <DialogContent>
                    <Stack
                        spacing={2}
                        sx={{ mt: 1 }}
                    >
                        <AppFormField
                            control={control}
                            name="certificateName"
                            label="Certificate Name"
                        />

                        <AppFormField
                            control={control}
                            name="certificateType"
                            label="Certificate Type"
                        />

                        <AppFormField
                            control={control}
                            name="provider"
                            label="Provider"
                        />

                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: 500,
                                color: "text.secondary",
                                mb: -1,
                            }}
                        >
                            Issue Date
                        </Typography>

                        <AppFormField
                            control={control}
                            name="issueDate"
                            type="date"
                            rules={{
                                required: "Issue Date is required",
                                validate: (value) =>
                                    value <= today ||
                                    "Issue Date cannot be in the future",
                            }}
                            inputProps={{
                                max: today,
                            }}
                        />

                        <AppFormField
                            control={control}
                            name="certificateUrl"
                            label="Certificate URL"
                        />

                        <AppFormField
                            control={control}
                            name="skillNames"
                            label="Skills (comma separated)"
                        />
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose}>
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleSubmit(
                            onSubmit
                        )}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>


        </>
    );
};

export default UploadCertificateDialog;