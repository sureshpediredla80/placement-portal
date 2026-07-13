import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    FormControlLabel,
    Checkbox,

    FormControl,
    InputLabel,
    Select,
    MenuItem,
    OutlinedInput,
    ListItemText,
} from "@mui/material";

import {
    useState,useEffect
} from "react";

import {
    createTopic,updateTopic,
} from "../api/topicApi.jsx";
import { getBranches } from "../../branches/api/branchApi";

const CreateTopicDialog = ({
                               open,
                               onClose,
                                onSuccess,
                                onError,
                                topic=null,
                           }) => {


    const [formData,
        setFormData] =
        useState({
            title: "",
            description: "",
            category: "",
            isGlobal: true,
            applicableBranchIds:
                [],
            difficultyLevel:
                "",
            resourceLinks:
                [],
        });
    const [branches, setBranches] = useState([]);
    const [resourceLinksInput, setResourceLinksInput] = useState("");
    const isEditMode = !!topic;
    useEffect(() => {

        if (topic) {

            setFormData({
                title: topic.title || "",
                description: topic.description || "",
                category: topic.category || "",
                isGlobal: topic.isGlobal,
                applicableBranchIds:
                    topic.applicableBranches?.map(
                        (b) => b.id
                    ) || [],
                difficultyLevel:
                    topic.difficultyLevel || "",
                resourceLinks:
                    topic.resourceLinks || [],
            });

            setResourceLinksInput(
                topic.resourceLinks?.join("\n") || ""
            );

        } else {

            setFormData({
                title: "",
                description: "",
                category: "",
                isGlobal: true,
                applicableBranchIds: [],
                difficultyLevel: "",
                resourceLinks: [],
            });

            setResourceLinksInput("");
        }

    }, [topic, open]);

    const handleChange =
        (field, value) => {

            setFormData(
                (prev) => ({
                    ...prev,
                    [field]: value,
                })
            );
        };
    useEffect(() => {
        if (!open) return;

        const fetchBranches = async () => {
            try {
                const data = await getBranches();
                setBranches(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchBranches();
    }, [open]);

    const handleSubmit = async () => {
        try {

            const payload = {
                ...formData,
                resourceLinks: resourceLinksInput
                    .split("\n")
                    .map((link) => link.trim())
                    .filter((link) => link !== ""),
            };

            if (isEditMode) {

                await updateTopic(
                    topic.id,
                    payload
                );

            } else {

                await createTopic(
                    payload
                );

            }

            setFormData({
                title: "",
                description: "",
                category: "",
                isGlobal: true,
                applicableBranchIds: [],
                difficultyLevel: "",
                resourceLinks: [],
            });

            setResourceLinksInput("");
            onSuccess(
                isEditMode
                    ? "Topic updated successfully"
                    : "Topic created successfully"
            );

        } catch (error) {

            onError(
                error?.response?.data?.message ||
                "Failed to create topic"
            );

        }
    };


    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>
                {isEditMode
                    ? "Update Topic"
                    : "Create Topic"}
            </DialogTitle>

            <DialogContent>

                <Grid
                    container
                    spacing={2}
                    sx={{ mt: 1 }}
                >

                    <Grid size={12}>
                        <TextField
                            fullWidth
                            label="Title"
                            value={
                                formData.title
                            }
                            onChange={(e) =>
                                handleChange(
                                    "title",
                                    e.target.value
                                )
                            }
                        />
                    </Grid>

                    <Grid size={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Description"
                            value={
                                formData.description
                            }
                            onChange={(e) =>
                                handleChange(
                                    "description",
                                    e.target.value
                                )
                            }
                        />
                    </Grid>

                    <Grid size={6}>
                        <TextField
                            fullWidth
                            label="Category"
                            value={
                                formData.category
                            }
                            onChange={(e) =>
                                handleChange(
                                    "category",
                                    e.target.value
                                )
                            }
                        />
                    </Grid>

                    <Grid size={6}>
                        <TextField
                            fullWidth
                            label="Difficulty Level"
                            value={
                                formData
                                    .difficultyLevel
                            }
                            onChange={(e) =>
                                handleChange(
                                    "difficultyLevel",
                                    e.target.value
                                )
                            }
                        />
                    </Grid>
                    <Grid size={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Resource Links"
                            placeholder={`https://youtube.com/java
https://docs.oracle.com/java
https://roadmap.sh/java`}
                            value={resourceLinksInput}
                            onChange={(e) =>
                                setResourceLinksInput(
                                    e.target.value
                                )
                            }
                        />
                    </Grid>
                    {!formData.isGlobal && (
                        <Grid size={12}>
                            <FormControl fullWidth>

                                <InputLabel>
                                    Applicable Branches
                                </InputLabel>

                                <Select
                                    multiple
                                    value={formData.applicableBranchIds}
                                    onChange={(e) =>
                                        handleChange(
                                            "applicableBranchIds",
                                            e.target.value
                                        )
                                    }
                                    input={
                                        <OutlinedInput label="Applicable Branches" />
                                    }
                                    renderValue={(selected) =>
                                        branches
                                            .filter((branch) =>
                                                selected.includes(branch.id)
                                            )
                                            .map((branch) => branch.name)
                                            .join(", ")
                                    }
                                >
                                    {branches.map((branch) => (
                                        <MenuItem
                                            key={branch.id}
                                            value={branch.id}
                                        >
                                            <Checkbox
                                                checked={formData.applicableBranchIds.includes(
                                                    branch.id
                                                )}
                                            />

                                            <ListItemText
                                                primary={branch.name}
                                            />
                                        </MenuItem>
                                    ))}
                                </Select>

                            </FormControl>
                        </Grid>
                    )}

                    <Grid size={12}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.isGlobal}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            isGlobal: e.target.checked,
                                            applicableBranchIds: e.target.checked
                                                ? []
                                                : prev.applicableBranchIds,
                                        }))
                                    }
                                />
                            }
                            label="Global Topic"
                        />
                    </Grid>

                </Grid>

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                >
                    {isEditMode
                        ? "Update"
                        : "Create"}
                </Button>

            </DialogActions>

        </Dialog>

    );
};

export default CreateTopicDialog;