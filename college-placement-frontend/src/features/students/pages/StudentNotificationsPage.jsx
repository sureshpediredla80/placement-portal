import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    CircularProgress,
} from "@mui/material";

import { getNotifications, markAsRead } from "../../../services/notificationService";

const StudentNotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadNotifications = async () => {
        try {
            const response = await getNotifications();
            setNotifications(response.content || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const handleClick = async (notification) => {
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
        <Box sx={{ maxWidth: 900, mx: "auto" }}>
            <Typography variant="h4" mb={3}>
                Notifications
            </Typography>

            {notifications.length === 0 ? (
                <Typography>No Notifications</Typography>
            ) : (
                notifications.map((notification) => (
                    <Card
                        key={notification.id}
                        sx={{
                            mb: 2,
                            cursor: "pointer",
                            bgcolor: notification.isRead ? "#fff" : "#E3F2FD",
                        }}
                        onClick={() => handleClick(notification)}
                    >
                        <CardContent>
                            <Typography variant="h6">
                                {notification.title}
                            </Typography>

                            <Typography color="text.secondary" sx={{ mt: 1 }}>
                                {notification.message}
                            </Typography>

                            <Typography
                                variant="caption"
                                color="text.disabled"
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

export default StudentNotificationsPage;