import React, { useState } from "react";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.some(u => u.email === userData.email)) {
      alert("Email уже зарегистрирован!");
      return;
    }

    users.push(userData);
    localStorage.setItem("users", JSON.stringify(users));
    alert("Регистрация успешна! Теперь войдите в аккаунт.");
    navigate("/login");
  };

  return (
    <Container sx={{ height: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: '500px !important', width: '100%' }}>
      <Typography variant="h4" gutterBottom>Регистрация</Typography>
      <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
        <TextField label="Имя" name="name" value={userData.name} onChange={handleChange} required />
        <TextField label="Email" name="email" value={userData.email} onChange={handleChange} required />
        <TextField label="Пароль" type="password" name="password" value={userData.password} onChange={handleChange} required />
        <Button type="submit" variant="contained" color="primary">Зарегистрироваться</Button>
        <Button variant="outlined" onClick={() => navigate("/login")}>Уже есть аккаунт?</Button>
      </Box>
    </Container>
  );
};

export default RegisterPage;
