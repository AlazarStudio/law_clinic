import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../Blocks/Sidebar";
import Header from "../../Blocks/Header";
import Footer from "../../Blocks/Footer";
import { Box, Container } from "@mui/material";
import { useAuth } from "../../../AuthContext";

const Layout = () => {
  const { user } = useAuth();
  return (
    <Box display="flex">
      {user && <Sidebar />}
      <Box flex={1} display="flex" flexDirection="column">
        <Header />
        <Container sx={{ mt: 2, flexGrow: 1 }}>
          <Outlet />
        </Container>
        {/* <Footer /> */}
      </Box>
    </Box>
  );
};

export default Layout;
