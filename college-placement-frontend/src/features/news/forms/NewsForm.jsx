import {
    TextField,
    Stack,
} from "@mui/material";

const NewsForm = ({
                      values,
                      errors,
                      touched,
                      handleChange,
                  }) => {

    return (
        <Stack spacing={2}>

            <TextField
                label="Title"
                name="title"
                value={values.title}
                onChange={
                    handleChange
                }
                error={
                    touched.title &&
                    Boolean(
                        errors.title
                    )
                }
                helperText={
                    touched.title &&
                    errors.title
                }
                fullWidth
            />

            <TextField
                label="Description"
                name="description"
                value={
                    values.description
                }
                onChange={
                    handleChange
                }
                error={
                    touched.description &&
                    Boolean(
                        errors.description
                    )
                }
                helperText={
                    touched.description &&
                    errors.description
                }
                multiline
                rows={4}
                fullWidth
            />

            <TextField
                label="Category"
                name="category"
                value={
                    values.category
                }
                onChange={
                    handleChange
                }
                error={
                    touched.category &&
                    Boolean(
                        errors.category
                    )
                }
                helperText={
                    touched.category &&
                    errors.category
                }
                fullWidth
            />

        </Stack>
    );
};

export default NewsForm;