import axiosInstance from "../../../services/axiosInstance";
export const applyToCompany = async (companyId) => {
    const response = await axiosInstance.post(
        "/api/applications",
        {
            companyId,
        }
    );

    return response.data;
};


export const getMyApplications = async (
    page = 0,
    size = 12
) => {
    const response = await axiosInstance.get("/api/applications/my", {
        params: {
            page,
            size,
            sort: "applicationDate,DESC",
        },
    });

    return response.data;
};