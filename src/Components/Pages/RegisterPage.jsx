import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ name: "", email: "", password: "", role: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`https://law-clinik-back.onrender.com/users?email=${userData.email}`);
      const existingUsers = await res.json();

      if (existingUsers.length > 0) {
        setError("Email уже зарегистрирован!");
        return;
      }

      const response = await fetch(`https://law-clinik-back.onrender.com/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        alert("Регистрация успешна! Теперь войдите в аккаунт.");
        navigate("/login");
      } else {
        setError("Ошибка при регистрации.");
      }
    } catch (err) {
      setError("Ошибка подключения к серверу.");
    }
  };

  return (
    <Container sx={{
      height: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      maxWidth: '500px !important',
      width: '100%'
    }}>
      <Typography variant="h4" gutterBottom>Регистрация</Typography>

      <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
        <TextField label="Имя" name="name" value={userData.name} onChange={handleChange} required />
        <TextField label="Email" name="email" type="email" value={userData.email} onChange={handleChange} required />
        <TextField label="Пароль" name="password" type="password" value={userData.password} onChange={handleChange} required />

        <FormControl fullWidth required>
          <InputLabel>Роль</InputLabel>
          <Select name="role" value={userData.role} label="Роль" onChange={handleChange}>
            {/* <MenuItem value="admin">Админ</MenuItem> */}
            <MenuItem value="lawyer">Юрист</MenuItem>
            <MenuItem value="client">Клиент</MenuItem>
          </Select>
        </FormControl>

        <Button type="submit" variant="contained" color="primary">Зарегистрироваться</Button>
        <Button variant="outlined" onClick={() => navigate("/login")}>Уже есть аккаунт?</Button>
        {error && <Typography color="error">{error}</Typography>}
      </Box>
    </Container>
  );
};

export default RegisterPage;
