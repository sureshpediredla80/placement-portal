import {
    Box,
    Typography,
    TextField,
    InputAdornment,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

import {
    useEffect,
    useState,
} from "react";

import CoordinatorsTable from "../components/CoordinatorsTable";

import {
    getCoordinators,
} from "../api/adminApi";

const AdminCoordinatorsPage = () => {

    const [
        coordinators,
        setCoordinators,
    ] = useState([]);

    const [
        filteredCoordinators,
        setFilteredCoordinators,
    ] = useState([]);

    const [
        search,
        setSearch,
    ] = useState("");

    useEffect(() => {

        fetchCoordinators();

    }, []);

    const fetchCoordinators =
        async () => {

            try {

                const data =
                    await getCoordinators();

                const content =
                    data?.content || [];

                setCoordinators(
                    content
                );

                setFilteredCoordinators(
                    content
                );

            } catch (error) {

                console.error(
                    error
                );

            }
        };

    const handleSearch =
        (value) => {

            setSearch(value);

            const filtered =
                coordinators.filter(
                    (
                        coordinator
                    ) =>
                        coordinator.user.fullName
                            .toLowerCase()
                            .includes(
                                value.toLowerCase()
                            ) ||
                        coordinator.user.email
                            .toLowerCase()
                            .includes(
                                value.toLowerCase()
                            )
                );

            setFilteredCoordinators(
                filtered
            );
        };

    return (
        <Box>

            <Typography
                variant="h4"
                fontWeight={700}
                mb={3}
            >
                Coordinators
            </Typography>

            <Box
                sx={{
                    mb: 3,
                    display: "flex",
                    justifyContent:
                        "center",
                }}
            >

                <TextField
                    placeholder="Search By Email "
                    value={search}
                    onChange={(
                        e
                    ) =>
                        handleSearch(
                            e.target
                                .value
                        )
                    }
                    sx={{
                        width: 750,

                        "& .MuiOutlinedInput-root": {
                            borderRadius: "40px",
                            backgroundColor: "#fff",
                            boxShadow:
                                "0px 4px 12px rgba(0,0,0,0.15)",
                            height: 70,
                        },

                        "& fieldset": {
                            border: "none",
                        },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />

            </Box>

            <CoordinatorsTable
                coordinators={
                    filteredCoordinators
                }
            />

        </Box>
    );
};

export default AdminCoordinatorsPage;