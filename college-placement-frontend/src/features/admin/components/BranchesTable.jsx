import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Box,
    Typography,
} from "@mui/material";
import {
    IconButton,
} from "@mui/material";

import DeleteIcon
    from "@mui/icons-material/Delete";

const BranchesTable = ({
                           branches,
                           loading,
                         onDelete,
                       }) => {

    const headerStyle = {

        backgroundColor: "#1976d2",

        color: "#fff",

        fontWeight: 700,

    };

    if (loading) {

        return (

            <Box
                display="flex"
                justifyContent="center"
                mt={5}
            >

                <CircularProgress />

            </Box>

        );

    }

    if (branches.length === 0) {

        return (

            <Typography
                textAlign="center"
                mt={5}
            >

                No branches found.

            </Typography>

        );

    }

    return (

        <TableContainer
            component={Paper}
            sx={{
                borderRadius: 3,
            }}
        >

            <Table>

                <TableHead>

                    <TableRow>

                        <TableCell sx={headerStyle}>
                            Branch Name
                        </TableCell>

                        <TableCell sx={headerStyle}>
                            Branch Code
                        </TableCell>

                        <TableCell sx={headerStyle}>
                            Department
                        </TableCell>
                        <TableCell
                            sx={headerStyle}
                            align="center"
                        >
                            Actions
                        </TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {branches.map(
                        (
                            branch
                        ) => (

                            <TableRow
                                key={branch.id}
                                hover
                            >

                                <TableCell>
                                    {branch.name}
                                </TableCell>

                                <TableCell>
                                    {branch.code}
                                </TableCell>

                                <TableCell>
                                    {branch.department}
                                </TableCell>
                                <TableCell
                                    align="center"
                                >

                                    <IconButton
                                        color="error"
                                        onClick={() =>
                                            onDelete(branch)
                                        }
                                    >

                                        <DeleteIcon />

                                    </IconButton>

                                </TableCell>

                            </TableRow>

                        )
                    )}

                </TableBody>

            </Table>

        </TableContainer>

    );

};

export default BranchesTable;