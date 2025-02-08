import React, { useState } from "react";
import {
  TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Box, IconButton, Typography
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import contractService from "../../Services/contractService";

function ContractForm({ open, handleClose, refreshContracts }) {
  const [contract, setContract] = useState({
    title: "",
    client: "",
    status: "На согласовании",
    date: new Date().toISOString().split("T")[0], // Сегодняшняя дата
    additionalFields: [], // Новые поля
  });

  const [newField, setNewField] = useState({ name: "", value: "" });

  const handleChange = (e) => {
    setContract({ ...contract, [e.target.name]: e.target.value });
  };

  const handleAddField = () => {
    if (newField.name.trim() && newField.value.trim()) {
      setContract(prevContract => ({
        ...prevContract,
        additionalFields: prevContract.additionalFields
          ? [...prevContract.additionalFields, { ...newField }]
          : [{ ...newField }]
      }));
  
      // Очистка полей после добавления
      setNewField({ name: "", value: "" });
    }
  };
  
  const handleRemoveField = (index) => {
    setContract(prevContract => ({
      ...prevContract,
      additionalFields: prevContract.additionalFields.filter((_, i) => i !== index),
    }));
  };  

  const handleSubmit = () => {
    if (!contract.title || !contract.client || !contract.date) {
      alert("Заполните основные поля!");
      return;
    }

    contractService.addContract(contract);
    refreshContracts();
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Добавить договор</DialogTitle>
      <DialogContent>
        <TextField fullWidth margin="dense" label="Название" name="title" onChange={handleChange} />
        <TextField fullWidth margin="dense" label="Клиент" name="client" onChange={handleChange} />
        <TextField fullWidth margin="dense" label="Дата" type="date" name="date" onChange={handleChange} defaultValue={contract.date} />

        {/* 🔥 Дополнительные поля */}
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

        {/* 🔥 Поля для ввода нового значения */}
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
    </Dialog>
  );
}

export default ContractForm;
