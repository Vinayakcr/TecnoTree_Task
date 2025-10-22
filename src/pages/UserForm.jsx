import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  IconButton,
  Paper,
  Fade,
} from "@mui/material";
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "@mui/material/styles";
import useApi from "../utils/useApi";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  firstName: yup.string().min(1).max(50).required("First name is required"),
  lastName: yup.string().min(1).max(50).required("Last name is required"),
  fathersName: yup.string().min(1).max(50).required("Father's name is required"),
  mothersName: yup.string().min(1).max(50).required("Mother's name is required"),
  mobileNumber: yup.string().required("Mobile number is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  gender: yup.string().required("Gender is required"),
  dateOfBirth: yup.string().required("Date of birth is required"),
  address: yup.string().required("Address is required"),
  education: yup.array().of(
    yup.object().shape({
      collegeName: yup.string().min(1).max(50).required("College name is required"),
      location: yup.string().min(1).max(50).required("Location is required"),
      startDate: yup.string().required("Start date is required"),
      endDate: yup
        .string()
        .required("End date is required")
        .test("end-after-start", "End date must be after start date", function (value) {
          const { startDate } = this.parent;
          return !startDate || !value || new Date(value) >= new Date(startDate);
        }),
    })
  ),
  experience: yup.array().of(
    yup.object().shape({
      companyName: yup.string().min(1).max(50).required("Company name is required"),
      location: yup.string().min(1).max(50).required("Location is required"),
      role: yup.string().min(1).max(50).required("Role is required"),
      description: yup.string().max(250, "Max 250 characters allowed"),
      startDate: yup.string().required("Start date is required"),
      endDate: yup
        .string()
        .required("End date is required")
        .test("end-after-start", "End date must be after start date", function (value) {
          const { startDate } = this.parent;
          return !startDate || !value || new Date(value) >= new Date(startDate);
        }),
    })
  ),
});

const UserForm = ({ onSuccess, initialValues, mode = "create", userId }) => {
  const theme = useTheme();
  const { get, post, put } = useApi();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues || {
      firstName: "",
      lastName: "",
      fathersName: "",
      mothersName: "",
      mobileNumber: "",
      email: "",
      gender: "",
      dateOfBirth: "",
      address: "",
      education: [{ collegeName: "", location: "", startDate: "", endDate: "" }],
      experience: [
        { companyName: "", location: "", role: "", description: "", startDate: "", endDate: "" },
      ],
    },
    resolver: yupResolver(schema),
  });

  const { fields: educationFields, append: addEducation, remove: removeEducation } =
    useFieldArray({ control, name: "education" });
  const { fields: experienceFields, append: addExperience, remove: removeExperience } =
    useFieldArray({ control, name: "experience" });

  const educationValues = useWatch({ control, name: "education" }) || [];
  const experienceValues = useWatch({ control, name: "experience" }) || [];
  const [mounted, setMounted] = useState(false);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    if (initialValues) reset(initialValues);
    setMounted(true);
  }, [initialValues, reset]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await get("/api/roles");
        setRoles(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch roles");
      }
    };
    fetchRoles();
  }, []);

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        ...data,
        dateOfBirth: data.dateOfBirth,
        education: data.education.map((e) => ({ ...e, startDate: e.startDate, endDate: e.endDate })),
        experience: data.experience.map((exp) => ({ ...exp, startDate: exp.startDate, endDate: exp.endDate })),
      };

      if (mode === "edit") {
        await put(`/api/users/${userId}`, formattedData);
        toast.success("User updated successfully!");
        setTimeout(() => navigate(`/users`), 2000);
      } else {
        await post("/api/users", formattedData);
        toast.success("User saved successfully!");
        setTimeout(() => navigate(`/users`), 2000);
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Error saving user. Please check inputs!");
    }
  };

  const onError = () => {
    toast.warn("Please fill all required fields correctly!");
  };

  const textFieldSx = {
    minWidth: 280,
    "& .MuiOutlinedInput-root": {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
      borderColor: theme.palette.primary.light,
      "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main },
    },
    "& label.Mui-focused": { color: theme.palette.primary.main },
    "& .MuiFormHelperText-root": { color: theme.palette.text.primary },
  };

  const iconButtonSx = {
    color: theme.palette.primary.main,
    "&:hover": { color: theme.palette.secondary.main, transform: "scale(1.2)" },
    transition: "all 0.3s",
  };

  const formatDateForInput = (value) => (value ? value.split("T")[0] : "");

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.default,
        width: "94vw",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        pt: 4,
        pb: 8,
        px: 3,
        overflowX: "hidden",
      }}
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <Fade in={mounted} timeout={600}>
        <Paper
          component="form"
          onSubmit={handleSubmit(onSubmit, onError)}
          sx={{
            width: "100%",
            maxWidth: 900,
            p: 4,
            borderRadius: 2,
            boxShadow: `0 8px 24px ${theme.palette.primary.main}33`,
            bgcolor: theme.palette.background.paper,
            overflowY: "auto",
            maxHeight: "95vh",
            border: `1.5px solid ${theme.palette.primary.light}80`,
          }}
          noValidate
        >
          <Typography
            variant="h4"
            textAlign="center"
            mb={4}
            fontWeight={700}
            sx={{ color: theme.palette.text.primary, fontFamily: "Montserrat, sans-serif" }}
          >
            {mode === "edit" ? "Edit User" : "Add New User"}
          </Typography>

          <Grid container spacing={2} mb={3} wrap="wrap">
            {[
              { name: "firstName", label: "First Name" },
              { name: "lastName", label: "Last Name" },
              { name: "fathersName", label: "Father's Name" },
              { name: "mothersName", label: "Mother's Name" },
              { name: "mobileNumber", label: "Mobile Number" },
              { name: "email", label: "Email", type: "email" },
              { name: "dateOfBirth", label: "Date of Birth", type: "date" },
              { name: "address", label: "Address" },
            ].map(({ name, label, type }) => (
              <Grid xs={12} sm={6} key={name} sx={{ minWidth: 280 }}>
                <Controller
                  name={name}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={label}
                      type={type || "text"}
                      fullWidth
                      size="small"
                      InputLabelProps={type === "date" ? { shrink: true } : undefined}
                      value={type === "date" ? formatDateForInput(field.value) : field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      error={!!errors[name]}
                      helperText={errors[name]?.message}
                      sx={textFieldSx}
                    />
                  )}
                />
              </Grid>
            ))}
            <Grid xs={12} sm={6} sx={{ minWidth: 280 }}>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Gender"
                    fullWidth
                    size="small"
                    error={!!errors.gender}
                    helperText={errors.gender?.message}
                    sx={textFieldSx}
                  >
                    <MenuItem value="">
                      <em>Select Gender</em>
                    </MenuItem>
                    <MenuItem value="MALE">Male</MenuItem>
                    <MenuItem value="FEMALE">Female</MenuItem>
                    <MenuItem value="OTHER">Other</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
          </Grid>

          <Typography variant="h6" fontWeight={600} mb={2} sx={{ color: theme.palette.text.primary }}>
            Education
          </Typography>
          {educationFields.map((item, index) => {
            const startDate = educationValues[index]?.startDate || "";
            return (
              <Paper key={item.id} variant="outlined" sx={{ p: 2, mb: 2, bgcolor: theme.palette.background.default, borderColor: theme.palette.primary.light }}>
                <Grid container spacing={2} alignItems="center" wrap="wrap">
                  {["collegeName", "location"].map((fieldName) => (
                    <Grid item xs={12} sm={6} key={fieldName} sx={{ minWidth: 280 }}>
                      <Controller
                        name={`education.${index}.${fieldName}`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label={fieldName === "collegeName" ? "College Name" : "Location"}
                            fullWidth
                            size="small"
                            error={!!errors.education?.[index]?.[fieldName]}
                            helperText={errors.education?.[index]?.[fieldName]?.message}
                            sx={textFieldSx}
                          />
                        )}
                      />
                    </Grid>
                  ))}
                  <Grid xs={12} sm={6} sx={{ minWidth: 280 }}>
                    <Controller
                      name={`education.${index}.startDate`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Start Date"
                          type="date"
                          size="small"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          value={formatDateForInput(field.value)}
                          onChange={(e) => field.onChange(e.target.value)}
                          error={!!errors.education?.[index]?.startDate}
                          helperText={errors.education?.[index]?.startDate?.message}
                          sx={textFieldSx}
                        />
                      )}
                    />
                  </Grid>
                  <Grid xs={12} sm={6} sx={{ minWidth: 280 }}>
                    <Controller
                      name={`education.${index}.endDate`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="End Date"
                          type="date"
                          size="small"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          inputProps={{ min: startDate || undefined }}
                          value={formatDateForInput(field.value)}
                          onChange={(e) => field.onChange(e.target.value)}
                          error={!!errors.education?.[index]?.endDate}
                          helperText={errors.education?.[index]?.endDate?.message}
                          sx={textFieldSx}
                        />
                      )}
                    />
                  </Grid>
                  <Grid xs={12} sx={{ textAlign: "right" }}>
                    <IconButton color="error" onClick={() => removeEducation(index)} sx={iconButtonSx}>
                      <RemoveCircle />
                    </IconButton>
                  </Grid>
                </Grid>
              </Paper>
            );
          })}
          <Button
            variant="outlined"
            startIcon={<AddCircle />}
            onClick={() => addEducation({ collegeName: "", location: "", startDate: "", endDate: "" })}
            sx={{ mb: 3, borderColor: theme.palette.primary.light, color: theme.palette.text.primary, fontWeight: 600, "&:hover": { borderColor: theme.palette.primary.main, color: theme.palette.secondary.main } }}
          >
            Add Education
          </Button>

          <Typography variant="h6" fontWeight={600} mb={2} sx={{ color: theme.palette.text.primary }}>
            Experience
          </Typography>
          {experienceFields.map((item, index) => {
            const startDate = experienceValues[index]?.startDate || "";
            return (
              <Paper key={item.id} variant="outlined" sx={{ p: 2, mb: 2, bgcolor: theme.palette.background.default, borderColor: theme.palette.primary.light }}>
                <Grid container spacing={2} alignItems="center" wrap="wrap">
                  {["companyName", "location", "description"].map((fieldName) => (
                    <Grid item xs={12} sm={6} key={fieldName} sx={{ minWidth: 280 }}>
                      <Controller
                        name={`experience.${index}.${fieldName}`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label={fieldName === "companyName" ? "Company Name" : fieldName === "location" ? "Location" : "Description"}
                            multiline={fieldName === "description"}
                            rows={fieldName === "description" ? 3 : 1}
                            fullWidth
                            size="small"
                            error={!!errors.experience?.[index]?.[fieldName]}
                            helperText={errors.experience?.[index]?.[fieldName]?.message}
                            sx={textFieldSx}
                          />
                        )}
                      />
                    </Grid>
                  ))}
                  <Grid xs={12} sm={6} sx={{ minWidth: 280 }}>
                    <Controller
                      name={`experience.${index}.role`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          label="Role"
                          fullWidth
                          size="small"
                          error={!!errors.experience?.[index]?.role}
                          helperText={errors.experience?.[index]?.role?.message}
                          sx={textFieldSx}
                        >
                          <MenuItem value="">
                            <em>Select Role</em>
                          </MenuItem>
                          {roles.map((role) => (
                            <MenuItem key={role.id} value={role.roleName}>
                              {role.roleName}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>
                  <Grid xs={12} sm={6} sx={{ minWidth: 280 }}>
                    <Controller
                      name={`experience.${index}.startDate`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Start Date"
                          type="date"
                          fullWidth
                          size="small"
                          InputLabelProps={{ shrink: true }}
                          value={formatDateForInput(field.value)}
                          onChange={(e) => field.onChange(e.target.value)}
                          error={!!errors.experience?.[index]?.startDate}
                          helperText={errors.experience?.[index]?.startDate?.message}
                          sx={textFieldSx}
                        />
                      )}
                    />
                  </Grid>
                  <Grid xs={12} sm={6} sx={{ minWidth: 280 }}>
                    <Controller
                      name={`experience.${index}.endDate`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="End Date"
                          type="date"
                          fullWidth
                          size="small"
                          InputLabelProps={{ shrink: true }}
                          inputProps={{ min: startDate || undefined }}
                          value={formatDateForInput(field.value)}
                          onChange={(e) => field.onChange(e.target.value)}
                          error={!!errors.experience?.[index]?.endDate}
                          helperText={errors.experience?.[index]?.endDate?.message}
                          sx={textFieldSx}
                        />
                      )}
                    />
                  </Grid>
                  <Grid xs={12} sx={{ textAlign: "right" }}>
                    <IconButton color="error" onClick={() => removeExperience(index)} sx={iconButtonSx}>
                      <RemoveCircle />
                    </IconButton>
                  </Grid>
                </Grid>
              </Paper>
            );
          })}
          <Button
            variant="outlined"
            startIcon={<AddCircle />}
            onClick={() => addExperience({ companyName: "", location: "", role: "", description: "", startDate: "", endDate: "" })}
            sx={{ mb: 3, borderColor: theme.palette.primary.light, color: theme.palette.text.primary, fontWeight: 600, "&:hover": { borderColor: theme.palette.primary.main, color: theme.palette.secondary.main } }}
          >
            Add Experience
          </Button>

          <Box textAlign="center" mt={4}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                px: 8,
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                background: `linear-gradient(90deg, ${theme.palette.primary.light} 30%, ${theme.palette.secondary.main} 100%)`,
                color: "#fff",
                boxShadow: `0 4px 16px ${theme.palette.secondary.main}66`,
                "&:hover": {
                  background: theme.palette.primary.main,
                  boxShadow: `0 6px 24px ${theme.palette.primary.main}aa`,
                },
                transition: "all 0.3s ease",
              }}
            >
              {mode === "edit" ? "Update User" : "Save User"}
            </Button>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
};

export default UserForm;
