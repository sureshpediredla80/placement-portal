import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuthContext } from "../../../hooks/useAuthContext";
import * as yup from "yup";
import {
  Box,
  Typography,
  Button,
  Alert,
  Link,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff, LockOutlined } from "@mui/icons-material";
import AppFormField from "../../../components/common/AppFormField";
//import { useAuthContext } from "../../../providers/AuthProvider";
import axiosInstance from "../../../services/axiosInstance";
import { ROUTES } from "../../../constants/routes";

const schema = yup.object({
  email: yup.string().required("email is required"),
  password: yup.string().required("Password is required"),
});

const LoginPage = () => {
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: "", password: "" },
  });





  const onSubmit = async (data) => {
    setError("");
    setIsLoading(true);
    try {
      const res = await axiosInstance.post("/api/auth/login", data);
      login(
          res.data.accessToken,
          res.data.refreshToken,
          res.data.user
      );

      // Redirect based on role
      const role = res.data.user?.role;
      if (role === "ROLE_ADMIN") navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
      else if (role === "ROLE_COORDINATOR") navigate(ROUTES.COORDINATOR_DASHBOARD, { replace: true });
      else navigate(ROUTES.STUDENT_DASHBOARD, { replace: true });
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Box>
      {/* Logo / Title */}
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <LockOutlined sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
        <Typography variant="h5" fontWeight={700}>
          College Placement
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Sign in to your account
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <AppFormField
          control={control}
          name="email"
          label="email"
          required
        />

        <AppFormField
          control={control}
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setShowPassword((v) => !v)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ textAlign: "right" }}>
          <Link
            href={ROUTES.FORGOT_PASSWORD}
            variant="body2"
            underline="hover"
          >
            Forgot password?
          </Link>
        </Box>

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : null}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </Box>
    </Box>
  );
};

export default LoginPage;
