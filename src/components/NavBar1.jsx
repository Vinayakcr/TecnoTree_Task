import React, { useState, useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  TextField,
  InputAdornment,
  Stack,
  alpha,
} from "@mui/material";
import { Search, Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

const NavBar = () => {
  const [searchStr, setSearchStr] = useState("");
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchStr.trim()) {
      navigate(`/users?search=${encodeURIComponent(searchStr.trim())}`);
      setSearchStr("");
    }
  };

  const handleLogoutClick = () => {
    if (logout) logout();
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: alpha("#BEE9E8", 0.55),
        backdropFilter: "blur(18px)",
        borderBottom: "1px solid #CAE9FF",
        boxShadow: "0 8px 32px rgba(27,73,101,0.15)",
        py: 0.7,
        transition: "background 0.4s",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          minHeight: 64,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            cursor: "pointer",
            letterSpacing: 1.2,
            fontWeight: 900,
            color: "#0754fa",
            textShadow: "0 1px 2px rgba(27, 73, 101, 0.15)",
            fontFamily: "Montserrat, sans-serif",
            mr: 3,
            userSelect: "none",
            transition: "text-shadow 0.4s ease, transform 0.3s ease",
            "&:hover": {
              textShadow: `
                0 0 8px rgba(7, 84, 250, 0.35),
                0 0 16px rgba(7, 84, 250, 0.25),
                0 0 24px rgba(7, 84, 250, 0.15)
              `,
              transform: "scale(1.03)",
            },
          }}
          onClick={() => navigate("/home")}
        >
          TecnoTree
        </Typography>

        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{
            flex: 1,
            maxWidth: 450,
            mx: 4,
            borderRadius: 4,
            bgcolor: alpha("#62B6CB", 0.16),
            boxShadow: "0 4px 20px rgba(98,182,203,0.07)",
            transition: "0.3s",
            "&:hover": { boxShadow: "0 6px 28px rgba(98,182,203,0.15)" },
          }}
        >
          <TextField
            value={searchStr}
            onChange={(e) => setSearchStr(e.target.value)}
            placeholder="Search users…"
            size="small"
            variant="outlined"
            fullWidth
            autoComplete="off"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 4,
                p: 0,
                background: alpha("#CAE9FF", 0.5),
                fontSize: 16,
                color: "#1B4965",
              },
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              "& .MuiInputBase-input": { color: "#0754faff" },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    type="submit"
                    variant="contained"
                    size="medium"
                    endIcon={<Search />}
                    sx={{
                      bgcolor:
                        "linear-gradient(90deg,#62B6CB 40%,#5FA8D3 100%)",
                      color: "#fff",
                      fontWeight: 600,
                      borderRadius: 2,
                      ml: 1,
                      px: 2.5,
                      boxShadow: "0 3px 12px rgba(98,182,203,0.18)",
                      transition: "all 0.25s ease",
                      "&:hover": {
                        bgcolor: "#0754faff",
                        transform: "scale(1)",
                        boxShadow: "0 5px 20px #0754faff",
                      },
                    }}
                  >
                    Search
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Stack direction="row" gap={1.5}>
          <Button
            onClick={() => navigate("/new")}
            variant="outlined"
            sx={{
              color: "#000",
              borderColor: "#62B6CB",
              fontWeight: 600,
              borderRadius: 3,
              px: 3,
              letterSpacing: 0.8,
              "&:hover": {
                background: alpha("#62B6CB", 0.13),
                color: "#0754faff",
                borderColor: "#0754faff",
                transform: "scale(1)",
              },
            }}
          >
            New User
          </Button>

          <Button
            onClick={() => navigate("/users")}
            variant="outlined"
            sx={{
              color: "#000",
              borderColor: "#62B6CB",
              fontWeight: 600,
              borderRadius: 3,
              px: 3,
              letterSpacing: 0.8,
              "&:hover": {
                background: alpha("#0754faff", 0.13),
                color: "#0754faff",
                borderColor: "#0754faff",
                transform: "scale(1)",
              },
            }}
          >
            View Users
          </Button>

          <Button
            onClick={() => navigate("/users/csv")}
            variant="outlined"
            sx={{
              color: "#000",
              borderColor: "#62B6CB",
              fontWeight: 600,
              borderRadius: 3,
              px: 3,
              "&:hover": {
                background: alpha("#62B6CB", 0.13),
                color: "#0754faff",
              },
            }}
          >
            User Management
          </Button>

          <Button
            onClick={() => logout()}
            variant="contained"
            endIcon={<Logout />}
            sx={{
              ml: 2,
              fontWeight: 700,
              borderRadius: 3,
              px: 3,
              letterSpacing: 0.5,
              bgcolor: "linear-gradient(90deg,#1B4965 30%,#62B6CB 100%)",
              color: "#fff",
              boxShadow: "0 4px 20px rgba(27,73,101,0.15)",
              "&:hover": {
                bgcolor: "#0754faff",
                boxShadow: "0 6px 24px #0754faff",
                transform: "scale(1)",
              },
            }}
          >
            Logout
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
