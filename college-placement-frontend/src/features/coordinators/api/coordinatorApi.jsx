import axiosInstance from "../../../services/axiosInstance";


export const getMyCoordinatorProfile = async () => {
    const response = await axiosInstance.get(
        "/api/coordinator-profiles/me"
    );

    return response.data;
};
export const getCoordinatorStudents =
    async () => {
        const response =
            await axiosInstance.get(
                "/api/coordinator/students"
            );

        return response.data;
    };
export const searchStudents =
    async (params) => {
        const response =
            await axiosInstance.get(
                "/api/students/search",
                {
                    params,
                }
            );

        return response.data;
    };
export const getBranches =
    async () => {
        const response =
            await axiosInstance.get(
                "/api/branches"
            );

        return response.data;
    };
export const getSkills =
    async () => {
        const response =
            await axiosInstance.get(
                "/api/skills"
            );

        return response.data;
    };
export const getStudentDetails =
    async (studentId) => {
        const response =
            await axiosInstance.get(
                `/api/students/${studentId}`
            );

        return response.data;
    };
export const getActiveCompanies = async (page = 0, size = 10) => {
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
export const getExpiredCompanies = async (page = 0, size = 10) => {
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
export const getAllCompanies = async (page = 0, size = 10) => {
    const response = await axiosInstance.get(
        "/api/companies",
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
export const createCompany = async (
    payload
) => {
    const response =
        await axiosInstance.post(
            "/api/companies",
            payload
        );

    return response.data;
};
export const updateCompany = async (
    companyId,
    payload
) => {

    const response =
        await axiosInstance.put(
            `/api/companies/${companyId}`,
            payload
        );

    return response.data;
};
export const deleteCompany =
    async (companyId) => {

        await axiosInstance.delete(
            `/api/companies/${companyId}`
        );
    };

export const getApplications = async (
    status = "APPLIED",
    page = 0,
    size = 10
) => {

    const response =
        await axiosInstance.get(
            "/api/applications",
            {
                params: {
                    status,
                    page,
                    size,
                    sort: "id,DESC",
                },
            }
        );

    return response.data;
};
export const getApplicationById = async (
    applicationId
) => {
    const response = await axiosInstance.get(
        `/api/applications/${applicationId}`
    );

    return response.data;
};

export const shortlistApplication = async (
    applicationId
) => {
    const response = await axiosInstance.put(
        `/api/applications/${applicationId}/shortlist`
    );

    return response.data;
};

export const selectApplication = async (
    applicationId
) => {
    const response = await axiosInstance.put(
        `/api/applications/${applicationId}/select`
    );

    return response.data;
};

export const rejectApplication = async (
    applicationId
) => {
    const response = await axiosInstance.put(
        `/api/applications/${applicationId}/reject`
    );

    return response.data;
};

export const getApplicationsByCompany = async (
    companyId,
    status
) => {
    const response = await axiosInstance.get(
        `/api/applications/company/${companyId}`,
        {
            params: {
                status,
                page: 0,
                size: 10,
                sort: "id,DESC",
            },
        }
    );

    return response.data;
};
export const getApplicationsByStudent = async (
    studentId,
    status
) => {
    const response = await axiosInstance.get(
        `/api/applications/student/${studentId}`,
        {
            params: {
                status,
                page: 0,
                size: 10,
                sort: "id,DESC",
            },
        }
    );

    return response.data;
};
export const getCertificatesByStatus = async (
    status,
    page = 0,
    size = 10
) => {
    const response = await axiosInstance.get(
        `/api/certificates/status/${status}`,
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
export const approveCertificate = async (
    certificateId
) => {
    const response = await axiosInstance.put(
        `/api/certificates/${certificateId}/approve`
    );

    return response.data;
};

export const rejectCertificate = async (
    certificateId
) => {
    const response = await axiosInstance.put(
        `/api/certificates/${certificateId}/reject`
    );

    return response.data;
};
export const createSession = async (payload) => {
    const response = await axiosInstance.post(
        "/api/sessions",
        payload
    );

    return response.data;
};
export const getSessions = async (
    page = 0,
    size = 6
) => {

    const response =
        await axiosInstance.get(
            "/api/sessions",
            {
                params: {
                    page,
                    size,
                    sort: "sessionDate,ASC",
                },
            }
        );

    return response.data;
};
export const getSessionById = async (
    sessionId
) => {

    const response =
        await axiosInstance.get(
            `/api/sessions/${sessionId}`
        );

    return response.data;
};
export const deleteSession = async (
    sessionId
) => {

    await axiosInstance.delete(
        `/api/sessions/${sessionId}`
    );

};
export const getUpcomingSessions =
    async (
        page = 0,
        size = 6
    ) => {

        const response =
            await axiosInstance.get(
                "/api/sessions/upcoming",
                {
                    params: {
                        page,
                        size,
                        sort: "sessionDate,ASC",
                    },
                }
            );

        return response.data;
    };
export const getSessionsByDateRange =
    async (
        startDate,
        endDate,
        page = 0,
        size = 6
    ) => {

        const response =
            await axiosInstance.get(
                "/api/sessions/date-range",
                {
                    params: {
                        startDate,
                        endDate,
                        page,
                        size,
                        sort: "sessionDate,ASC",
                    },
                }
            );

        return response.data;
    };
export const getStudentByRollNumber = async (
    rollNumber
) => {
    const response = await axiosInstance.get(
        `/api/students/roll-number/${rollNumber}`
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