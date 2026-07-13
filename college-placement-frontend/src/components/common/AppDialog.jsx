import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import { Close } from "@mui/icons-material";

/**
 * AppDialog — reusable modal dialog.
 *
 * @param {boolean}   open          - controls visibility
 * @param {string}    title         - dialog title
 * @param {ReactNode} children      - dialog body content
 * @param {Function}  onClose       - called when dialog is closed
 * @param {string}    confirmLabel  - confirm button label (default: "Confirm")
 * @param {string}    cancelLabel   - cancel button label (default: "Cancel")
 * @param {Function}  onConfirm     - called on confirm — if omitted, no confirm button shown
 * @param {boolean}   isLoading     - disables buttons when true
 * @param {string}    confirmColor  - MUI button color (default: "primary")
 * @param {string}    maxWidth      - dialog maxWidth (default: "sm")
 */
const AppDialog = ({
  open,
  title,
  children,
  onClose,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  isLoading = false,
  confirmColor = "primary",
  maxWidth = "sm",
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      {/* Title */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pr: 1,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>
        <IconButton onClick={onClose} size="small" disabled={isLoading}>
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Divider />

      {/* Body */}
      <DialogContent sx={{ pt: 2 }}>{children}</DialogContent>

      {/* Actions */}
      {(onConfirm || cancelLabel) && (
        <>
          <Divider />
          <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
            <Button
              onClick={onClose}
              disabled={isLoading}
              variant="outlined"
              color="inherit"
            >
              {cancelLabel}
            </Button>
            {onConfirm && (
              <Button
                onClick={onConfirm}
                disabled={isLoading}
                variant="contained"
                color={confirmColor}
                loading={isLoading}
              >
                {confirmLabel}
              </Button>
            )}
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default AppDialog;
