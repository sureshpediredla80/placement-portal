import { useState, useEffect } from "react";
import { Chip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";
import TablePagination from "@mui/material/TablePagination";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import FilterListIcon from "@mui/icons-material/FilterList";
import StudentDetailsDialog
    from "../../coordinators/components/StudentDetailsDialog";
import SearchStudentsDialog from "../../coordinators/components/SearchStudentsDialog";
import {
    Box,

    Typography,
    CircularProgress,

    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import {
    getStudentDetails,

    searchStudents,
    getStudentByRollNumber,

} from "../../coordinators/api/coordinatorApi";

const AdminStudentsPage = () => {

    const [
        openSearchDialog,
        setOpenSearchDialog,
    ] = useState(false);
    const [page, setPage] = useState(0);

    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [totalElements, setTotalElements] = useState(0);
    const [filters, setFilters] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [rollNumber, setRollNumber] = useState("");
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [
        selectedStudent,
        setSelectedStudent,
    ] = useState(null);

    const [
        openStudentDialog,
        setOpenStudentDialog,
    ] = useState(false);



    useEffect(() => {

        if (!hasSearched || !filters) {
            return;
        }

        handleSearch(
            filters,
            page,
            rowsPerPage
        );

    }, [
        page,
        rowsPerPage,
        filters,
        hasSearched,
    ]);
    const handleViewStudent =
        async (studentId) => {
            try {
                const response =
                    await getStudentDetails(
                        studentId
                    );

                setSelectedStudent(
                    response
                );

                setOpenStudentDialog(
                    true
                );
            } catch (error) {
                console.error(error);
            }
        };
    const handleSearch = async (

        filters,
        currentPage = page,
        currentSize = rowsPerPage
    ) => {

        setLoading(true);

        try {
            const response =
                await searchStudents({
                    ...filters,
                    page: currentPage,
                    size: currentSize,
                    sortBy: "id",
                    sortDir: "desc",
                });

            setStudents(response.content || []);

            setTotalElements(response.totalElements || 0);
            setFilters(filters);
            setHasSearched(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const handleRollNumberSearch = async () => {
        if (!rollNumber.trim()) {
            return;
        }

        setLoading(true);

        try {
            const response =
                await getStudentByRollNumber(
                    rollNumber
                );

            setStudents([response]);

            setPage(0);

            setTotalElements(1);

            setFilters(null);      // ADD THIS

            setHasSearched(true);
        } catch (error) {
            console.error(error);

            setStudents([]);

            setTotalElements(0);

            setFilters(null);      // ADD THIS

            setHasSearched(true);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 5,
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "SELECTED":
                return "success";

            case "REJECTED":
                return "error";

            default:
                return "primary";
        }
    };
    const headerStyle = {
        fontWeight: 700,
        bgcolor: "primary.main",
        color: "white",
        fontSize: "0.95rem",
        borderBottom: "none",
    };

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    mb:1.5,
                }}
            >


                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        mb: 1,
                    }}
                >
                    <Paper
                        component="form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleRollNumberSearch();
                        }}
                        sx={{
                            p: "4px 10px",
                            display: "flex",
                            alignItems: "center",
                            width: 650,
                            height: 60,
                            borderRadius: "40px",
                            boxShadow: 3,
                        }}
                    >
                        <IconButton
                            type="submit"
                            sx={{ p: "10px" }}
                        >
                            <SearchIcon />
                        </IconButton>

                        <InputBase
                            sx={{
                                ml: 1,
                                flex: 1,
                                fontSize: "1rem",
                            }}
                            placeholder="Search Roll Number"
                            value={rollNumber}
                            onChange={(e) =>
                                setRollNumber(
                                    e.target.value
                                )
                            }
                        />

                        <Divider
                            sx={{
                                height: 28,
                                m: 0.5,
                            }}
                            orientation="vertical"
                        />

                        <IconButton
                            onClick={() =>
                                setOpenSearchDialog(true)
                            }
                            sx={{ p: "10px" }}
                        >
                            <FilterListIcon />
                        </IconButton>
                    </Paper>
                </Box>

            </Box>
            {hasSearched && students.length === 0 && (
                <Typography
                    color="text.secondary"
                >
                    No students found.
                </Typography>
            )}

            <Paper>

                <TableContainer
                sx={{
                    maxHeight:"70vh",
                    overflowY: "auto",
                }}
            >
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={headerStyle}>
                                Name
                            </TableCell>

                            <TableCell sx={headerStyle}>
                                Roll Number
                            </TableCell>

                            <TableCell sx={headerStyle}>
                                Year
                            </TableCell>
                            <TableCell sx={headerStyle}>
                                CGPA
                            </TableCell>

                            <TableCell sx={headerStyle}>
                                Placement Status
                            </TableCell>
                            <TableCell sx={headerStyle}>
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {students.map(
                            (student) => (
                                <TableRow
                                    key={student.id}
                                    sx={{
                                        transition: "background-color 0.2s",
                                        "&:hover": {
                                            backgroundColor: "action.hover",
                                        },
                                    }}
                                >
                                    <TableCell>
                                        {
                                            student.fullName
                                        }
                                    </TableCell>

                                    <TableCell>
                                        {
                                            student.rollNumber
                                        }
                                    </TableCell>

                                    <TableCell>
                                        {
                                            student.year
                                        }
                                    </TableCell>

                                    <TableCell>
                                        {
                                            student.cgpa
                                        }
                                    </TableCell>

                                    <TableCell>
                                        <Chip
                                            label={student.placementStatus}
                                            color={getStatusColor(
                                                student.placementStatus
                                            )}
                                            size="small"
                                            variant="filled"

                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={() =>
                                                handleViewStudent(
                                                    student.id
                                                )
                                            }
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={totalElements}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[5,10,25,50]}
                    onPageChange={(event, newPage) => {

                        setPage(newPage);

                    }}
                    onRowsPerPageChange={(event) => {

                        setRowsPerPage(
                            parseInt(
                                event.target.value,
                                10
                            )
                        );

                        setPage(0);

                    }}
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
            <SearchStudentsDialog
                open={openSearchDialog}
                onClose={() =>
                    setOpenSearchDialog(false)
                }
                onSearch={handleSearch}
            />
            <StudentDetailsDialog
                open={openStudentDialog}
                onClose={() =>
                    setOpenStudentDialog(false)
                }
                student={selectedStudent}
            />
        </Box>
    );
};

export default AdminStudentsPage;