import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <Box>
      <Typography variant="h4">Профиль</Typography>
      <Typography variant="body1">Имя: {user.name}</Typography>
      <Typography variant="body1">Email: {user.email}</Typography>
      <Button variant="contained" color="error" sx={{ mt: 2 }} onClick={() => { logout(); navigate("/login"); }}>
        Выйти
      </Button>
    </Box>
  );
};

export default ProfilePage;
