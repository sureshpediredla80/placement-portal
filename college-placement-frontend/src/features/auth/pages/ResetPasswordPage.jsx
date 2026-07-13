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

import AppFormField from "../../../components/common/AppFormField";
import axiosInstance from "../../../services/axiosInstance";
import { ROUTES } from "../../../constants/routes";

const schema = yup.object({
    code: yup.string().required("OTP is required"),

    newPassword: yup
        .string()
        .required("Password is required")
        .min(6, "Minimum 6 characters"),

    confirmPassword: yup
        .string()
        .oneOf(
            [yup.ref("newPassword")],
            "Passwords must match"
        )
        .required("Confirm Password is required"),
});

const ResetPasswordPage = () => {
    const navigate = useNavigate();

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { control, handleSubmit } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            code: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data) => {
        setError("");
        setIsLoading(true);

        try {
            const response = await axiosInstance.post(
                "/api/auth/reset-password",
                {
                    code: data.code,
                    newPassword: data.newPassword,
                }
            );

            if (response.data.success) {
                navigate(ROUTES.LOGIN);
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Password reset failed"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box>
            <Box sx={{ textAlign: "center", mb: 3 }}>
                <Typography variant="h5" fontWeight={700}>
                    Reset Password
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Enter OTP and new password
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
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                <AppFormField
                    control={control}
                    name="code"
                    label="OTP"
                    required
                />

                <AppFormField
                    control={control}
                    name="newPassword"
                    label="New Password"
                    type="password"
                    required
                />

                <AppFormField
                    control={control}
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    required
                />

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={isLoading}
                    startIcon={
                        isLoading ? (
                            <CircularProgress
                                size={18}
                                color="inherit"
                            />
                        ) : null
                    }
                >
                    {isLoading
                        ? "Updating..."
                        : "Reset Password"}
                </Button>
            </Box>

            <Box sx={{ textAlign: "center", mt: 2 }}>
                <Link
                    component={RouterLink}
                    to={ROUTES.LOGIN}
                >
                    Back to Login
                </Link>
            </Box>
        </Box>
    );
};

export default ResetPasswordPage;