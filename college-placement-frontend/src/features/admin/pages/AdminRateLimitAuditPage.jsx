import {
    Box,
    Typography,
    CircularProgress,
} from "@mui/material";

import {
    useEffect,
    useState,
} from "react";

import {
    getRateLimitEvents,
} from "../api/adminApi";

import RateLimitAuditTable
    from "../components/RateLimitAuditTable";

const ROWS_PER_PAGE = 10;

const AdminRateLimitAuditPage = () => {

    const [events, setEvents] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [page, setPage] =
        useState(0);

    const [totalElements, setTotalElements] =
        useState(0);

    const fetchRateLimitEvents =
        async (currentPage = 0) => {

            try {

                setLoading(true);

                const data =
                    await getRateLimitEvents(
                        currentPage,
                        ROWS_PER_PAGE
                    );

                setEvents(
                    data?.content || []
                );

                setTotalElements(
                    data?.totalElements || 0
                );

            } catch (error) {

                console.error(
                    "Failed to fetch rate limit events",
                    error
                );

            } finally {

                setLoading(false);

            }

        };

    useEffect(() => {

        fetchRateLimitEvents(page);

    }, [page]);

    const handlePageChange = (
        event,
        newPage
    ) => {

        setPage(newPage);

    };

    return (

        <Box>

            <Box
                sx={{
                    mb: 3,
                }}
            >

                <Typography
                    variant="h4"
                    fontWeight={700}
                >

                    🛡️ Rate Limit Audit

                </Typography>

                <Typography
                    color="text.secondary"
                >
                    Monitor all requests blocked by the system rate limiter. Review user activity, IP addresses and endpoints to identify suspicious traffic.
                </Typography>

            </Box>

            {

                loading ?

                    (

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                mt: 10,
                            }}
                        >

                            <CircularProgress />

                        </Box>

                    )

                    :

                    (

                        <RateLimitAuditTable

                            events={events}

                            page={page}

                            rowsPerPage={
                                ROWS_PER_PAGE
                            }

                            totalElements={
                                totalElements
                            }

                            onPageChange={
                                handlePageChange
                            }

                        />

                    )

            }

        </Box>

    );

};

export default AdminRateLimitAuditPage;