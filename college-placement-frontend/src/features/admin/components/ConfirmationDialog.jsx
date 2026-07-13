import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from "@mui/material";

const ConfirmationDialog = ({
                                open,
                                title,
                                message,
                                confirmText = "Confirm",
                                cancelText = "Cancel",
                                loading = false,
                                onConfirm,
                                onClose,
                            }) => {

    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle>
                {title}
            </DialogTitle>

            <DialogContent>

                <DialogContentText>
                    {message}
                </DialogContentText>

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={onClose}
                    disabled={loading}
                >
                    {cancelText}
                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={onConfirm}
                    disabled={loading}
                >
                    {loading
                        ? "Please wait..."
                        : confirmText}
                </Button>

            </DialogActions>

        </Dialog>
    );
};

export default ConfirmationDialog;