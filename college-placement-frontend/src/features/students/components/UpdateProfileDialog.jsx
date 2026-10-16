import { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Stack,
    Divider,
    Typography,
    Grid,
    Select,
    MenuItem,

    FormControl,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useController } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { updateProfile } from "../api/studentApi";
import AppFormField from "../../../components/common/AppFormField";

const schema = yup.object({

    gender: yup
        .string()
        .nullable()
        .transform(v => v === "" ? null : v),


    dateOfBirth: yup
        .string()
        .nullable()
        .transform(v => v === "" ? null : v),


    personalEmail: yup
        .string()
        .email("Invalid email")
        .nullable()
        .transform(
            value => value === "" ? null : value
        ),


    whatsappNumber: yup
        .string()
        .required("WhatsApp number is required"),


    parentContactNumber: yup
        .string()
        .nullable()
        .transform(v => v === "" ? null : v),


    parentEmail: yup
        .string()
        .email("Invalid email")
        .nullable()
        .transform(
            value => value === "" ? null : value
        ),


    residenceType: yup
        .string()
        .nullable()
        .transform(v => v === "" ? null : v),


    aadhaarNumber: yup
        .string()
        .nullable()
        .transform(v => v === "" ? null : v),

    panNumber: yup
        .string()
        .nullable()
        .transform(v => v === "" ? null : v),

    residentialAddress: yup
        .string()
        .nullable()
        .transform(v => v === "" ? null : v),


    bloodGroup: yup
        .string()
        .nullable()
        .transform(v => v === "" ? null : v),


    githubLink: yup
        .string()
        .nullable()
        .transform(v=>v===""?null:v)
        .url("Invalid Github URL"),


    linkedinLink: yup
        .string()
        .nullable()
        .transform(v=>v===""?null:v)
        .url("Invalid LinkedIn URL"),


    resumeUrl: yup
        .string()
        .nullable()
        .transform(v=>v===""?null:v)
        .url("Invalid Resume URL")

});
const genderOptions = [
    "MALE",
    "FEMALE",
    "OTHER"
];


const residenceOptions = [
    "DAY_SCHOLAR",
    "HOSTELLER"
];


const bloodGroupOptions = [
    "A_POSITIVE",
    "A_NEGATIVE",
    "B_POSITIVE",
    "B_NEGATIVE",
    "AB_POSITIVE",
    "AB_NEGATIVE",
    "O_POSITIVE",
    "O_NEGATIVE"
];

const AppSelectField = ({
                            control,
                            name,
                            label,
                            options
                        }) => {

    const {
        field,
        fieldState
    } = useController({
        name,
        control
    });

    return (
        <FormControl
            fullWidth
            error={!!fieldState.error}
            size="small"
        >

            <Select
                {...field}
                displayEmpty
                size="medium"
                renderValue={(selected) => {

                    if (!selected) {
                        return (
                            <span style={{ color: "#888" }}>
                                {label}
                            </span>
                        );
                    }

                    return selected.replaceAll("_", " ");
                }}
            >



                {options.map(option => (

                    <MenuItem
                        key={option}
                        value={option}
                    >
                        {option.replaceAll("_", " ")}
                    </MenuItem>

                ))}

            </Select>
            {fieldState.error && (
                <Typography
                    variant="caption"
                    color="error"
                    sx={{ ml: 2, mt: 0.5 }}
                >
                    {fieldState.error.message}
                </Typography>
            )}

        </FormControl>
    );
};


const UpdateProfileDialog = ({
                                 open,
                                 onClose,
                                 student,
                                 onSuccess,
                                 showSnackbar,
                             }) => {
    const [isUpdating, setIsUpdating] = useState(false);

    const handleCurrentLocation = () => {

        if (!navigator.geolocation) {
            showSnackbar(
                "Geolocation is not supported.",
                "error"
            );
            return;
        }

        navigator.geolocation.getCurrentPosition(

            async (position) => {

                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                try {

                    const response = await fetch(

                        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`

                    );

                    const data = await response.json();

                    setValue(
                        "residentialAddress",
                        data.display_name || ""
                    );

                } catch (error) {

                    showSnackbar(
                        "Unable to fetch address.",
                        "error"
                    );

                }

            },

            () => {

                showSnackbar(
                    "Unable to access location.",
                    "error"
                );

            }

        );

    };
    const {
        control,
        handleSubmit,
        reset,
        setValue,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues:{


            gender:"",

            dateOfBirth:"",

            personalEmail:"",

            whatsappNumber:"",

            parentContactNumber:"",

            parentEmail:"",

            residenceType:"",

            aadhaarNumber:"",

            panNumber:"",

            residentialAddress:"",

            bloodGroup:"",

            githubLink:"",

            linkedinLink:"",

            resumeUrl:""

        },
    });



    useEffect(() => {
        if (student) {

            reset({

                gender:student.gender || "",

                dateOfBirth:student.dateOfBirth || "",

                personalEmail:student.personalEmail || "",

                whatsappNumber:student.whatsappNumber ?? "",

                parentContactNumber:
                    student.parentContactNumber || "",

                parentEmail:
                    student.parentEmail || "",


                residenceType:
                    student.residenceType || "",


                aadhaarNumber:
                    student.aadhaarNumber || "",


                panNumber:
                    student.panNumber || "",


                residentialAddress:
                    student.residentialAddress || "",


                bloodGroup:
                    student.bloodGroup || "",


                githubLink:
                    student.githubLink || "",


                linkedinLink:
                    student.linkedinLink || "",


                resumeUrl:
                    student.resumeUrl || ""

            });
        }
    }, [student, reset]);

    const onSubmit = async (data) => {
        try {
            setIsUpdating(true);

            const cleanedData = Object.fromEntries(
                Object.entries(data).filter(
                    ([_, value]) =>
                        value !== "" &&
                        value !== null &&
                        value !== undefined
                )
            );

            await updateProfile(cleanedData);

            if (onSuccess) {
                await onSuccess();
            }

            showSnackbar(
                "Profile updated successfully.",
                "success"
            );

            onClose();
        }catch (error) {
            console.error("Profile update failed:", error);

            showSnackbar(
                error.response?.data?.message ||
                error.message ||
                "Failed to update profile.",
                "error"
            );
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="lg"
            PaperProps={{
                sx:{
                    borderRadius:4,
                    maxHeight:"90vh"
                }
            }}
        >
            <DialogTitle
                sx={{
                    fontWeight: 700,
                    borderBottom: "1px solid #eee"
                }}
            >
                Update Profile
            </DialogTitle>


            <DialogContent>

                <Stack spacing={3} sx={{mt:2}}>


                    {/* Personal */}

                    <Typography variant="h6">
                        Personal Information
                    </Typography>

                    <Divider/>


                    <Grid container spacing={2}>

                        <Grid item xs={12} sm={6}>
                            <AppSelectField
                                control={control}
                                name="gender"
                                label="Gender"
                                options={genderOptions}
                            />
                        </Grid>


                        <Grid item xs={12} sm={6}>
                            <AppFormField
                                control={control}
                                name="dateOfBirth"

                                type="date"
                            />
                        </Grid>


                        <Grid item xs={12} sm={6}>
                            <AppSelectField
                                control={control}
                                name="bloodGroup"
                                label="Blood Group"
                                options={bloodGroupOptions}
                            />
                        </Grid>


                        <Grid item xs={20} sm={10}>
                            <AppSelectField
                                control={control}
                                name="residenceType"
                                label="Residence Type"
                                options={residenceOptions}
                            />
                        </Grid>

                    </Grid>



                    {/* Contact */}

                    <Typography variant="h6">
                        Contact Information
                    </Typography>

                    <Divider/>


                    <Grid container spacing={2}>


                        <Grid item xs={12} sm={6}>
                            <AppFormField
                                control={control}
                                name="whatsappNumber"
                                label="WhatsApp Number"
                            />
                        </Grid>


                        <Grid item xs={12} sm={6}>
                            <AppFormField
                                control={control}
                                name="personalEmail"
                                label="Personal Email"
                            />
                        </Grid>


                        <Grid item xs={12} sm={6}>
                            <AppFormField
                                control={control}
                                name="parentContactNumber"
                                label="Parent Contact Number"
                            />
                        </Grid>


                        <Grid item xs={12} sm={6}>
                            <AppFormField
                                control={control}
                                name="parentEmail"
                                label="Parent Email"
                            />
                        </Grid>


                    </Grid>



                    {/* Identity */}


                    <Typography variant="h6">
                        Identity Details
                    </Typography>

                    <Divider/>


                    <Grid container spacing={2}>


                        <Grid item xs={12} sm={6}>
                            <AppFormField
                                control={control}
                                name="aadhaarNumber"
                                label="Aadhaar Number"
                            />
                        </Grid>



                        <Grid item xs={12} sm={6}>
                            <AppFormField
                                control={control}
                                name="panNumber"
                                label="PAN Number"
                            />
                        </Grid>


                        <Grid item xs={12}>
                            <AppFormField
                                control={control}
                                name="residentialAddress"
                                label="Residential Address"
                                multiline
                                rows={5}
                                placeholder="House No, Street, Area, City, State, Pincode"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="outlined"
                                color="primary"
                                sx={{
                                    textTransform: "none",
                                    borderRadius: 2
                                }}
                                startIcon={<LocationOnIcon />}
                                onClick={handleCurrentLocation}
                            >
                                Use Current Location
                            </Button>
                        </Grid>

                    </Grid>



                    {/* Professional */}

                    <Typography variant="h6">
                        Professional Links
                    </Typography>

                    <Divider/>


                    <Grid container spacing={2}>


                        <Grid item xs={12}>
                            <AppFormField
                                control={control}
                                name="githubLink"
                                label="Github URL"
                            />
                        </Grid>



                        <Grid item xs={12}>
                            <AppFormField
                                control={control}
                                name="linkedinLink"
                                label="LinkedIn URL"
                            />
                        </Grid>


                        <Grid item xs={12}>
                            <AppFormField
                                control={control}
                                name="resumeUrl"
                                label="Resume URL"
                            />
                        </Grid>


                    </Grid>


                </Stack>

            </DialogContent>


            <DialogActions>
                <Button onClick={onClose}>
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSubmit(onSubmit)}
                    disabled={isUpdating}
                >
                    {isUpdating ? "Updating..." : "Update"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateProfileDialog;