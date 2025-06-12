import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import { useAuth } from "../../AuthContext";
import { useNavigate } from "react-router-dom";

const ClientContractsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    const fetchContracts = async () => {
      if (!user) return;
      const res = await fetch("https://law-clinik-back.onrender.com/contracts");
      const data = await res.json();

      const filtered = data.filter(c => c.client === user.name);
      setContracts(filtered);
    };

    fetchContracts();
  }, [user]);

  
  console.log(contracts)

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Мои договоры</Typography>

      {contracts.length === 0 ? (
        <Typography>Вы ещё не участвуете ни в одном договоре.</Typography>
      ) : (
        contracts.map((contract, index) => (
          <Card key={index} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">{contract.title}</Typography>
              <Typography>Статус: {contract.status}</Typography>
              <Typography>Дата начала: {contract.date}</Typography>
              <Typography>Срок действия: {contract.endDate || "не указан"}</Typography>
              <Button
                variant="outlined"
                sx={{ mt: 1 }}
                onClick={() => navigate(`/contracts/${contract.id}`)}
              >
                Подробнее
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default ClientContractsPage;
