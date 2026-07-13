import axiosInstance from "../../../services/axiosInstance";

export const getBranches = async () => {
    const response = await axiosInstance.get("/api/branches");
    return response.data;
};