import {
    Snackbar,
    Alert,
} from "@mui/material";

const AppSnackbar = ({
                         open,
                         message,
                         severity = "success",
                         onClose,
                     }) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={onClose}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
        >
            <Alert
                severity={severity}
                variant="filled"
                onClose={onClose}
                sx={{ width: "100%" }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default AppSnackbar;