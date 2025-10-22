import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Typography,
  Stack,
  Button,
  alpha,
} from "@mui/material";
import { Edit, Delete, Visibility, ArrowBack, ArrowForward } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useApi } from "../utils/useApi";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const navigate = useNavigate();
  const location = useLocation();
  const { callApi } = useApi();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(location.search);
      const search = params.get("search") || "";

      const data = await callApi(`http://localhost:8081/api/users?search=${search}`);
      const allUsers = Array.isArray(data) ? data : data.data || [];
      setUsers(allUsers);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
    }
    setLoading(false);
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await callApi(`http://localhost:8081/api/users/${id}`, { method: "DELETE" });
      toast.success("User deleted successfully!");
      setTimeout(fetchUsers, 500);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [location.search]);

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / usersPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <Typography variant="h5" sx={{ color: "#1B4965" }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "96%",
        height: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
        p: 3,
        bgcolor: "rgba(190, 233, 232, 0.15)",
      }}
    >
      <ToastContainer position="top-right" autoClose={3000} />

      <Typography
        variant="h4"
        sx={{
          mb: 2,
          textAlign: "center",
          fontWeight: "bold",
          color: "#1B4965",
          textShadow: "0 2px 12px rgba(27, 73, 101, 0.3)",
          fontFamily: "'Montserrat', sans-serif",
        }}
      >
        Users
      </Typography>

      <Paper
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          backdropFilter: "blur(14px)",
          bgcolor: "rgba(202, 233, 255, 0.07)",
          border: "1px solid rgba(98, 182, 203, 0.17)",
          boxShadow: "0 8px 32px rgba(27, 73, 101, 0.08)",
        }}
      >
        <Table sx={{ minWidth: 650, tableLayout: "fixed" }}>
          <TableHead sx={{ bgcolor: "#1B4965" }}>
            <TableRow>
              {["First Name", "Last Name", "Phone Number", "Actions"].map((text) => (
                <TableCell
                  key={text}
                  sx={{ color: "#fff", fontWeight: "bold", fontFamily: "'Montserrat', sans-serif" }}
                  align={text === "Actions" ? "center" : "left"}
                >
                  {text}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {currentUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4, color: "#5FA8D3" }}>
                  No users found
                </TableCell>
              </TableRow>
            )}

            {currentUsers.map((user) => (
              <TableRow
                key={user.id}
                sx={{
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 24px rgba(27, 73, 101, 0.15)",
                    bgcolor: "rgba(27, 73, 101, 0.05)",
                  },
                }}
              >
                <TableCell sx={{ color: "#5FA8D3" }}>{user.firstName}</TableCell>
                <TableCell sx={{ color: "#5FA8D3" }}>{user.lastName}</TableCell>
                <TableCell sx={{ color: "#5FA8D3" }}>{user.mobileNumber}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`/users/edit/${user.id}`)}
                    sx={{ "&:hover": { color: "#62B6CB", transform: "scale(1.1)" }, transition: "all 0.2s" }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="info"
                    onClick={() => navigate(`/users/${user.id}`)}
                    sx={{ "&:hover": { color: "#5FA8D3", transform: "scale(1.1)" }, transition: "all 0.2s" }}
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => deleteUser(user.id)}
                    sx={{ "&:hover": { color: "#ef5350", transform: "scale(1.1)" }, transition: "all 0.2s" }}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Pagination with count */}
      <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" mt={3}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={handlePrev}
          disabled={currentPage === 1}
          sx={{
            borderColor: "#62B6CB",
            color: "#1B4965",
            "&:hover": { backgroundColor: alpha("#62B6CB", 0.13), color: "#0754faff" },
          }}
        >
          Previous
        </Button>

        <Typography sx={{ color: "#1B4965", fontWeight: "bold" }}>
          Page {currentPage} of {totalPages || 1}
        </Typography>

        <Button
          variant="outlined"
          endIcon={<ArrowForward />}
          onClick={handleNext}
          disabled={currentPage === totalPages || totalPages === 0}
          sx={{
            borderColor: "#62B6CB",
            color: "#1B4965",
            "&:hover": { backgroundColor: alpha("#62B6CB", 0.13), color: "#0754faff" },
          }}
        >
          Next
        </Button>
      </Stack>
    </Box>
  );
};

export default UserList;
