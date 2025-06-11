const API_URL = "https://law-clinik-back.onrender.com/contracts";

const getContracts = async (userId) => {
  const res = await fetch(`${API_URL}?userId=${userId}`);
  return await res.json();
};

const addContract = async (contract) => {
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contract),
  });
};

const deleteContract = async (id) => {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });
};

export default {
  getContracts,
  addContract,
  deleteContract,
};
