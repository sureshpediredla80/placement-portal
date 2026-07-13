import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";

const SummaryCard = ({
                         title,
                         value,
                         color,
                     }) => (
    <Paper
        elevation={2}
        sx={{
            p: 3,
            borderRadius: 3,
            textAlign: "center",
            height: "100%",
        }}
    >
        <Typography
            variant="body2"
            color="text.secondary"
        >
            {title}
        </Typography>

        <Typography
            variant="h4"
            fontWeight={700}
            color={color}
            mt={1}
        >
            {value}
        </Typography>
    </Paper>
);

const BulkUploadResultDialog = ({
                                    open,
                                    onClose,
                                    result,
                                }) => {

    if (!result) return null;

    return (

        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >

            <DialogTitle
                sx={{
                    fontWeight: 700,
                }}
            >
                Bulk Upload Summary
            </DialogTitle>

            <DialogContent>

                <Grid
                    container
                    spacing={2}
                    mb={3}
                >

                    <Grid size={{ xs: 12, md: 4 }}>

                        <SummaryCard
                            title="Total Rows"
                            value={result.totalRows}
                            color="primary.main"
                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>

                        <SummaryCard
                            title="Uploaded Successfully"
                            value={result.successCount}
                            color="success.main"
                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>

                        <SummaryCard
                            title="Failed"
                            value={result.failureCount}
                            color="error.main"
                        />

                    </Grid>

                </Grid>

                <Divider sx={{ mb: 3 }} />

                {

                    result.failureCount === 0 ?

                        (

                            <Alert
                                severity="success"
                                sx={{
                                    borderRadius: 2,
                                }}
                            >
                                All students were uploaded successfully.
                            </Alert>

                        )

                        :

                        (

                            <>

                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                    mb={2}
                                >
                                    Failed Records
                                </Typography>

                                <TableContainer
                                    component={Paper}
                                    sx={{
                                        maxHeight: 350,
                                        borderRadius: 2,
                                    }}
                                >

                                    <Table stickyHeader>

                                        <TableHead>

                                            <TableRow>

                                                <TableCell
                                                    sx={{
                                                        fontWeight: 700,
                                                        bgcolor: "#d32f2f",
                                                        color: "#fff",
                                                    }}
                                                >
                                                    Excel Row
                                                </TableCell>

                                                <TableCell
                                                    sx={{
                                                        fontWeight: 700,
                                                        bgcolor: "#d32f2f",
                                                        color: "#fff",
                                                    }}
                                                >
                                                    Failure Reason
                                                </TableCell>

                                            </TableRow>

                                        </TableHead>

                                        <TableBody>

                                            {
                                                result.failures.map(
                                                    (
                                                        item,
                                                        index
                                                    ) => (

                                                        <TableRow
                                                            key={index}
                                                            hover
                                                        >

                                                            <TableCell
                                                                width={120}
                                                            >
                                                                {item.rowNumber}
                                                            </TableCell>

                                                            <TableCell>
                                                                {item.reason}
                                                            </TableCell>

                                                        </TableRow>

                                                    )
                                                )
                                            }

                                        </TableBody>

                                    </Table>

                                </TableContainer>

                            </>

                        )

                }

            </DialogContent>

            <DialogActions
                sx={{
                    px: 3,
                    pb: 3,
                }}
            >

                <Box flex={1} />

                <Button
                    variant="contained"
                    onClick={onClose}
                >
                    Close
                </Button>

            </DialogActions>

        </Dialog>

    );

};

export default BulkUploadResultDialog;