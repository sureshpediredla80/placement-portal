import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { loginUser } from "../../../services/authService";
import { useEffect } from "react";
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
    Checkbox,
    FormControlLabel,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { motion } from "framer-motion";
import { Visibility, VisibilityOff, LockOutlined } from "@mui/icons-material";
import AppFormField from "../../../components/common/AppFormField";
//import { useAuthContext } from "../../../providers/AuthProvider";
import axiosInstance from "../../../services/axiosInstance";
import { ROUTES } from "../../../constants/routes";

const schema = yup.object({
    email: yup
        .string()
        .email("Enter a valid email")
        .required("Email is required"),

    password: yup
        .string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
});

const LoginPage = () => {
    const { login } = useAuthContext();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open:false,
        message:"",
        severity:"success"
    });
    const [rememberMe,setRememberMe]=useState(false);
    const {
        control,
        handleSubmit,
        formState: { isValid }
    } = useForm({
        resolver: yupResolver(schema),
        mode: "onChange",
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const onSubmit = async (data) => {
        setIsLoading(true);

        try {
            const res = await loginUser(data);

            login(
                res.accessToken,
                res.refreshToken,
                res.user
            );

            const role = res.user?.role;

            if (role === "ROLE_ADMIN") {
                navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
            } else if (role === "ROLE_COORDINATOR") {
                navigate(ROUTES.COORDINATOR_DASHBOARD, { replace: true });
            } else {
                navigate(ROUTES.STUDENT_DASHBOARD, { replace: true });
            }

        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Invalid email or password"
            );
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 30,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                duration: 0.5,
            }}
        >
            <Box>

                {/* Logo / Title */}
                <Box
                    sx={{
                        textAlign: "center",
                        mb: 5,
                    }}
                >
                    <Typography
                        variant="h4"
                        fontWeight={700}
                        sx={{
                            mb: 1,
                        }}
                    >
                        Welcome Back 👋
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                            lineHeight: 1.7,
                        }}
                    >
                        Sign in to continue your placement journey.
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
                >

                    {/* Email */}
                    <Box sx={{ mb: "20px" }}>
                        <AppFormField
                            control={control}
                            name="email"
                            label="Email"
                            required
                        />
                    </Box>

                    {/* Password */}
                    <Box sx={{ mb: "18px" }}>
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
                                            edge="end"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            sx={{
                                                transition: "0.3s",
                                                "&:hover": {
                                                    transform: "scale(1.1)",
                                                },
                                            }}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    {/* Remember Me */}
                    <Box
                        sx={{
                            mb: "28px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                            }
                            label="Remember Me"
                        />

                        <Link
                            href={ROUTES.FORGOT_PASSWORD}
                            variant="body2"
                            underline="hover"
                        >
                            Forgot password?
                        </Link>
                    </Box>

                    {/* Sign In Button */}
                    <LoadingButton
                        loading={isLoading}
                        loadingPosition="start"
                        variant="contained"
                        size="large"
                        fullWidth
                        type="submit"
                        disabled={!isValid}
                        sx={{
                            height: 54,
                            fontWeight: 600,
                            fontSize: "16px",
                            borderRadius: "12px",
                            textTransform: "none",
                            transition: "0.3s",
                            "&:hover": {
                                transform: "translateY(-2px)",
                            },
                        }}
                    >
                        → Sign In
                    </LoadingButton>

                </Box>
            </Box>
        </motion.div>
    );
};
export default LoginPage;