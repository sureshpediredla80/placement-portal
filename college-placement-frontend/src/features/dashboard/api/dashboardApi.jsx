import axiosInstance from "../../../services/axiosInstance";

export const getCoordinatorDashboard = async () => {
    const response = await axiosInstance.get(
        "/api/coordinator/dashboard"
    );

    return response.data;
};