import React, { useState } from "react";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:5000/users?email=${credentials.email}&password=${credentials.password}`);
      const users = await res.json();

      if (users.length === 1) {
        login(users[0]); // сохранить в контексте и localStorage
        navigate("/");
      } else {
        setError("Неверный email или пароль!");
      }
    } catch (err) {
      setError("Ошибка подключения к серверу");
    }
  };

  return (
    <Container sx={{ height: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: '500px !important', width: '100%' }}>
      <Typography variant="h4" gutterBottom>Вход</Typography>
      <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
        <TextField label="Email" name="email" value={credentials.email} onChange={handleChange} required />
        <TextField label="Пароль" type="password" name="password" value={credentials.password} onChange={handleChange} required />
        <Button type="submit" variant="contained" color="primary">Войти</Button>
        <Button variant="outlined" onClick={() => navigate("/register")}>Регистрация</Button>
        {error && <Typography color="error">{error}</Typography>}
      </Box>
    </Container>
  );
};

export default LoginPage;
