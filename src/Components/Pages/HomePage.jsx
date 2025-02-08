import React from "react";
import { Box, Typography, Button, Grid, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Загружаем данные о договорах
  const contracts = JSON.parse(localStorage.getItem("contracts_data")) || [];
  const totalContracts = contracts.length;
  const signedContracts = contracts.filter(c => c.status === "Подписан").length;
  const pendingContracts = contracts.filter(c => c.status !== "Подписан").length;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        {user ? `Добро пожаловать, ${user.name}!` : "Добро пожаловать в систему"}
      </Typography>

      {/* Статистика */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Всего договоров</Typography>
              <Typography variant="h4">{totalContracts}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Подписано</Typography>
              <Typography variant="h4">{signedContracts}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">На согласовании</Typography>
              <Typography variant="h4">{pendingContracts}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Последние изменения */}
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>Последние изменения</Typography>
        {contracts.slice(0, 5).map((contract, index) => (
          <Card key={index} sx={{ mb: 1 }}>
            <CardContent>
              <Typography variant="h6">{contract.title}</Typography>
              <Typography variant="body2">Статус: {contract.status} | Дата: {contract.date}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Быстрые ссылки */}
      <Box mt={4} display="flex" gap={2}>
        <Button variant="contained" color="primary" onClick={() => navigate("/contracts")}>
          Перейти к договорам
        </Button>
        <Button variant="outlined" onClick={() => navigate("/profile")}>
          Профиль
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;
