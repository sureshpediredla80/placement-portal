import axiosInstance from "../../../services/axiosInstance";

export const updateProfile = async (data) => {
    const response = await axiosInstance.put(
        "/api/students/me",
        data
    );

    return response.data;
};