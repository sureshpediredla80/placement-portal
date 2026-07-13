import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    TablePagination,
} from "@mui/material";
import {
    useState,
} from "react";const UsersTable = ({
                                              users,
                                              page,
                                              rowsPerPage,
                                              totalElements,
                                              onPageChange,
                                              onRowsPerPageChange,
                                              onStatusToggle,
                                          }) => {
    const [
        selectedUser,
        setSelectedUser,
    ] = useState(null);

    const [
        openDialog,
        setOpenDialog,
    ] = useState(false);
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
                height:"65vh",
                overflowY:"auto",
            }}
        >
            <Table stickyHeader>

                <TableHead>

                    <TableRow>
                        <TableCell
                            sx={headerStyle}
                        >
                            Full Name
                        </TableCell>

                        <TableCell sx={headerStyle}>
                            Email
                        </TableCell>

                        <TableCell sx={headerStyle}>
                            Role
                        </TableCell>

                        <TableCell sx={headerStyle}>
                            Status
                        </TableCell>

                        <TableCell sx={headerStyle}>
                            Created
                        </TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {users.map(
                        (user) => (
                            <TableRow
                                key={
                                    user.id
                                }
                                hover
                            >
                                <TableCell>
                                    {
                                        user.fullName
                                    }
                                </TableCell>

                                <TableCell>
                                    {
                                        user.email
                                    }
                                </TableCell>

                                <TableCell>
                                    {
                                        user.role
                                            .replace(
                                                "ROLE_",
                                                ""
                                            )
                                    }
                                </TableCell>

                                <TableCell>

                                    <Chip
                                        label={
                                            user.isActive
                                                ? "ACTIVE"
                                                : "INACTIVE"
                                        }
                                        color={
                                            user.isActive
                                                ? "success"
                                                : "error"
                                        }
                                        size="small"
                                        onClick={() => {

                                            setSelectedUser(
                                                user
                                            );

                                            setOpenDialog(
                                                true
                                            );
                                        }}
                                        sx={{
                                            cursor: "pointer",
                                            fontWeight: 600,
                                        }}
                                    />

                                </TableCell>

                                <TableCell>
                                    {new Date(
                                        user.createdAt
                                    ).toLocaleDateString()}
                                </TableCell>

                            </TableRow>
                        )
                    )}

                </TableBody>

            </Table>
            <TablePagination
                component="div"
                page={page}
                rowsPerPage={rowsPerPage}
                count={totalElements}
                rowsPerPageOptions={[10,25,50]}
                onPageChange={(event, newPage) => {

                    onPageChange(newPage);

                }}
                onRowsPerPageChange={(event) => {

                    onRowsPerPageChange(
                        Number(event.target.value)
                    );

                }}
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
                    "& .MuiTablePagination-actions": {

                        ml: 2,

                    },

                    "& .MuiTablePagination-actions button:hover": {

                        backgroundColor: "#f5f5f5",

                    },
                }}
            />
            <Dialog
                open={openDialog}
                onClose={() =>
                    setOpenDialog(false)
                }
            >

                <DialogTitle>
                    Confirm Action
                </DialogTitle>

                <DialogContent>

                    <DialogContentText>

                        {selectedUser?.isActive
                            ? "Are you sure you want to deactivate this user?"
                            : "Are you sure you want to activate this user?"}

                    </DialogContentText>

                </DialogContent>

                <DialogActions>

                    <Button
                        onClick={() =>
                            setOpenDialog(false)
                        }
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        color={
                            selectedUser?.isActive
                                ? "error"
                                : "success"
                        }
                        onClick={async () => {

                            await onStatusToggle(
                                selectedUser
                            );

                            setOpenDialog(
                                false
                            );
                        }}
                    >
                        Yes
                    </Button>

                </DialogActions>

            </Dialog>

        </TableContainer>

    );
};

export default UsersTable;