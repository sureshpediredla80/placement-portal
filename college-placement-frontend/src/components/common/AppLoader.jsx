import { Box, CircularProgress, Typography } from "@mui/material";

/**
 * AppLoader — full-screen centered loading spinner.
 * @param {string} message - optional loading message
 */
const AppLoader = ({ message = "Loading..." }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: 2,
      }}
    >
      <CircularProgress size={48} thickness={4} />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

export default AppLoader;
