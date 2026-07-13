import axiosInstance from "../../../services/axiosInstance";

export const getActiveCompanies = async (page, size) => {
    const response = await axiosInstance.get(
        "/api/companies/active",
        {
            params: {
                page,
                size,
            },
        }
    );

    return response.data;
};

export const getEligibleCompanies = async (page, size) => {
    const response = await axiosInstance.get(
        "/api/students/me/eligible-companies",
        {
            params: {
                page,
                size,
            },
        }
    );

    return response.data;
};

export const getExpiredCompanies = async (page, size) => {
    const response = await axiosInstance.get(
        "/api/companies/expired",
        {
            params: {
                page,
                size,
            },
        }
    );

    return response.data;
};
export const getCompanyById = async (companyId) => {
    const response = await axiosInstance.get(
        `/api/companies/${companyId}`
    );

    return response.data;
};
export const searchCompanies = async (params, page, size) => {
    const response = await axiosInstance.get(
        "/api/companies/search",
        {
            params: {
                ...params,
                page,
                size,
            },
        }
    );

    return response.data;
};