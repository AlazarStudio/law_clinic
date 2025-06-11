import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    const fetchContracts = async () => {
      if (!user) return;
      const res = await fetch(`http://localhost:5000/contracts?userId=${user.id}`);
      const data = await res.json();
      setContracts(
        data.sort((a, b) => new Date(a.endDate || "2100-01-01") - new Date(b.endDate || "2100-01-01"))
      );
    };

    fetchContracts();
  }, [user]);

  const totalContracts = contracts.length;
  const signedContracts = contracts.filter(c => c.status === "Подписан").length;
  const pendingContracts = contracts.filter(c => c.status !== "Подписан").length;

  const today = new Date();

  const expiringContracts = contracts.filter(contract => {
    if (!contract.endDate) return false;
    const end = new Date(contract.endDate);
    const diff = (end - today) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  });

  const overdueContracts = contracts.filter(contract => {
    if (!contract.endDate) return false;
    const end = new Date(contract.endDate);
    return end < today;
  });

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        {user ? `Добро пожаловать, ${user.name}!` : "Добро пожаловать в систему"}
      </Typography>

      {/* 📊 Статистика */}
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

      {/* ⏰ Просроченные договоры */}
      {overdueContracts.length > 0 && (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>Просроченные договоры</Typography>
          {overdueContracts.map((contract, index) => (
            <Card key={index} sx={{ mb: 1, backgroundColor: "#ffe5e5" }}>
              <CardContent>
                <Typography variant="h6">{contract.title}</Typography>
                <Typography variant="body2">
                  Истёк: {contract.endDate} | Статус: {contract.status}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* ⏳ Истекающие договоры */}
      {expiringContracts.length > 0 && (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>Истекающие договоры (в течение 7 дней)</Typography>
          {expiringContracts.map((contract, index) => (
            <Card key={index} sx={{ mb: 1, backgroundColor: "#fffde7" }}>
              <CardContent>
                <Typography variant="h6">{contract.title}</Typography>
                <Typography variant="body2">
                  Истекает: {contract.endDate} | Статус: {contract.status}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* 🕓 Последние изменения */}
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

      {/* 🔗 Быстрые действия */}
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
