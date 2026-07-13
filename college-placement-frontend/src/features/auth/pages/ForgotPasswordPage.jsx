import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Typography,
  Button,
  Alert,
  Link,
  CircularProgress,
} from "@mui/material";
import { EmailOutlined } from "@mui/icons-material";
import AppFormField from "../../../components/common/AppFormField";
import axiosInstance from "../../../services/axiosInstance";
import { ROUTES } from "../../../constants/routes";

const schema = yup.object({
  email: yup.string().email("Enter a valid email").required("Email is required"),
});

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: "" },
  });
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    setError("");
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
          "/api/auth/forgot-password",
          data
      );

      if (response.data.success) {
        navigate(ROUTES.RESET_PASSWORD);
      }
    } catch (err) {
      setError(err.message || "Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <EmailOutlined sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
        <Typography variant="h5" fontWeight={700}>
          Forgot Password
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Enter your email to receive a reset link
        </Typography>
      </Box>

      { (
        <>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <AppFormField
              control={control}
              name="email"
              label="Email Address"
              type="email"
              required
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : null}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </Box>
        </>
      )}

      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Link component={RouterLink} to={ROUTES.LOGIN} variant="body2" underline="hover">
          ← Back to Login
        </Link>
      </Box>
    </Box>
  );
};

export default ForgotPasswordPage;
