import axiosInstance from "./axiosInstance";

export const getNotifications = async (page = 0, size = 10) => {
    const response = await axiosInstance.get("/api/notifications", {
        params: {
            page,
            size,
            sort: "createdAt,desc",
        },
    });

    return response.data;
};

export const getUnreadCount = async () => {
    const response = await axiosInstance.get(
        "/api/notifications/unread-count"
    );

    return response.data;
};

export const markAsRead = async (notificationId) => {
    await axiosInstance.put(
        `/api/notifications/${notificationId}/read`
    );
};