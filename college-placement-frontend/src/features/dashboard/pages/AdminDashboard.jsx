import { Box, Grid, Typography } from "@mui/material";
import { useAuthContext } from "../../../hooks/useAuthContext";

const AdminDashboard = () => {
  const { user } = useAuthContext();

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Admin Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Welcome back, {user?.name || user?.username}! 👋
      </Typography>
    </Box>
  );
};

export default AdminDashboard;
