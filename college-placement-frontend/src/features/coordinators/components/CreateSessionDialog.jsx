import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Stack, Typography,
} from "@mui/material";
import { useState, useEffect } from "react";

const initialFormData = {
    title: "",
    description: "",
    speakerName: "",
    speakerOrganization: "",
    speakerDesignation: "",
    liveLink: "",
    recordingLink: "",
    sessionDate: "",
};

import { createSession } from "../api/coordinatorApi";

const CreateSessionDialog = ({
                                 open,
                                 onClose,
                                 onSuccess,
                                 onError,
                             }) => {

    const [formData, setFormData] =
        useState(initialFormData);
    useEffect(() => {
        if (open) {
            setFormData(initialFormData);
        }
    }, [open]);


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]:
            e.target.value,
        });
    };

    const handleCreateSession =
        async () => {
            try {
                const payload = {
                    ...formData,
                    sessionDate:
                        new Date(
                            formData.sessionDate
                        ).toISOString(),
                };

                await createSession(
                    payload
                );
                setFormData(initialFormData);
                onSuccess();

                onClose();
            } catch (error) {
                console.error(error);
                onError?.();
            }
        };
    const handleClose = () => {
        setFormData(initialFormData);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>
                Create Session
            </DialogTitle>

            <DialogContent>
                <Stack
                    spacing={2}
                    sx={{ mt: 1 }}
                >
                    <TextField
                        label="Title"
                        name="title"
                        value={
                            formData.title
                        }
                        onChange={
                            handleChange
                        }
                        fullWidth
                    />

                    <TextField
                        label="Description"
                        name="description"
                        value={
                            formData.description
                        }
                        onChange={
                            handleChange
                        }
                        multiline
                        rows={4}
                        fullWidth
                    />

                    <TextField
                        label="Speaker Name"
                        name="speakerName"
                        value={
                            formData.speakerName
                        }
                        onChange={
                            handleChange
                        }
                        fullWidth
                    />

                    <TextField
                        label="Organization"
                        name="speakerOrganization"
                        value={
                            formData.speakerOrganization
                        }
                        onChange={
                            handleChange
                        }
                        fullWidth
                    />

                    <TextField
                        label="Designation"
                        name="speakerDesignation"
                        value={
                            formData.speakerDesignation
                        }
                        onChange={
                            handleChange
                        }
                        fullWidth
                    />

                    <TextField
                        label="Live Link"
                        name="liveLink"
                        value={
                            formData.liveLink
                        }
                        onChange={
                            handleChange
                        }
                        fullWidth
                    />

                    <TextField
                        label="Recording Link"
                        name="recordingLink"
                        value={
                            formData.recordingLink
                        }
                        onChange={
                            handleChange
                        }
                        fullWidth
                    />

                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 500,
                            mb: 1,
                        }}
                    >
                        Session Date
                    </Typography>
                    <TextField
                        name="sessionDate"
                        type="datetime-local"
                        value={formData.sessionDate}
                        onChange={handleChange}
                        fullWidth
                    />
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={handleClose}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={
                        handleCreateSession
                    }
                >
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateSessionDialog;