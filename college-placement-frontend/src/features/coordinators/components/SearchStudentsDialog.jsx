import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Stack,
} from "@mui/material";

import { useForm } from "react-hook-form";
import AppFormField from "../../../components/common/AppFormField";
import { useEffect, useState } from "react";
import {
    Autocomplete,
    TextField,
} from "@mui/material";


import { getBranches,getSkills } from "../api/coordinatorApi";

const SearchStudentsDialog = ({
                                  open,
                                  onClose,
                                   onSearch,
                              }) => {
    const onSubmit = async(data) => {
        const filters = {
            branchId: data.branchId,

            year: data.year
                ? Number(data.year)
                : null,

            minCgpa: data.minCgpa
                ? Number(data.minCgpa)
                : null,

            skillIds: data.skillIds,
        };



        await onSearch(filters, 0);

        onClose();
    };
    const {
        control,
        handleSubmit,
        setValue,
    } = useForm({
        defaultValues: {
            branchId: "",
            year: "",
            minCgpa: "",
            skillIds: [],
        },
    });
    const [branches, setBranches] =
        useState([]);
    const [skills, setSkills] =
        useState([]);
    useEffect(() => {
        const fetchBranches =
            async () => {
                try {
                    const data =
                        await getBranches();

                    setBranches(data);
                } catch (error) {
                    console.error(error);
                }
            };

        fetchBranches();
    }, []);
    useEffect(() => {
        const fetchSkills =
            async () => {
                try {
                    const data =
                        await getSkills();

                    setSkills(data);
                } catch (error) {
                    console.error(error);
                }
            };

        fetchSkills();
    }, []);
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                Search Students
            </DialogTitle>

            <DialogContent>
                <Stack spacing={2}>
                    <Autocomplete
                        options={branches}
                        getOptionLabel={(option) =>
                            option.name
                        }
                        onChange={(_, value) => {
                            setValue(
                                "branchId",
                                value?.id || ""
                            );
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Branch"
                            />
                        )}
                    />
                    <AppFormField
                        control={control}
                        name="year"
                        label="Year"
                    />

                    <AppFormField
                        control={control}
                        name="minCgpa"
                        label="Minimum CGPA"
                    />

                    <Autocomplete
                        multiple
                        options={skills}
                        getOptionLabel={(option) =>
                            option.name
                        }
                        onChange={(_, value) => {
                            setValue(
                                "skillIds",
                                value.map(
                                    (skill) =>
                                        skill.id
                                )
                            );
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Skills"
                            />
                        )}
                    />
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={onClose}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSubmit(onSubmit)}
                >
                    Search
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SearchStudentsDialog;