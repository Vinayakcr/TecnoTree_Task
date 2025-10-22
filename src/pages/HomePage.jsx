import React, { useEffect } from "react";
import { Box, Typography, Button, Grid, keyframes, alpha } from "@mui/material";
import { useNavigate } from "react-router-dom";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const glassButtonStyle = {
  borderRadius: 3,
  px: 6,
  py: 1.8,
  backdropFilter: "blur(12px)",
  backgroundColor: alpha("#BEE9E8", 0.15),
  border: "1.5px solid rgba(94, 166, 186, 0.6)",
  color: "#1B4965",
  boxShadow: "0 4px 12px rgba(94, 166, 186, 0.25)",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: alpha("#62B6CB", 0.25),
    borderColor: "#5FA8D3",
    color: "#5FA8D3",
    boxShadow: "0 6px 20px rgba(95,168,211,0.35)",
    transform: "scale(1.05)",
  },
  "&:active": {
    transform: "scale(0.95)",
  },
  whiteSpace: "nowrap",
  fontWeight: 600,
  fontSize: "1.1rem",
  fontFamily: "Montserrat, sans-serif",
};

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.history.replaceState(null, "", "/home");
    window.history.pushState(null, "", "/home");

    const handlePopState = () => {
      window.history.pushState(null, "", "/home");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <Box
      sx={{
        width: "98.7vw",
        height: "84.3vh",
        overflow: "hidden",
        background:
          "linear-gradient(135deg, #BEE9E8 0%, #CAE9FF 75%, #5FA8D3 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        animation: `${fadeIn} 1s ease forwards`,
        boxSizing: "border-box",
        px: 2,
      }}
    >
      <Typography
        variant="h2"
        mb={2}
        sx={{
          fontWeight: 700,
          color: "#1B4965",
          letterSpacing: 2,
          textShadow: "1px 1px 3px rgba(27, 73, 101, 0.3)",
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        User Management Application
      </Typography>

      <Typography
        variant="h6"
        mb={5}
        sx={{
          fontWeight: 500,
          color: "#475569",
          letterSpacing: 1,
          maxWidth: 400,
          mx: "auto",
          textShadow: "1px 1px 2px rgba(202, 233, 255, 0.7)",
          px: 2,
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        Manage Users Easily and Efficiently with a Modern and Interactive Interface
      </Typography>

      <Grid container spacing={4} justifyContent="center" sx={{ maxWidth: 400 }}>
        <Grid item>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/new")}
            sx={glassButtonStyle}
          >
            Add User
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/users")}
            sx={glassButtonStyle}
          >
            View Users
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;
