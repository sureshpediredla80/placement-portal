import { Box, Typography } from "@mui/material";
import { InboxOutlined } from "@mui/icons-material";

/**
 * AppEmptyState — shown when a list or table has no data.
 *
 * @param {string}    message  - description text
 * @param {ReactNode} icon     - optional custom icon
 * @param {ReactNode} action   - optional action button
 */
const AppEmptyState = ({
  message = "No data available.",
  icon,
  action,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
        gap: 1.5,
        color: "text.secondary",
      }}
    >
      {icon ?? (
        <InboxOutlined sx={{ fontSize: 56, color: "grey.400" }} />
      )}
      <Typography variant="body1" color="text.secondary" textAlign="center">
        {message}
      </Typography>
      {action && <Box sx={{ mt: 1 }}>{action}</Box>}
    </Box>
  );
};

export default AppEmptyState;
