import {
    Box,
    Typography,
    Paper,
    MenuItem,
    InputBase,
    Divider,

    Menu,
    IconButton, Grid,

} from "@mui/material";
import { ROUTES } from "../../../constants/routes";
import {
    deactivateGraduatedStudents,
} from "../api/adminApi";
import {
    activateGraduates,
} from "../api/adminApi";

import AcademicOperationCard
    from "../components/AcademicOperationCard";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SchoolIcon from "@mui/icons-material/School";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import SecurityIcon from "@mui/icons-material/Security";
import PersonAddAlt1Icon
    from "@mui/icons-material/PersonAddAlt1";
import AppSnackbar from
        "../../../components/common/AppSnackbar";
import CreateUserDialog
    from "../forms/CreateUserDialog";
import SearchIcon from "@mui/icons-material/Search";
import BulkUploadDialog
    from "../components/BulkUploadDialog";
import BulkUploadResultDialog from "../components/BulkUploadResultDialog";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
    useState,
    useEffect,
} from "react";
import DeactivateGraduatedDialog
    from "../components/DeactivateGraduatedDialog";
import UsersTable from "../components/UsersTable";

import {
    getUsersByRole,
    searchUsersByRole,
    activateUser,
    deactivateUser,
    getBranches,
} from "../api/adminApi";
import PromoteStudentsDialog from "../components/PromoteStudentsDialog.jsx";
import ConfirmationDialog from "../components/ConfirmationDialog.jsx";
import {useNavigate} from "react-router-dom";

const AdminUsersPage=()=>{
    const navigate = useNavigate();
const [role, setRole] =
    useState(
        "ROLE_STUDENT"
    );
    const [
        selectedOperation,
        setSelectedOperation,
    ] = useState(null);
const [users, setUsers] =
    useState([]);
    const [page, setPage] = useState(0);

    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [totalElements, setTotalElements] = useState(0);

    const [
        branches,
        setBranches,
    ] = useState([]);
    const [
        openBulkDialog,
        setOpenBulkDialog,
    ] = useState(false);
    const [
        snackbar,
        setSnackbar,
    ] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const [anchorEl, setAnchorEl] = useState(null);
    const [
        promoteDialogOpen,
        setPromoteDialogOpen,
    ] = useState(false);
    const [
        deactivateDialogOpen,
        setDeactivateDialogOpen,
    ] = useState(false);
    const [
        activatingGraduates,
        setActivatingGraduates,
    ] = useState(false);

    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFilterClose = () => {
        setAnchorEl(null);
    };

    const handleRoleChange = (selectedRole) => {
        setRole(selectedRole);

        setPage(0);
        handleFilterClose();
    };

const [search, setSearch] =
    useState("");
    const [
        uploadResult,
        setUploadResult,
    ] = useState(null);

    const [
        resultDialogOpen,
        setResultDialogOpen,
    ] = useState(false);
    const [
        activateDialogOpen,
        setActivateDialogOpen,
    ] = useState(false);
    const [
        openCreateDialog,
        setOpenCreateDialog
    ] = useState(false);

    const fetchUsers = async (
        selectedRole
    ) => {

        try {

            const data =
                await getUsersByRole(
                    selectedRole,
                    page,
                    rowsPerPage
                );

            setUsers(
                data.content
            );

            setTotalElements(
                data.totalElements
            );

        } catch (error) {

            console.error(error);

        }
    };
    useEffect(() => {

        const searchUsers =
            async () => {

                try {

                    if (
                        search.trim()
                    ) {

                        const data =
                            await searchUsersByRole(
                                role,
                                search,
                                page,
                                rowsPerPage
                            );

                        setUsers(
                            data.content
                        );

                        setTotalElements(
                            data.totalElements
                        );

                    } else {

                        fetchUsers(
                            role
                        );
                    }

                } catch (error) {

                    console.error(
                        error
                    );

                }
            };


        const timer =
            setTimeout(
                searchUsers,
                500
            );

        return () =>
            clearTimeout(
                timer
            );

    }, [
        search,
        role,
        page,
        rowsPerPage
    ]);
    const handleDeactivateGraduated =
        async () => {

            try {

                const message =
                    await deactivateGraduatedStudents();

                showSnackbar(
                    message,
                    "success"
                );

                fetchUsers(role);

            } catch (error) {

                showSnackbar(
                    error?.response?.data?.message ||
                    "Failed to deactivate students",
                    "error"
                );

            } finally {

                setDeactivateDialogOpen(false);

            }
        };
    const handleActivateGraduates =
        async () => {

            try {

                setActivatingGraduates(true);

                await activateGraduates();

                showSnackbar(
                    "Graduates activated successfully",
                    "success"
                );

                fetchUsers(role);

            } catch (error) {

                showSnackbar(
                    error?.response?.data?.message ||
                    "Activation failed",
                    "error"
                );

            } finally {

                setActivatingGraduates(false);

            }

        };
    const showSnackbar = (
        message,
        severity = "success"
    ) => {

        setSnackbar({
            open: true,
            message,
            severity,
        });

    };
    const handleStatusToggle = async (
        user
    ) => {

        try {

            let updatedUser;

            if (
                user.isActive
            ) {

                updatedUser =
                    await deactivateUser(
                        user.id
                    );

            } else {

                updatedUser =
                    await activateUser(
                        user.id
                    );
            }

            setUsers(
                (prev) =>
                    prev.map(
                        (u) =>
                            u.id === user.id
                                ? updatedUser
                                : u
                    )
            );

        } catch (error) {

            console.error(error);
        }
    };
    const fetchBranches =
        async () => {

            try {

                const data =
                    await getBranches();

                setBranches(
                    data || []
                );

            } catch (error) {

                console.error(
                    error
                );
            }
        };
    useEffect(() => {
        fetchUsers(role);
        fetchBranches();
    }, [role]);


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

            <Typography
                variant="h4"
                fontWeight={700}
            >
                Users
            </Typography>



        </Box>



        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 4,
            }}
        >
            <Paper
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
                <IconButton sx={{ p: "10px" }}>
                    <SearchIcon />
                </IconButton>

                <InputBase
                    sx={{
                        ml: 1,
                        flex: 1,
                        fontSize: "1rem",
                    }}
                    placeholder="Search User"
                    value={search}
                    onChange={(e)=>{

                        setSearch(e.target.value);

                        setPage(0);

                    }}
                />

                <Divider
                    sx={{
                        height: 28,
                        m: 0.5,
                    }}
                    orientation="vertical"
                />

                <IconButton
                    onClick={handleFilterClick}
                    sx={{ p: "10px" }}
                >
                    <FilterListIcon />
                </IconButton>
            </Paper>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleFilterClose}
            >
                <MenuItem
                    onClick={() =>
                        handleRoleChange(
                            "ROLE_STUDENT"
                        )
                    }
                >
                    Students
                </MenuItem>

                <MenuItem
                    onClick={() =>
                        handleRoleChange(
                            "ROLE_COORDINATOR"
                        )
                    }
                >
                    Coordinators
                </MenuItem>

                <MenuItem
                    onClick={() =>
                        handleRoleChange(
                            "ROLE_ADMIN"
                        )
                    }
                >
                    Admins
                </MenuItem>
            </Menu>

        </Box>


        <UsersTable
            users={users}
            page={page}
            rowsPerPage={rowsPerPage}
            totalElements={totalElements}
            onPageChange={setPage}
            onRowsPerPageChange={(value)=>{
                setRowsPerPage(value);
                setPage(0);
            }}
            onStatusToggle={handleStatusToggle}
        />

        <Box
            sx={{
                mt: 5,
            }}

        >
            <Typography
                variant="h5"
                fontWeight={700}
            >
                Academic Operations
            </Typography>

            <Typography
                color="text.secondary"
                sx={{mb:3}}
            >
                Manage bulk academic operations
            </Typography>
            <Grid
                container
                spacing={3}
            >

                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                        md: 4,
                        lg: 3,
                    }}
                >

                    <AcademicOperationCard
                        selected={
                            selectedOperation==="add"
                        }
                        icon={
                            <PersonAddAlt1Icon
                                sx={{
                                    fontSize:42,
                                    color:selectedOperation==="add"
                                        ? "#fff"
                                        : "#1976d2"
                                }}
                            />
                        }

                        title="Add User"

                        description="Create a new student, coordinator or admin account."

                        onClick={()=>{
                            setSelectedOperation("add");
                            setOpenCreateDialog(true);
                        }}

                    />

                </Grid>

                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                        md: 4,
                        lg: 3,
                    }}
                >
                    <AcademicOperationCard
                        selected={
                            selectedOperation === "upload"
                        }
                        icon={
                            <UploadFileIcon
                                sx={{
                                    fontSize: 42,
                                    color:
                                        selectedOperation === "upload"
                                            ? "#fff"
                                            : "#1976d2",
                                }}
                            />
                        }
                        title="Upload Excel"
                        description="Bulk create users using an Excel file."
                        onClick={() => {
                            setSelectedOperation("upload");
                            setOpenBulkDialog(true);
                        }}
                    />
                </Grid>

                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                        md: 4,
                        lg: 3,
                    }}
                >
                    <AcademicOperationCard
                        selected={
                            selectedOperation === "promote"
                        }
                        icon={
                            <SchoolIcon
                                sx={{
                                    fontSize: 42,
                                    color:
                                        selectedOperation === "promote"
                                            ? "#fff"
                                            : "#1976d2",
                                }}
                            />
                        }
                        title="Promote Students"
                        description="Promote all eligible students to the next academic year."
                        onClick={() => {
                            setSelectedOperation("promote");
                            setPromoteDialogOpen(true);
                        }}
                    />
                </Grid>
                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                        md: 4,
                        lg: 3,
                    }}
                >
                    <AcademicOperationCard
                        selected={
                            selectedOperation === "deactivate"
                        }
                        icon={
                            <PersonOffIcon
                                sx={{
                                    fontSize: 42,
                                    color:
                                        selectedOperation === "deactivate"
                                            ? "#fff"
                                            : "#d32f2f",
                                }}
                            />
                        }
                        title="Deactivate Graduated"
                        description="Deactivate students who have completed their graduation."
                        onClick={() => {
                            setSelectedOperation("deactivate");
                            setDeactivateDialogOpen(true);
                        }}
                    />
                </Grid>
                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                        md: 4,
                        lg: 3,
                    }}
                >
                    <AcademicOperationCard
                        selected={
                            selectedOperation === "activate"
                        }
                        icon={
                            <HowToRegIcon
                                sx={{
                                    fontSize: 42,
                                    color:
                                        selectedOperation === "activate"
                                            ? "#fff"
                                            : "#2e7d32",
                                }}
                            />
                        }
                        title="Activate Graduates"
                        description="Reactivate graduated students when required."
                        onClick={() => {

                            setActivateDialogOpen(true);
                        }}
                    />
                </Grid>
                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                        md: 4,
                        lg: 3,
                    }}
                >
                    <AcademicOperationCard
                        selected={
                            selectedOperation === "rate-limit"
                        }
                        icon={
                            <SecurityIcon
                                sx={{
                                    fontSize: 42,
                                    color:
                                        selectedOperation === "rate-limit"
                                            ? "#fff"
                                            : "#1976d2",
                                }}
                            />
                        }
                        title="Rate Limit Audit"
                        description="View all blocked requests and audit history."
                        onClick={() => {

                            setSelectedOperation("rate-limit");

                            navigate(
                                ROUTES.ADMIN_RATE_LIMIT_AUDIT
                            );

                        }}
                    />
                </Grid>

            </Grid>



        </Box>
        <CreateUserDialog
            open={openCreateDialog}
            onClose={() => {
                setOpenCreateDialog(false);
                setSelectedOperation(null);

            }}
            branches={branches}
            onUserCreated={()=>{

                setPage(0);

                fetchUsers(role);

            }}
            showSnackbar={
                showSnackbar
            }
        />
        <AppSnackbar
            open={
                snackbar.open
            }
            message={
                snackbar.message
            }
            severity={
                snackbar.severity
            }
            onClose={() =>
                setSnackbar({
                    ...snackbar,
                    open: false,
                })
            }
        />
        <BulkUploadResultDialog
            open={
                resultDialogOpen
            }
            onClose={() =>
                setResultDialogOpen(
                    false
                )
            }
            result={
                uploadResult
            }
        />
        <BulkUploadDialog
            open={openBulkDialog}
            onClose={() => {
                setOpenBulkDialog(false);
                setSelectedOperation(null);

            }}
            onSuccess={()=>{

                setPage(0);

                fetchUsers(role);

            }}
            showSnackbar={
                showSnackbar
            }
            setUploadResult={
                setUploadResult
            }

            setResultDialogOpen={
                setResultDialogOpen
            }
        />
        <PromoteStudentsDialog
            open={
                promoteDialogOpen
            }
            onClose={() => {
                setPromoteDialogOpen(false);
                setSelectedOperation(null);

            }}
            onSuccess={()=>{

                setPage(0);

                fetchUsers(role);

            }}
            showSnackbar={
                showSnackbar
            }
        />
        <DeactivateGraduatedDialog
            open={
                deactivateDialogOpen
            }
            onClose={() => {
                setDeactivateDialogOpen(false);
                setSelectedOperation(null);

            }}
            onConfirm={
                handleDeactivateGraduated
            }
        />
        <ConfirmationDialog
            open={activateDialogOpen}
            title="Activate Graduates"
            message="Are you sure you want to activate all graduated students?"
            confirmText="Activate"
            loading={activatingGraduates}
            onCancel={() => {
                setActivateDialogOpen(false);
                setSelectedOperation(null);
            }}
            onConfirm={() => {

                setActivateDialogOpen(false);

                handleActivateGraduates();

            }}
        />

    </Box>

);
}
export default AdminUsersPage;