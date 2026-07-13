import axiosInstance
    from "../../../services/axiosInstance";

export const createNews =
    async (payload) => {

        const response =
            await axiosInstance.post(
                "/api/news",
                payload
            );

        return response.data;
    };
export const getNews = async (
    page = 0,
    size = 10
) => {

    const response =
        await axiosInstance.get(
            "/api/news",
            {
                params: {
                    page,
                    size,
                    sort: "createdAt,DESC",
                },
            }
        );

    return response.data;
};
export const deleteNews = async (
    newsId
) => {

    const response =
        await axiosInstance.delete(
            `/api/news/${newsId}`
        );

    return response.data;
};