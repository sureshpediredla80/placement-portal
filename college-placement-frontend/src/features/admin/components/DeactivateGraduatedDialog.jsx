import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from "@mui/material";

const DeactivateGraduatedDialog = ({
                                       open,
                                       onClose,
                                       onConfirm,
                                   }) => {

    return (

        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
        >

            <DialogTitle>
                Deactivate Graduated Students
            </DialogTitle>

            <DialogContent>

                <DialogContentText>

                    This will deactivate all graduated students.

                    <br /><br />

                    They will no longer be able to log in.

                    <br /><br />

                    You can activate them individually later if needed.

                </DialogContentText>

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={onClose}
                >
                    Cancel
                </Button>

                <Button
                    color="error"
                    variant="contained"
                    onClick={onConfirm}
                >
                    Deactivate
                </Button>

            </DialogActions>

        </Dialog>

    );

};

export default DeactivateGraduatedDialog;