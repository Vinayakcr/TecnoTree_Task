import React, { useState, useContext, useEffect } from "react";
import { Box, Paper, Typography, Button, Fade, Divider } from "@mui/material";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import { AuthContext } from "../Context/AuthContext";

const LoginPage = () => {
  const { accessToken, login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (accessToken) {
      window.location.replace("/home");
    }
  }, [accessToken]);

  const handleLoginClick = async () => {
    setLoading(true);
    try {
      await login();
    } catch (err) {
      console.error("Login failed:", err);
      setLoading(false);
    }
  };

  return (
    <Fade in timeout={900}>
      <Box
        sx={{
          height: "91.5vh",
          width: "96.5vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #BEE9E8 0%, #CAE9FF 70%, #5FA8D3 100%)",
          p: 2,
        }}
      >
        <Paper
          elevation={10}
          sx={{
            p: { xs: 4, sm: 6 },
            width: "100%",
            maxWidth: 420,
            borderRadius: 4,
            textAlign: "center",
            background: "rgba(255, 255, 255, 0.22)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(98, 182, 203, 0.45)",
            boxShadow: "0 8px 32px rgba(27, 73, 101, 0.12)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <LockRoundedIcon
            sx={{
              fontSize: 56,
              color: "#1B4965",
              mb: 2,
              background: "linear-gradient(45deg, #5FA8D3 30%, #1B4965 100%)",
              borderRadius: "50%",
              p: 1.3,
              boxShadow: "0 0 12px 3px rgba(31,78,104,0.15)",
              transition: "transform 0.3s ease",
              "&:hover": { transform: "scale(1.08)" },
            }}
          />
          <Typography
            variant="h4"
            fontWeight={800}
            letterSpacing={1}
            sx={{ color: "#1B4965", mb: 1 }}
          >
            Tecnotree SSO Login
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "#5FA8D3", mb: 3 }}>
            Securely access your organization account
          </Typography>

          <Divider sx={{ width: "80%", mb: 4, borderColor: "#5FA8D3", opacity: 0.4 }} />

          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleLoginClick}
            disabled={loading}
            sx={{
              background: "linear-gradient(90deg, #1B4965 0%, #5FA8D3 100%)",
              color: "#FFF",
              fontWeight: 700,
              fontSize: "1.15rem",
              py: 1.6,
              borderRadius: 4,
            }}
          >
            {loading ? "Redirecting…" : "Login with SSO"}
          </Button>
        </Paper>
      </Box>
    </Fade>
  );
};

export default LoginPage;
