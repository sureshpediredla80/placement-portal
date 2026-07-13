import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Stack,
    Divider,
    Button,
} from "@mui/material";
const SessionDetailsDialog = ({
                                  open,
                                  onClose,
                                  session,
                              }) => {

    if (!session)
        return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>
                Session Details
            </DialogTitle>

            <DialogContent>

                <Stack spacing={2}>

                    <Typography
                        variant="h5"
                        fontWeight={700}
                    >
                        {session.title}
                    </Typography>

                    <Typography>
                        {
                            session.description
                        }
                    </Typography>

                    <Divider />

                    <Typography
                        variant="h6"
                    >
                        Speaker Information
                    </Typography>

                    <Typography>
                        Name :
                        {" "}
                        {
                            session.speakerName
                        }
                    </Typography>

                    <Typography>
                        Organization :
                        {" "}
                        {
                            session.speakerOrganization
                        }
                    </Typography>

                    <Typography>
                        Designation :
                        {" "}
                        {
                            session.speakerDesignation
                        }
                    </Typography>

                    <Divider />

                    <Typography
                        variant="h6"
                    >
                        Session Information
                    </Typography>

                    <Typography>
                        Date :
                        {" "}
                        {new Date(
                            session.sessionDate
                        ).toLocaleString()}
                    </Typography>

                    <Typography>
                        Live Link :
                        {" "}
                        <a
                            href={
                                session.liveLink
                            }
                            target="_blank"
                            rel="noreferrer"
                        >
                            Join Session
                        </a>
                    </Typography>

                    <Typography>
                        Recording Link :
                        {" "}
                        <a
                      href=  {
                            session.recordingLink
                        }
                            target="_blank"
                            rel="noreferrer"
                          >
                            view this
                        </a>
                    </Typography>

                    <Divider />

                    <Typography
                        variant="h6"
                    >
                        Created By
                    </Typography>

                    <Typography>
                        Name :
                        {" "}
                        {
                            session
                                .createdBy
                                .fullName
                        }
                    </Typography>

                    <Typography>
                        Email :
                        {" "}
                        {
                            session
                                .createdBy
                                .email
                        }
                    </Typography>

                </Stack>

            </DialogContent>
        </Dialog>
    );
};

export default SessionDetailsDialog;