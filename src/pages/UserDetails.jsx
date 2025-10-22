import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import dayjs from "dayjs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useApi } from "../utils/useApi";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { callApi } = useApi(); 
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await callApi(`/api/users/${id}`); 
        setUser(res); 
      } catch (err) {
        console.error("Failed to fetch user:", err);
        toast.error("Failed to fetch user. Redirecting to login...");
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id,navigate]);

  if (loading)
    return (
      <Typography
        className="userdetails-loading"
        sx={{ color: theme.palette.primary.main, mt: 12, fontWeight: 600 }}
      >
        Loading...
      </Typography>
    );

  if (!user) {
    return (
      <Typography
        sx={{ color: theme.palette.error.main, mt: 12, textAlign: "center" }}
      >
        User not found.
      </Typography>
    );
  }

  const renderDetails = (label, value) => (
    <Grid key={label}>
      <Typography color={theme.palette.text.primary}>
        <b>{label}:</b> {value || "N/A"}
      </Typography>
    </Grid>
  );

  return (
    <Box
      className="userdetails-container"
      sx={{
        backdropFilter: "blur(12px)",
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        borderRadius: 3,
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        border: "1px solid rgba(255, 255, 255, 0.18)",
        width: "98vw",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        p: 3,
        boxSizing: "border-box",
      }}
    >
      <Box
        className="userdetails-wrapper"
        sx={{
          width: "95%",
          maxWidth: 1400,
          display: "flex",
          flexDirection: "column",
          gap: 4,
          color: theme.palette.text.primary,
        }}
      >
       
        <Box
          className="userdetails-header"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h4"
            className="userdetails-title"
            sx={{
              fontWeight: 700,
              color: theme.palette.primary.main,
              mb: 1.5,
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              textShadow: "0 2px 4px rgba(25, 118, 210, 0.5)",
            }}
          >
            User Details
          </Typography>

          <Box className="userdetails-btn-group" sx={{ display: "flex" }}>
            <Button
              variant="contained"
              onClick={() => navigate("/users")}
              sx={{
                bgcolor: theme.palette.primary.main,
                color: "#fff",
                mr: 1.5,
                boxShadow:
                  "0 4px 10px 0 rgba(25, 118, 210, 0.4), 0 0 8px 2px rgba(25,118,210,0.3)",
                "&:hover": { bgcolor: theme.palette.primary.dark },
              }}
            >
              Back to Users
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate(`/users/edit/${user.id}`)}
              sx={{
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                "&:hover": {
                  bgcolor: "rgba(25, 118, 210, 0.1)",
                  borderColor: theme.palette.primary.dark,
                },
              }}
            >
              Edit User
            </Button>
          </Box>
        </Box>

        <Box className="userdetails-section" sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Accordion className="userdetails-accordion" defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ color: theme.palette.primary.main }}>
              <Typography variant="h6">Personal Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Card className="userdetails-card">
                <CardContent>
                  <Grid container spacing={2} direction="column">
                    {[
                      ["First Name", user.firstName],
                      ["Last Name", user.lastName],
                      ["Father's Name", user.fathersName],
                      ["Mother's Name", user.mothersName],
                      ["Phone", user.mobileNumber],
                      ["Email", user.email],
                      ["Gender", user.gender],
                      ["Date of Birth", user.dateOfBirth ? dayjs(user.dateOfBirth).format("DD MMM YYYY") : "N/A"],
                      ["Address", user.address],
                    ].map(([label, value]) => renderDetails(label, value))}
                  </Grid>
                </CardContent>
              </Card>
            </AccordionDetails>
          </Accordion>

          <Accordion className="userdetails-accordion">
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ color: theme.palette.primary.main }}>
              <Typography variant="h6">Education</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {user.education?.length > 0 ? (
                user.education.map((edu, idx) => (
                  <Card key={idx} className="userdetails-card">
                    <CardContent>
                      <Grid container spacing={2} direction="column">
                        {[
                          ["College", edu.collegeName],
                          ["Location", edu.location],
                          ["Start Date", edu.startDate ? dayjs(edu.startDate).format("DD MMM YYYY") : "N/A"],
                          ["End Date", edu.endDate ? dayjs(edu.endDate).format("DD MMM YYYY") : "N/A"],
                        ].map(([label, value]) => renderDetails(label, value))}
                      </Grid>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography color={theme.palette.text.secondary}>No education details</Typography>
              )}
            </AccordionDetails>
          </Accordion>

          <Accordion className="userdetails-accordion">
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ color: theme.palette.primary.main }}>
              <Typography variant="h6">Experience</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {user.experience?.length > 0 ? (
                user.experience.map((exp, idx) => (
                  <Card key={idx} className="userdetails-card">
                    <CardContent>
                      <Grid container spacing={2} direction="column">
                        {[
                          ["Company", exp.companyName],
                          ["Location", exp.location],
                          ["Role", exp.role],
                          ["Description", exp.description],
                          ["Start Date", exp.startDate ? dayjs(exp.startDate).format("DD MMM YYYY") : "N/A"],
                          ["End Date", exp.endDate ? dayjs(exp.endDate).format("DD MMM YYYY") : "N/A"],
                        ].map(([label, value]) => renderDetails(label, value))}
                      </Grid>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography color={theme.palette.text.secondary}>No experience details</Typography>
              )}
            </AccordionDetails>
          </Accordion>

          <Accordion className="userdetails-accordion">
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ color: theme.palette.primary.main }}>
              <Typography variant="h6">Record Info</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Card className="userdetails-card">
                <CardContent>
                  <Grid container spacing={2} direction="column">
                    {[
                      ["Created At", user.createdAt ? dayjs(user.createdAt).format("DD MMM YYYY") : "N/A"],
                      ["Modified At", user.modifiedAt ? dayjs(user.modifiedAt).format("DD MMM YYYY") : "N/A"],
                    ].map(([label, value]) => renderDetails(label, value))}
                  </Grid>
                </CardContent>
              </Card>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
}
