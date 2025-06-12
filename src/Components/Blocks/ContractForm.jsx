import React, { useEffect, useState } from "react";
import {
  TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Box, IconButton, Typography, MenuItem, Select, InputLabel, FormControl
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import contractService from "../../Services/contractService";

function ContractForm({ open, handleClose, refreshContracts, userId }) {
  const [contract, setContract] = useState({
    title: "",
    client: "",
    status: "На согласовании",
    date: new Date().toISOString().split("T")[0],
    endDate: "",
    additionalFields: [],
  });

  const [newField, setNewField] = useState({ name: "", value: "" });
  const [clients, setClients] = useState([]);
  const [showAddClient, setShowAddClient] = useState(false);
  const [newClient, setNewClient] = useState({ name: "", email: "" });

  // 🔹 Подгружаем список клиентов при открытии формы
  useEffect(() => {
    if (open) {
      fetch(`https://law-clinik-back.onrender.com/users?role=client`)
        .then(res => res.json())
        .then(setClients)
        .catch(err => console.error("Ошибка загрузки клиентов", err));
    }
  }, [open]);

  const handleChange = (e) => {
    setContract({ ...contract, [e.target.name]: e.target.value });
  };

  const handleAddField = () => {
    if (newField.name.trim() && newField.value.trim()) {
      setContract(prev => ({
        ...prev,
        additionalFields: [...prev.additionalFields, { ...newField }],
      }));
      setNewField({ name: "", value: "" });
    }
  };

  const handleRemoveField = (index) => {
    setContract(prev => ({
      ...prev,
      additionalFields: prev.additionalFields.filter((_, i) => i !== index),
    }));
  };

  const handleAddClient = async () => {
    const newUser = {
      ...newClient,
      role: "client",
      password: newClient.email // 🔐 дефолтный пароль
    };

    const res = await fetch(`https://law-clinik-back.onrender.com/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    if (res.ok) {
      const created = await res.json();
      setClients([...clients, created]);
      setContract(prev => ({ ...prev, client: created.name }));
      setNewClient({ name: "", email: "" });
      setShowAddClient(false);
    } else {
      alert("Ошибка при создании клиента");
    }
  };

  const handleSubmit = async () => {
    if (!contract.title || !contract.client || !contract.date) {
      alert("Заполните основные поля!");
      return;
    }

    const contractToSave = {
      ...contract,
      userId,
    };

    await contractService.addContract(contractToSave);
    refreshContracts();
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Добавить договор</DialogTitle>
      <DialogContent>

        <TextField fullWidth margin="dense" label="Название" name="title" onChange={handleChange} />

        <Box display="flex" alignItems="center" gap={1}>
          <FormControl fullWidth margin="dense">
            <InputLabel>Клиент</InputLabel>
            <Select
              name="client"
              value={contract.client}
              onChange={handleChange}
              label="Клиент"
            >
              {clients.map(c => (
                <MenuItem key={c.id} value={c.name}>{c.name} ({c.email})</MenuItem>
              ))}
            </Select>
          </FormControl>

          <IconButton onClick={() => setShowAddClient(true)} color="primary" sx={{ mt: 1 }}>
            <Add />
          </IconButton>
        </Box>

        <TextField fullWidth margin="dense" label="Дата" type="date" name="date" onChange={handleChange} defaultValue={contract.date} />
        <TextField fullWidth margin="dense" label="Срок действия" type="date" name="endDate" onChange={handleChange} defaultValue={contract.date} />

        <Typography variant="h6" mt={3}>Дополнительные поля</Typography>
        {contract.additionalFields.map((field, index) => (
          <Box key={index} display="flex" alignItems="center" gap={1} mt={1}>
            <TextField fullWidth label="Название поля" value={field.name} disabled />
            <TextField fullWidth label="Значение" value={field.value} disabled />
            <IconButton onClick={() => handleRemoveField(index)} color="error">
              <Delete />
            </IconButton>
          </Box>
        ))}

        <Box display="flex" gap={1} mt={2}>
          <TextField fullWidth label="Название поля" value={newField.name} onChange={(e) => setNewField({ ...newField, name: e.target.value })} />
          <TextField fullWidth label="Значение" value={newField.value} onChange={(e) => setNewField({ ...newField, value: e.target.value })} />
          <IconButton onClick={handleAddField} color="primary">
            <Add />
          </IconButton>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="secondary">Отмена</Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">Добавить</Button>
      </DialogActions>

      {/* 🔹 Диалог создания нового клиента */}
      <Dialog open={showAddClient} onClose={() => setShowAddClient(false)}>
        <DialogTitle>Новый клиент</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Имя" value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} />
          <TextField fullWidth margin="dense" label="Email" type="email" value={newClient.email} onChange={(e) => setNewClient({ ...newClient, email: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddClient(false)}>Отмена</Button>
          <Button onClick={handleAddClient} variant="contained">Создать</Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}

export default ContractForm;
