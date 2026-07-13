import axiosInstance from "../../../services/axiosInstance";

export const getCoordinators = async () => {
    const response = await axiosInstance.get(
        "/api/coordinator-profiles",
        {
            params: {
                page: 0,
                size: 100,
                sort: "id,DESC",
            },
        }
    );

    return response.data;
};
export const getUsersByRole = async (
    role,
    page = 0,
    size = 10
) => {

    const response =
        await axiosInstance.get(
            `/api/users/role/${role}`,
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
export const searchUsersByRole = async (
    role,
    keyword,
    page = 0,
    size = 10
) => {

    const response =  await axiosInstance.get(
        `/api/users/role/${role}/search`,
        {
            params: {
                keyword,
                page,
                size,
            },
        }
    );

    return response.data;
};
export const activateUser = async (
    userId
) => {

    const response =
        await axiosInstance.put(
            `/api/users/${userId}/activate`
        );

    return response.data;
};

export const deactivateUser = async (
    userId
) => {

    const response =
        await axiosInstance.put(
            `/api/users/${userId}/deactivate`
        );

    return response.data;
};
export const getBranches = async () => {

    const response =
        await axiosInstance.get(
            "/api/branches"
        );

    return response.data;
};
export const createUser = async (
    payload
) => {

    const response =
        await axiosInstance.post(
            "/api/users",
            payload
        );

    return response.data;
};
export const uploadStudents =
    async (file) => {

        const formData =
            new FormData();

        formData.append(
            "file",
            file
        );

        const response =
            await axiosInstance.post(
                "/api/users/bulk-upload/students",
                formData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                }
            );

        return response.data;
    };
export const downloadStudentTemplate =
    async () => {

        const response =
            await axiosInstance.get(
                "/api/users/bulk-upload/template",
                {
                    responseType: "blob",
                }
            );

        return response.data;
    };

export const promoteAllStudents = async () => {

    const response =
        await axiosInstance.put(
            "/api/students/promote-all"
        );

    return response.data;
};
export const deactivateGraduatedStudents =
    async () => {

        const response =
            await axiosInstance.put(
                "/api/users/deactivate-graduated"
            );

        return response.data;
    };
export const activateGraduates = async () => {

    const response =
        await axiosInstance.put(
            "/api/users/activate-graduates"
        );

    return response.data;
};
export const createBranch = async (data) => {

    const response = await axiosInstance.post(
        "/api/branches",
        data
    );

    return response.data;
};
export const deleteBranch = async (branchId) => {

    const response =
        await axiosInstance.delete(
            `/api/branches/${branchId}`
        );

    return response.data;

};
export const getRateLimitEvents = async (
    page = 0,
    size = 10
) => {

    const response =
        await axiosInstance.get(
            "/api/admin/rate-limit-events",
            {
                params: {
                    page,
                    size,
                },
            }
        );

    return response.data;
};
export const getRateLimitStatistics = async (
    from
) => {

    const response =
        await axiosInstance.get(
            "/api/admin/rate-limit-events/statistics",
            {
                params: {
                    from,
                },
            }
        );

    return response.data;
};
export const filterRateLimitEvents = async (
    start,
    end,
    page = 0,
    size = 10
) => {

    const response =
        await axiosInstance.get(
            "/api/admin/rate-limit-events/filter",
            {
                params: {
                    start,
                    end,
                    page,
                    size,
                },
            }
        );

    return response.data;
};