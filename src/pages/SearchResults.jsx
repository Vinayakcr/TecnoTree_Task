import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../CSS Styling/SearchResults.css";
import { useApi } from "../utils/useApi";

const SearchResults = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { callApi } = useApi();

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams(location.search);
      const search = params.get("search") || "";

      const res = await callApi(`/api/users?search=${encodeURIComponent(search)}`);
      setUsers(res); 
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.info("Redirecting to login...");
      window.location.href =
        "http://localhost:8081/oauth2/authorization/wso2?redirect_uri=http://localhost:5173";
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await callApi(`/api/users/${id}`, { method: "DELETE" }); 
      toast.success("User deleted successfully!");
      fetchUsers(); 
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error(err.message || "Failed to delete user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [location.search]);

  if (loading)
    return <Typography sx={{ textAlign: "center", mt: 10 }}>Loading...</Typography>;

  return (
    <Box className="search-results-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <Typography variant="h4" className="search-results-title">
        Search Results
      </Typography>

      <Paper className="search-results-paper">
        <Table className="search-results-table">
          <TableHead>
            <TableRow className="search-results-header-row">
              <TableCell className="search-results-header-cell">First Name</TableCell>
              <TableCell className="search-results-header-cell">Last Name</TableCell>
              <TableCell className="search-results-header-cell">Phone Number</TableCell>
              <TableCell className="search-results-header-cell" align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id} className="search-results-row">
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.mobileNumber}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => navigate(`/users/edit/${user.id}`)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="info"
                      onClick={() => navigate(`/users/${user.id}`)}
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton color="error" onClick={() => deleteUser(user.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="no-results">
                  No matching records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default SearchResults;
