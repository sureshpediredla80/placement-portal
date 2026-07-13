import axiosInstance from "../../../services/axiosInstance";

export const generateResume = async (payload) => {

    const response = await axiosInstance.post(
        "/api/ai/generate",
        payload
    );

    return response.data;

};