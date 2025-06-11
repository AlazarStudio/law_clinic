import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Container, Box, List, ListItem, ListItemText, IconButton } from "@mui/material";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import SignatureCanvas from "react-signature-canvas";
import contractService from "../../Services/contractService";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Delete } from "@mui/icons-material";


function ContractDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [prevContract, setPrevContract] = useState(null);
  const signatureRef = useRef(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [newField, setNewField] = useState({ name: "", value: "" });

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const res = await fetch(`http://localhost:5000/contracts/${id}`);
        if (!res.ok) throw new Error("Contract not found");
        const data = await res.json();
        setContract(data);
        setPrevContract({ ...data });
      } catch {
        navigate("/contracts");
      }
    };

    fetchContract();
  }, [id, navigate]);


  const addHistoryRecord = async (action) => {
    const timestamp = new Date().toLocaleString();
    const updatedContract = {
      ...contract,
      history: contract.history ? [...contract.history, { action, timestamp }] : [{ action, timestamp }]
    };
    setContract(updatedContract);
    await fetch(`http://localhost:5000/contracts/${updatedContract.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedContract),
    });
  };


  const handleChange = (e) => {
    const { name, value } = e.target;

    // Проверяем, изменилось ли значение
    if (prevContract[name] !== value) {
      addHistoryRecord(`Изменено поле "${name}": "${prevContract[name]}" → "${value}"`);
    }

    setContract({ ...contract, [name]: value });
    setPrevContract({ ...contract, [name]: value }); // Обновляем копию
  };

  const handleSave = async () => {
    addHistoryRecord("Договор сохранён");
    const updatedContract = { ...contract };
    await fetch(`http://localhost:5000/contracts/${updatedContract.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedContract),
    });
    navigate("/contracts");
  };


  const handleSignContract = async () => {
    addHistoryRecord("Договор подписан");
    const updatedContract = { ...contract, status: "Подписан" };
    await fetch(`http://localhost:5000/contracts/${updatedContract.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedContract),
    });
    setContract(updatedContract);
  };


  const handleSaveSignature = async () => {
    if (signatureRef.current) {
      const signatureData = signatureRef.current.toDataURL();
      addHistoryRecord("Добавлена новая подпись");

      const updatedContract = { ...contract, signature: signatureData };
      await fetch(`http://localhost:5000/contracts/${updatedContract.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedContract),
      });
      setContract(updatedContract);
    }
  };


  const handleDownloadPDF = async () => {
    const doc = new jsPDF();

    const fontUrl = "/fonts/Roboto-Regular.ttf";
    const fontData = await fetch(fontUrl).then(res => res.arrayBuffer());
    const fontBase64 = btoa(
      new Uint8Array(fontData).reduce((data, byte) => data + String.fromCharCode(byte), "")
    );

    doc.addFileToVFS("Roboto-Regular.ttf", fontBase64);
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    doc.setFont("Roboto");

    doc.setFontSize(16);
    doc.text("Договор", 105, 20, { align: "center" });

    doc.setFontSize(12);
    const contractData = [
      ["Название", contract.title],
      ["Клиент", contract.client],
      ["Статус", contract.status],
      ["Дата", contract.date],
      ["Срок действия", contract.endDate || "—"]
    ];

    if (contract.additionalFields && contract.additionalFields.length > 0) {
      contract.additionalFields.forEach(field => {
        contractData.push([field.name, field.value]);
      });
    }

    doc.autoTable({
      startY: 30,
      head: [["Поле", "Значение"]],
      body: contractData,
      theme: "grid",
      styles: { font: "Roboto", fontSize: 12 },
    });

    if (contract.signature) {
      const imgWidth = 100;
      const imgHeight = 50;
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;

      doc.text("Подписано:", pageWidth / 2 - 20, pageHeight - 70);
      doc.addImage(contract.signature, "PNG", pageWidth / 2 - imgWidth / 2, pageHeight - 60, imgWidth, imgHeight);
    }

    doc.save(`${contract.title}.pdf`);
  };

  if (!contract) return <Typography>Загрузка...</Typography>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Редактирование договора</Typography>

      <TextField fullWidth margin="dense" label="Название" name="title" value={contract.title} onChange={handleChange} />
      <TextField fullWidth margin="dense" label="Клиент" name="client" value={contract.client} onChange={handleChange} />
      <TextField fullWidth margin="dense" label="Дата" type="date" name="date" value={contract.date} onChange={handleChange} />
      <TextField fullWidth margin="dense" label="Срок действия" type="date" name="endDate" value={contract.endDate || ""} onChange={handleChange} />


      {/* Отображение и редактирование дополнительных полей */}
      <Box mt={3}>
        <Typography variant="h6">Дополнительные поля</Typography>

        {contract.additionalFields && contract.additionalFields.length > 0 ? (
          contract.additionalFields.map((field, index) => (
            <Box key={index} display="flex" alignItems="center" gap={1} mt={1}>
              <TextField
                fullWidth
                margin="dense"
                label="Название поля"
                value={field.name}
                onChange={(e) => {
                  const updatedFields = contract.additionalFields.map((f, i) =>
                    i === index ? { ...f, name: e.target.value } : f
                  );
                  setContract({ ...contract, additionalFields: updatedFields });
                }}
              />
              <TextField
                fullWidth
                margin="dense"
                label="Значение"
                value={field.value}
                onChange={(e) => {
                  const updatedFields = contract.additionalFields.map((f, i) =>
                    i === index ? { ...f, value: e.target.value } : f
                  );
                  setContract({ ...contract, additionalFields: updatedFields });
                }}
              />
              <IconButton
                color="error"
                onClick={() => {
                  const updatedFields = contract.additionalFields.filter((_, i) => i !== index);
                  setContract({ ...contract, additionalFields: updatedFields });
                }}
              >
                <Delete />
              </IconButton>
            </Box>
          ))
        ) : (
          <Typography color="textSecondary">Дополнительных полей нет</Typography>
        )}

        {/* Форма для добавления нового дополнительного поля */}
        <Box display="flex" gap={1} mt={2}>
          <TextField
            fullWidth
            label="Название нового поля"
            value={newField.name}
            onChange={(e) => setNewField({ ...newField, name: e.target.value })}
          />
          <TextField
            fullWidth
            label="Значение нового поля"
            value={newField.value}
            onChange={(e) => setNewField({ ...newField, value: e.target.value })}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (newField.name.trim() && newField.value.trim()) {
                setContract(prev => ({
                  ...prev,
                  additionalFields: prev.additionalFields
                    ? [...prev.additionalFields, { ...newField }]
                    : [{ ...newField }]
                }));
                setNewField({ name: "", value: "" });
              }
            }}
          >
            +
          </Button>
        </Box>
      </Box>



      <Typography variant="h6" style={{ marginTop: 20 }}>Статус: {contract.status}</Typography>

      {contract.status !== "Подписан" && (
        <Box mt={2}>
          <Typography variant="h6">Подпись</Typography>
          <SignatureCanvas
            ref={signatureRef}
            penColor="black"
            canvasProps={{ width: 300, height: 100, className: "signatureCanvas" }}
          />
          <Button variant="contained" color="primary" onClick={handleSaveSignature} style={{ marginTop: 10 }}>
            Сохранить подпись
          </Button>
        </Box>
      )}

      {contract.signature && (
        <Box mt={2}>
          <Typography variant="h6">Подпись:</Typography>
          <img src={contract.signature} alt="Подпись" style={{ width: 200, height: 50 }} />
        </Box>
      )}

      <Box mt={2}>
        <Button
          variant="outlined"
          onClick={() => setHistoryOpen(!historyOpen)}
          endIcon={historyOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        >
          {historyOpen ? "Скрыть историю" : "Показать историю"}
        </Button>

        {historyOpen && (
          <List>
            {contract.history?.map((entry, index) => (
              <ListItem key={index}>
                <ListItemText primary={entry.action} secondary={entry.timestamp} />
              </ListItem>
            ))}
          </List>
        )}
      </Box>


      <Box mt={3} mb={3} display="flex" gap={2}>
        <Button variant="contained" color="primary" onClick={handleSave}>Сохранить</Button>
        <Button variant="outlined" color="secondary" onClick={() => navigate("/contracts")}>Назад</Button>
        <Button variant="contained" color="success" onClick={handleDownloadPDF}>Скачать PDF</Button>
        {contract.status !== "Подписан" && (
          <Button variant="contained" color="warning" onClick={handleSignContract}>Подписать договор</Button>
        )}
      </Box>
    </Container>
  );
}

export default ContractDetails;
