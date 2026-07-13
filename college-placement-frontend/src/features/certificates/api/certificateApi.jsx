import axiosInstance from "../../../services/axiosInstance";

export const createCertificate = async (payload) => {
    const response = await axiosInstance.post(
        "/api/certificates",
        payload
    );

    return response.data;
};
export const getMyCertificates = async (
    page = 0,
    size = 9
) => {

    const response = await axiosInstance.get(
        "/api/certificates/my",
        {
            params: {
                page,
                size,
                sort: "id,DESC",
            },
        }
    );

    return response.data;
};
export const deleteCertificate = async (
    certificateId
) => {
    await axiosInstance.delete(
        `/api/certificates/${certificateId}`
    );
};
