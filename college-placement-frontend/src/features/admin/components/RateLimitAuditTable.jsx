import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Typography,
    Chip,
    Box,
} from "@mui/material";

const formatDateTime = (dateTime) => {

    if (!dateTime) {
        return "-";
    }

    return new Date(dateTime).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
    });

};

const RateLimitAuditTable = ({
                                 events,
                                 page,
                                 rowsPerPage,
                                 totalElements,
                                 onPageChange,
                             }) => {

    return (

        <Paper
            elevation={0}
            sx={{
                borderRadius:4,
                overflow:"hidden",
                border:"1px solid #e5e7eb",
                boxShadow:"0 6px 20px rgba(0,0,0,0.08)",
            }}
        >

            <TableContainer
                sx={{
                    maxHeight: 600,
                }}
            >

                <Table
                    stickyHeader
                >

                    <TableHead>

                        <TableRow>

                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    backgroundColor: "#f8fafc",
                                }}
                            >
                                <strong>ID</strong>
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontWeight:700,
                                    backgroundColor:"#f8fafc",
                                }}
                            >
                                <strong>Time</strong>
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontWeight:700,
                                    backgroundColor:"#f8fafc",
                                }}
                            >
                                <strong>User</strong>
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontWeight:700,
                                    backgroundColor:"#f8fafc",
                                }}
                            >
                                <strong>IP Address</strong>
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontWeight:700,
                                    backgroundColor:"#f8fafc",
                                }}
                            >
                                <strong>Endpoint</strong>
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontWeight:700,
                                    backgroundColor:"#f8fafc",
                                }}
                            >
                                <strong>Method</strong>
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontWeight:700,
                                    backgroundColor:"#f8fafc",
                                }}
                            >
                                <strong>Type</strong>
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontWeight:700,
                                    backgroundColor:"#f8fafc",
                                }}
                            >
                                <strong>Retry</strong>
                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {

                            events.length === 0 ?

                                (

                                    <TableRow>

                                        <TableCell
                                            colSpan={8}
                                            align="center"
                                            sx={{
                                                py:8,
                                            }}
                                        >

                                            <Typography
                                                variant="h2"
                                            >
                                                🛡️
                                            </Typography>

                                            <Typography
                                                variant="h6"
                                                fontWeight={700}
                                                sx={{
                                                    mt:2,
                                                }}
                                            >
                                                No Rate Limit Violations
                                            </Typography>

                                            <Typography
                                                color="text.secondary"
                                                sx={{
                                                    mt:1,
                                                }}
                                            >
                                                Everything looks good. No blocked requests were found.
                                            </Typography>

                                        </TableCell>

                                    </TableRow>

                                )

                                :

                                (

                                    events.map((event) => (

                                        <TableRow
                                            hover
                                            key={event.id}
                                            sx={{
                                                "&:nth-of-type(odd)": {
                                                    backgroundColor: "#fafafa",
                                                },
                                                "&:hover": {
                                                    backgroundColor: "#e3f2fd",
                                                },
                                            }}
                                        >

                                            <TableCell>

                                                {event.id}

                                            </TableCell>

                                            <TableCell>

                                                {formatDateTime(
                                                    event.blockedAt
                                                )}

                                            </TableCell>

                                            <TableCell>

                                                {

                                                    event.userId ??

                                                    "-"

                                                }

                                            </TableCell>

                                            <TableCell>

                                                {

                                                    event.ipAddress

                                                }

                                            </TableCell>

                                            <TableCell>

                                                <Box
                                                    sx={{
                                                        maxWidth: 260,
                                                        whiteSpace: "normal",
                                                        wordBreak: "break-word",
                                                    }}
                                                >

                                                    {

                                                        event.endpoint

                                                    }

                                                </Box>

                                            </TableCell>

                                            <TableCell>

                                                <Chip
                                                    label={
                                                        event.httpMethod
                                                    }
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                />

                                            </TableCell>

                                            <TableCell>

                                                <Chip
                                                    label={
                                                        event.rateLimitType
                                                    }
                                                    size="small"
                                                    color="warning"
                                                />

                                            </TableCell>

                                            <TableCell
                                                align="center"
                                            >

                                                {

                                                    event.retryAfterSeconds

                                                }

                                                s

                                            </TableCell>

                                        </TableRow>

                                    ))

                                )

                        }

                    </TableBody>

                </Table>

            </TableContainer>

            <TablePagination
                component="div"
                page={page}
                rowsPerPage={rowsPerPage}
                count={totalElements}
                rowsPerPageOptions={[10]}
                onPageChange={onPageChange}
                labelRowsPerPage="Rows"
                sx={{
                    borderTop: "1px solid #e0e0e0",

                    "& .MuiTablePagination-toolbar": {
                        px: 3,
                        minHeight: 64,
                    },

                    "& .MuiTablePagination-selectLabel": {
                        fontWeight: 600,
                    },

                    "& .MuiTablePagination-displayedRows": {
                        fontWeight: 600,
                    },

                    "& .MuiIconButton-root": {
                        borderRadius: 2,
                    },
                }}
            />

        </Paper>

    );

};

export default RateLimitAuditTable;