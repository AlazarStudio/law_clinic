import React, { useState } from "react";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const user = storedUsers.find(u => u.email === credentials.email && u.password === credentials.password);
    
    if (user) {
      login(user);
      navigate("/");
    } else {
      alert("Неверный email или пароль!");
    }
  };

  return (
    <Container sx={{height: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: '500px !important', width: '100%'}}>
      <Typography variant="h4" gutterBottom>Вход</Typography>
      <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
        <TextField label="Email" name="email" value={credentials.email} onChange={handleChange} required />
        <TextField label="Пароль" type="password" name="password" value={credentials.password} onChange={handleChange} required />
        <Button type="submit" variant="contained" color="primary">Войти</Button>
        <Button variant="outlined" onClick={() => navigate("/register")}>Регистрация</Button>
      </Box>
    </Container>
  );
};

export default LoginPage;
