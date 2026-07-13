import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Stack,
    Chip,
    Grid,
    Divider,
    Box,
} from "@mui/material";
import Grow from "@mui/material/Grow";
import { forwardRef } from "react";
import {
    Card,
    CardContent,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import CategoryIcon from "@mui/icons-material/Category";
import SchoolIcon from "@mui/icons-material/School";
import PublicIcon from "@mui/icons-material/Public";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LinkIcon from "@mui/icons-material/Link";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import DeleteIcon from "@mui/icons-material/Delete";
const Transition = forwardRef(function Transition(
    props,
    ref
) {
    return (
        <Grow
            ref={ref}
            {...props}
            timeout={1000}
        />
    );
});
const TopicDetailsDialog = ({
                                open,
                                onClose,
                                topic,
                                onUpdate,
                                onDelete,
                                isStudent = false,
                            })=> {

    if (!topic) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            TransitionComponent={Transition}
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    boxShadow: 24,
                },
            }}
        >
            <DialogTitle
                sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    fontWeight: 700,
                }}
            >
                Topic Details
            </DialogTitle>

            <DialogContent dividers
                           sx={{
                               py: 3,
                           }}>

                <Box>

                    <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                    >
                        <MenuBookIcon
                            sx={{
                                fontSize: 40,
                                color: "primary.main",
                            }}
                        />

                        <Typography
                            variant="h4"
                            fontWeight={700}
                        >
                            {topic.title}
                        </Typography>
                    </Stack>

                    <Divider sx={{ mb: 3 }} />
                    <Card
                        elevation={2}
                        sx={{
                            borderRadius: 3,
                            mb: 3,
                        }}
                    >
                        <CardContent>
                    <Typography
                        variant="h5"
                        fontWeight={700}
                        gutterBottom
                    >
                        Topic Information
                    </Typography>
                            <Divider sx={{ my: 3 }} />
                    <Grid container spacing={2}>

                        <Grid
                            size={{
                                xs: 12,
                                sm: 4,
                            }}
                        >
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                            >
                                <DescriptionIcon
                                    fontSize="small"
                                />

                                <Typography fontWeight={600}>
                                    Description
                                </Typography>
                            </Stack>
                        </Grid>

                        <Grid
                            size={{
                                xs: 12,
                                sm: 8,
                            }}
                        >
                            <Typography>
                                {topic.description}
                            </Typography>
                        </Grid>

                        <Grid
                            size={{
                                xs: 12,
                                sm: 4,
                            }}
                        >
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                            >
                                <CategoryIcon
                                    fontSize="small"
                                />

                                <Typography fontWeight={600}>
                                    Category
                                </Typography>
                            </Stack>
                        </Grid>

                        <Grid
                            size={{
                                xs: 12,
                                sm: 8,
                            }}
                        >
                            <Typography>
                                {topic.category}
                            </Typography>
                        </Grid>

                        <Grid
                            size={{
                                xs: 12,
                                sm: 4,
                            }}
                        >
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                            >
                                <SignalCellularAltIcon
                                    fontSize="small"
                                />

                                <Typography fontWeight={600}>
                                    Difficulty
                                </Typography>
                            </Stack>
                        </Grid>

                        <Grid
                            size={{
                                xs: 12,
                                sm: 8,
                            }}
                        >
                            <Chip
                                label={
                                    topic.difficultyLevel
                                }

                                size="small"
                            />
                        </Grid>

                        <Grid
                            size={{
                                xs: 12,
                                sm: 4,
                            }}
                        >
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                            >
                                <PublicIcon
                                    fontSize="small"
                                />

                                <Typography fontWeight={600}>
                                    Global topic
                                </Typography>
                            </Stack>
                        </Grid>

                        <Grid
                            size={{
                                xs: 12,
                                sm: 8,
                            }}
                        >
                             <Chip
                                label={
                                    topic.isGlobal
                                        ? "Yes"
                                        : "No"
                                }


                                size="small"
                             />

                        </Grid>

                    </Grid>
                        </CardContent>
                    </Card>


                    <Card
                        elevation={2}
                        sx={{
                            borderRadius: 3,
                            mb: 3,
                        }}
                    >
                        <CardContent>
                    <Typography
                        variant="h5"
                        fontWeight={700}
                        gutterBottom
                    >
                        Creator Information
                    </Typography>
                            <Divider sx={{ my: 3 }} />

                    <Grid container spacing={2}>

                        <Grid
                            size={{
                                xs: 12,
                                sm: 4,
                            }}
                        >
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                            >
                                <PersonIcon
                                    fontSize="small"
                                />

                                <Typography fontWeight={600}>
                                    Created By
                                </Typography>
                            </Stack>
                        </Grid>

                        <Grid
                            size={{
                                xs: 12,
                                sm: 8,
                            }}
                        >
                            <Typography>
                                {
                                    topic.createdBy
                                        ?.fullName
                                }
                            </Typography>
                        </Grid>

                        <Grid
                            size={{
                                xs: 12,
                                sm: 4,
                            }}
                        >
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                            >
                                <EmailIcon
                                    fontSize="small"
                                />

                                <Typography fontWeight={600}>
                                    Email
                                </Typography>
                            </Stack>
                        </Grid>

                        <Grid
                            size={{
                                xs: 12,
                                sm: 8,
                            }}
                        >
                            <Typography>
                                {
                                    topic.createdBy
                                        ?.email
                                }
                            </Typography>
                        </Grid>

                        <Grid size={4}>
                            <Grid
                                size={{
                                    xs: 12,
                                    sm: 4,
                                }}
                            >
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                >
                                    <AccessTimeIcon
                                        fontSize="small"
                                    />

                                    <Typography fontWeight={600}>
                                        CreatedAt
                                    </Typography>
                                </Stack>
                            </Grid>
                        </Grid>

                        <Grid
                            size={{
                                xs: 12,
                                sm: 8,
                            }}
                        >
                            <Typography>
                                {new Date(
                                    topic.createdAt
                                ).toLocaleString()}
                            </Typography>
                        </Grid>

                    </Grid>


                        </CardContent>
                    </Card>

                    <Card
                        elevation={2}
                        sx={{
                            borderRadius: 3,
                            mb: 3,
                        }}
                    >
                        <CardContent>
                    <Typography
                        variant="h5"
                        fontWeight={700}
                        gutterBottom
                    >

                        Applicable Branches
                    </Typography>
                            <Divider sx={{ my: 3 }} />
                    <Stack
                        direction="row"
                        spacing={1}
                        useFlexGap
                        flexWrap="wrap"
                    >
                        {topic.applicableBranches?.length >
                        0 ? (
                            topic.applicableBranches.map(
                                (branch) => (
                                    <Chip
                                        key={
                                            branch.id
                                        }
                                        label={
                                            branch.code
                                        }
                                        color="secondary"
                                    />
                                )
                            )
                        ) : (
                            <Typography>
                                No branches assigned
                            </Typography>
                        )}
                    </Stack>
                        </CardContent>
                    </Card>

                    <Card
                        elevation={2}
                        sx={{
                            borderRadius: 3,
                            mb: 3,
                        }}
                    >
                        <CardContent>
                    <Typography
                        variant="h5"
                        fontWeight={700}
                        gutterBottom
                    >
                        Resource Links
                    </Typography>
                            <Divider sx={{ my: 3 }} />
                    <Stack
                        direction="row"
                        spacing={1}
                        useFlexGap
                        flexWrap="wrap"
                    >
                        {topic.resourceLinks?.length >
                        0 ? (
                            topic.resourceLinks.map(
                                (
                                    link,
                                    index
                                ) => (
                                    <Button
                                        key={index}
                                        variant="outlined"
                                        size="small"
                                        href={link}
                                        target="_blank"
                                    >
                                        Resource{" "}
                                        {index + 1}
                                    </Button>
                                )
                            )
                        ) : (
                            <Typography>
                                No resources available
                            </Typography>
                        )}
                    </Stack>

                        </CardContent>
                    </Card>

                </Box>

            </DialogContent>

            <DialogActions>

                {!isStudent && (
                    <>
                        <Button
                            variant="contained"
                            onClick={() => onUpdate(topic)}
                        >
                            Update
                        </Button>

                        <Button
                            color="error"
                            onClick={() => onDelete(topic)}
                        >
                            Delete
                        </Button>
                    </>
                )}

                <Button onClick={onClose}>
                    Close
                </Button>

            </DialogActions>

        </Dialog>
    );
};

export default TopicDetailsDialog;