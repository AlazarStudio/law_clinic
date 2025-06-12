import React, { useEffect, useState } from "react";
import {
  Container, Typography, Table, TableBody, TableCell, TableHead,
  TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, Button, TextField
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [editUser, setEditUser] = useState(null);

  const fetchClients = () => {
    fetch("https://law-clinik-back.onrender.com/users")
      .then(res => res.json())
      .then(data => setClients(data.filter(u => u.role === "client")));
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleDelete = async (id) => {
    await fetch(`https://law-clinik-back.onrender.com/users/${id}`, { method: "DELETE" });
    fetchClients();
  };

  const handleSave = async () => {
    await fetch(`https://law-clinik-back.onrender.com/users/${editUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editUser),
    });
    setEditUser(null);
    fetchClients();
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Список клиентов</Typography>
      <Paper elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Имя</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Пароль</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.password}</TableCell>
                <TableCell>
                  <IconButton onClick={() => setEditUser(user)}><Edit /></IconButton>
                  <IconButton onClick={() => handleDelete(user.id)} color="error"><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {editUser && (
        <Dialog open={true} onClose={() => setEditUser(null)}>
          <DialogTitle>Редактировать клиента</DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField label="Имя" value={editUser.name} onChange={(e) => setEditUser({ ...editUser, name: e.target.value })} />
            <TextField label="Email" value={editUser.email} onChange={(e) => setEditUser({ ...editUser, email: e.target.value })} />
            <TextField label="Пароль" value={editUser.password} onChange={(e) => setEditUser({ ...editUser, password: e.target.value })} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditUser(null)}>Отмена</Button>
            <Button onClick={handleSave} variant="contained">Сохранить</Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default ClientsPage;
