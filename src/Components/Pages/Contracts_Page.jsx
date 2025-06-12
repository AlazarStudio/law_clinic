import React, { useState, useEffect, useContext } from "react";
import contractService from "../../Services/contractService";
import { Button, List, ListItem, ListItemText, Typography, TextField, Select, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ContractForm from "../Blocks/ContractForm";
import { AuthContext } from "../../AuthContext";

function Contracts_Page() {
  const { user } = useContext(AuthContext);
  const [contracts, setContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Все");
  const [dateFilter, setDateFilter] = useState("Все");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      refreshContracts();
    }
  }, [user]);

  const refreshContracts = async () => {
    const data = await contractService.getContracts(user.role === "admin" ? null : user.id);
    setContracts(data);
    filterContracts(data, search, statusFilter, dateFilter);
  };


  const handleDelete = async (id) => {
    await contractService.deleteContract(id);
    refreshContracts();
  };

  const filterContracts = (data, searchText, status, dateFilterOption = "Все") => {
    let filtered = data;

    if (searchText) {
      filtered = filtered.filter(
        (contract) =>
          contract.title.toLowerCase().includes(searchText.toLowerCase()) ||
          contract.client.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (status !== "Все") {
      filtered = filtered.filter((contract) => contract.status === status);
    }

    if (dateFilterOption !== "Все") {
      const today = new Date();

      if (dateFilterOption === "Истекающие") {
        filtered = filtered.filter((contract) => {
          if (!contract.endDate) return false;
          const end = new Date(contract.endDate);
          const diff = (end - today) / (1000 * 60 * 60 * 24);
          return diff >= 0 && diff <= 7;
        });
      }

      if (dateFilterOption === "Просроченные") {
        filtered = filtered.filter((contract) => {
          if (!contract.endDate) return false;
          return new Date(contract.endDate) < today;
        });
      }
    }

    setFilteredContracts(filtered);
  };


  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    filterContracts(contracts, e.target.value, statusFilter);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    filterContracts(contracts, search, e.target.value);
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>Список договоров</Typography>

      <TextField
        fullWidth
        label="Поиск по названию или клиенту"
        variant="outlined"
        value={search}
        onChange={handleSearchChange}
        style={{ marginBottom: 20 }}
      />

      <Select
        fullWidth
        value={statusFilter}
        onChange={handleStatusChange}
        variant="outlined"
        style={{ marginBottom: 20 }}
      >
        <MenuItem value="Все">Все</MenuItem>
        <MenuItem value="На согласовании">На согласовании</MenuItem>
        <MenuItem value="Подписан">Подписан</MenuItem>
      </Select>

      <Select
        fullWidth
        value={dateFilter}
        onChange={(e) => {
          setDateFilter(e.target.value);
          filterContracts(contracts, search, statusFilter, e.target.value);
        }}
        variant="outlined"
        style={{ marginBottom: 20 }}
      >
        <MenuItem value="Все">Все сроки</MenuItem>
        <MenuItem value="Истекающие">Истекающие (≤ 7 дней)</MenuItem>
        <MenuItem value="Просроченные">Просроченные</MenuItem>
      </Select>



      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>Добавить договор</Button>

      <List >
        {filteredContracts.map((contract) => (
          <ListItem key={contract.id} sx={{ cursor: 'pointer', border: '1px solid rgba(0, 0, 0, 0.23)', borderRadius: '4px', mb: '10px' }} button onClick={() => navigate(`/contracts/${contract.id}`)}>
            <ListItemText
              primary={`${contract.title} (${contract.client})`}
              secondary={`Статус: ${contract.status} | Дата: ${contract.date} | Дата окончания: ${contract.endDate}`}
            />
            <Button variant="outlined" color="secondary" onClick={(e) => { e.stopPropagation(); handleDelete(contract.id); }}>Удалить</Button>
          </ListItem>
        ))}
      </List>

      <ContractForm
        open={open}
        handleClose={() => setOpen(false)}
        refreshContracts={refreshContracts}
        userId={user?.id}
      />
    </div>
  );
}

export default Contracts_Page;
