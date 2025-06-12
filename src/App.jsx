import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import HomePage from "./Components/Pages/HomePage";
import Contracts_Page from "./Components/Pages/Contracts_Page";
import ContractDetails from "./Components/Pages/ContractDetails";
import Non_Found_Page from "./Components/Pages/Non_Found_Page";
import Layout from "./Components/Standart/Layout/Layout";
import InstallButton from "./Components/Pages/InstallButton/InstallButton";
import ProfilePage from "./Components/Pages/ProfilePage";
import { AuthProvider, useAuth } from "./AuthContext"; // ✅ без .jsx в конце
import LoginPage from "./Components/Pages/LoginPage";
import RegisterPage from "./Components/Pages/RegisterPage";
import ClientContractsPage from "./Components/Pages/ClientContractsPage";
import LawyersPage from "./Components/Pages/LawyersPage";
import ClientsPage from "./Components/Pages/ClientsPage";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Открытые страницы */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Защищённые страницы */}
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<HomePage />} />
          <Route path="contracts" element={<Contracts_Page />} />
          <Route path="client" element={<ClientContractsPage />} />
          <Route path="contracts/:id" element={<ContractDetails />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="lawyers" element={<LawyersPage />} />
          <Route path="clients" element={<ClientsPage />} />

          <Route path="*" element={<Non_Found_Page />} />
        </Route>
      </Routes>

      {/* Кнопка установки */}
      <InstallButton />
    </AuthProvider>
  );
}

export default App;
