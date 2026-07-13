import { useState, useEffect } from "react";
import { Chip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import StudentDetailsDialog
    from "../components/StudentDetailsDialog";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import SearchStudentsDialog from "../components/SearchStudentsDialog";
import {
    Box,
    Button,
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
} from "../api/coordinatorApi";
import { getCoordinatorStudents } from "../api/coordinatorApi";
import {
    searchStudents,
    getStudentByRollNumber
} from "../api/coordinatorApi";
const CoordinatorStudentsPage = () => {
    const [
        openSearchDialog,
        setOpenSearchDialog,
    ] = useState(false);
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

    const fetchStudents = async () => {
        setLoading(true);

        try {
            const response =
                await getCoordinatorStudents();

            setStudents(
                response.content || []
            );
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);
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
    const handleSearch = async (filters) => {
        setLoading(true);

        try {
            const response =
                await searchStudents({
                    ...filters,
                    page: 0,
                    size: 10,
                    sortBy: "id",
                    sortDir: "desc",
                });

            setStudents(
                response.content || []
            );
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
        } catch (error) {
            console.error(error);

            setStudents([]);
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
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                }}
            >

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        mb: 2,
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






                <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={fetchStudents}
                >
                    Refresh
                </Button>

            </Box>

            {students.length === 0 && (
                <Typography
                    color="text.secondary"
                >
                    No students found.
                </Typography>
            )}

            <TableContainer
                component={Paper}
                sx={{
                    height: "75vh",
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

export default CoordinatorStudentsPage;