import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";

import { Formik } from "formik";

import NewsForm
    from "../forms/NewsForm";

import {
    newsSchema,
} from "../validations/newsSchema";

import {
    createNews,
} from "../api/newsApi";

const CreateNewsDialog = ({
                              open,
                              onClose,
                              onSuccess,
                              onError,
                          }) => {

    const initialValues = {
        title: "",
        description: "",
        category: "",
    };

    const handleSubmit =
        async (
            values,
            {
                resetForm,
                setSubmitting,
            }
        ) => {

            try {

                await createNews(
                    values
                );

                resetForm();

                onClose();

                onSuccess();

            } catch (error) {

                console.error(
                    error
                );

                onError();

            } finally {

                setSubmitting(
                    false
                );
            }
        };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                Create News
            </DialogTitle>

            <Formik
                initialValues={
                    initialValues
                }
                validationSchema={
                    newsSchema
                }
                onSubmit={
                    handleSubmit
                }
            >
                {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleSubmit,
                      isSubmitting,
                  }) => (

                    <form
                        onSubmit={
                            handleSubmit
                        }
                    >

                        <DialogContent>

                            <NewsForm
                                values={
                                    values
                                }
                                errors={
                                    errors
                                }
                                touched={
                                    touched
                                }
                                handleChange={
                                    handleChange
                                }
                            />

                        </DialogContent>

                        <DialogActions>

                            <Button
                                onClick={
                                    onClose
                                }
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                disabled={
                                    isSubmitting
                                }
                            >
                                Create
                            </Button>

                        </DialogActions>

                    </form>
                )}
            </Formik>
        </Dialog>
    );
};

export default CreateNewsDialog;