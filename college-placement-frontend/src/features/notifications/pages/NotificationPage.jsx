import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    CircularProgress,
} from "@mui/material";

import {
    getNotifications,
    markAsRead,
} from "../../../services/notificationService";

const NotificationPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadNotifications = async () => {
        try {
            const response = await getNotifications();
            setNotifications(response.content || []);
        } catch (error) {
            console.error("Failed to load notifications", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const handleNotificationClick = async (notification) => {
        if (!notification.isRead) {
            await markAsRead(notification.id);
            loadNotifications();
        }
    };

    if (loading) {
        return (
            <Box sx={{ textAlign: "center", mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
            <Typography variant="h4" fontWeight="bold" mb={3}>
                Notifications
            </Typography>

            {notifications.length === 0 ? (
                <Typography>No notifications found.</Typography>
            ) : (
                notifications.map((notification) => (
                    <Card
                        key={notification.id}
                        sx={{
                            mb: 2,
                            cursor: "pointer",
                            backgroundColor: notification.isRead ? "#fff" : "#E3F2FD",
                        }}
                        onClick={() => handleNotificationClick(notification)}
                    >
                        <CardContent>
                            <Typography variant="h6">
                                {notification.title}
                            </Typography>

                            <Typography sx={{ mt: 1 }}>
                                {notification.message}
                            </Typography>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                {new Date(notification.createdAt).toLocaleString()}
                            </Typography>
                        </CardContent>
                    </Card>
                ))
            )}
        </Box>
    );
};

export default NotificationPage;