import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
} from "@mui/material";

const CoordinatorsTable = ({ coordinators }) => {

    const formatDate = (date) => {
        return new Date(date)
            .toLocaleDateString();
    };

    const headerStyle = {
        backgroundColor: "#1976d2",
        color: "#fff",
        fontWeight: 700,
        position: "sticky",
        top: 0,
        zIndex: 1,
    };

    return (
        <TableContainer
            component={Paper}
            sx={{
                height: "65vh",
                overflowY: "auto",
                borderRadius: 3,
            }}
        >
            <Table stickyHeader>

                <TableHead>
                    <TableRow>

                        <TableCell sx={headerStyle}>
                            Full Name
                        </TableCell>

                        <TableCell sx={headerStyle}>
                            Email
                        </TableCell>

                        <TableCell sx={headerStyle}>
                            Active Status
                        </TableCell>

                        <TableCell sx={headerStyle}>
                            Branch Code
                        </TableCell>

                        <TableCell sx={headerStyle}>
                            Created Date
                        </TableCell>

                    </TableRow>
                </TableHead>

                <TableBody>

                    {coordinators.map(
                        (coordinator) => (
                            <TableRow
                                key={coordinator.id}
                                hover
                                sx={{
                                    transition:
                                        "background-color 0.2s ease",

                                    "&:hover": {
                                        backgroundColor:
                                            "#f5f9ff",
                                    },
                                }}
                            >
                                <TableCell>
                                    {
                                        coordinator.user
                                            .fullName
                                    }
                                </TableCell>

                                <TableCell>
                                    {
                                        coordinator.user
                                            .email
                                    }
                                </TableCell>

                                <TableCell>
                                    <Chip
                                        label={
                                            coordinator.user
                                                .isActive
                                                ? "ACTIVE"
                                                : "INACTIVE"
                                        }
                                        color={
                                            coordinator.user
                                                .isActive
                                                ? "success"
                                                : "error"
                                        }
                                        size="small"
                                    />
                                </TableCell>

                                <TableCell>
                                    {
                                        coordinator.branch
                                            .code
                                    }
                                </TableCell>

                                <TableCell>
                                    {formatDate(
                                        coordinator.user
                                            .createdAt
                                    )}
                                </TableCell>

                            </TableRow>
                        )
                    )}

                </TableBody>

            </Table>
        </TableContainer>
    );
};

export default CoordinatorsTable;