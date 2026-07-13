import axiosInstance from "../../../services/axiosInstance";

export const login = async (data) => {
    const response = await axiosInstance.post("/auth/login", data);
    return response.data;
};

export const forgotPassword = async (data) => {
    const response = await axiosInstance.post(
        "/auth/forgot-password",
        data
    );
    return response.data;
};

export const resetPassword = async (data) => {
    const response = await axiosInstance.post(
        "/auth/reset-password",
        data
    );
    return response.data;
};

export const refreshToken = async (refreshToken) => {
    const response = await axiosInstance.post(
        "/auth/refresh",
        { refreshToken }
    );
    return response.data;
};