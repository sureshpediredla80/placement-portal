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

export const getPlacedStudentsShowcase = async (year = null, page = 0, size = 50) => {
    const params = { page, size };
    if (year && year !== "ALL") {
        params.year = year;
    }
    const response = await axiosInstance.get("/api/applications/placed-students", { params });
    return response.data;
};

export const getAvailablePlacementYears = async () => {
    const response = await axiosInstance.get("/api/applications/placed-students/years");
    return response.data;
};