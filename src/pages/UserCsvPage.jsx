import React, { useRef } from "react";
import { Box, Typography, Button, Grid, alpha, keyframes } from "@mui/material";
import { UploadFile, Download } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useApi } from "../utils/useApi";
import { motion } from "framer-motion";

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(7,84,250,0.4); }
  70% { box-shadow: 0 0 0 12px rgba(7,84,250,0); }
  100% { box-shadow: 0 0 0 0 rgba(7,84,250,0); }
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
    color: "#0754fa",
    boxShadow: "0 6px 22px rgba(95,168,211,0.35)",
    transform: "scale(1.05)",
  },
  "&:active": {
    transform: "scale(0.95)",
  },
  fontWeight: 600,
  fontSize: "1.1rem",
  fontFamily: "Montserrat, sans-serif",
  animation: `${pulse} 3s infinite ease-in-out`,
};

const UserCsvPage = () => {
  const fileInputRef = useRef(null);
  const { post } = useApi();

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      toast.error("Please select a valid CSV file!");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      const data = await post("http://localhost:8081/api/users/import", formData);
      toast.success(data.message || "Users imported successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to import CSV");
    }
  };

  const handleExportClick = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://localhost:8081/api/users/export", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Export failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "users.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("CSV downloaded successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to download CSV");
    }
  };

  return (
    <Box
      sx={{
        width: "96.4%",
        height: "calc(87vh - 64px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(270deg, #BEE9E8, #5FA8D3, #0754fa, #62B6CB, #CAE9FF)",
        backgroundSize: "400% 400%",
        animation: `${gradientAnimation} 18s ease infinite`,
        textAlign: "center",
        p: 3,
        borderRadius: 2,
        boxShadow: "0 8px 32px rgba(27,73,101,0.2)",
      }}
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Typography
          variant="h4"
          mb={4}
          sx={{
            fontWeight: 700,
            color: "#1B4965",
            textShadow: "0 2px 10px rgba(27,73,101,0.25)",
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          Manage Users CSV
        </Typography>
      </motion.div>

      <Grid container spacing={4} justifyContent="center">
        <Grid item>
          <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outlined"
              startIcon={<UploadFile />}
              sx={glassButtonStyle}
              onClick={handleUploadClick}
            >
              Upload Users (CSV)
            </Button>
          </motion.div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </Grid>

        <Grid item>
          <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outlined"
              startIcon={<Download />}
              sx={glassButtonStyle}
              onClick={handleExportClick}
            >
              Export Users (CSV)
            </Button>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserCsvPage;
