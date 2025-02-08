import React, { useState, useEffect } from "react";
import contractService from "../../Services/contractService";
import { Button, List, ListItem, ListItemText, Typography, TextField, Select, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ContractForm from "../Blocks/ContractForm";

function Contracts_Page() {
  const [contracts, setContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Все");
  const navigate = useNavigate();

  useEffect(() => {
    const data = contractService.getContracts();
    setContracts(data);
    setFilteredContracts(data);
  }, []);

  const refreshContracts = () => {
    const data = contractService.getContracts();
    setContracts(data);
    filterContracts(data, search, statusFilter);
  };

  const handleDelete = (id) => {
    contractService.deleteContract(id);
    refreshContracts();
  };

  const filterContracts = (data, searchText, status) => {
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

      {/* Поле поиска */}
      <TextField
        fullWidth
        label="Поиск по названию или клиенту"
        variant="outlined"
        value={search}
        onChange={handleSearchChange}
        style={{ marginBottom: 20 }}
      />

      {/* Фильтр по статусу */}
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

      <List>
        {filteredContracts.map((contract) => (
          <ListItem key={contract.id} button onClick={() => navigate(`/contracts/${contract.id}`)}>
            <ListItemText
              primary={`${contract.title} (${contract.client})`}
              secondary={`Статус: ${contract.status} | Дата: ${contract.date}`}
            />
            <Button variant="outlined" color="secondary" onClick={(e) => { e.stopPropagation(); handleDelete(contract.id); }}>Удалить</Button>
          </ListItem>
        ))}
      </List>

      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>Добавить договор</Button>
      <ContractForm open={open} handleClose={() => setOpen(false)} refreshContracts={refreshContracts} />
    </div>
  );
}

export default Contracts_Page;
