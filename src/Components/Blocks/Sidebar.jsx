import React, { useState } from "react";
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip, IconButton } from "@mui/material";
import { Home, Description, AccountCircle, Menu as MenuIcon, ArrowBackIos } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  // Загружаем состояние меню из localStorage
  const [open, setOpen] = useState(() => {
    return localStorage.getItem("sidebarOpen") === "true";
  });

  const toggleSidebar = () => {
    const newState = !open;
    setOpen(newState);
    localStorage.setItem("sidebarOpen", newState);
  };

  const menuItems = [
    { text: "Главная", icon: <Home />, link: "/" },
    { text: "Договоры", icon: <Description />, link: "/contracts" },
    { text: "Профиль", icon: <AccountCircle />, link: "/profile" },
  ];

  const location = useLocation(); // Получаем текущий маршрут

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? 240 : 80,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: open ? 240 : 80,
          boxSizing: "border-box",
          transition: "0.3s",
          display: "flex",
          flexDirection: "column",
          alignItems: open ? "flex-start" : "center",
          paddingTop: 1,
        },
      }}
    >
      {/* Кнопка сворачивания меню */}
      <ListItem disablePadding sx={{ display: "flex", justifyContent: open ? "flex-end" : "center", width: "100%", p: 1 }}>
        <IconButton onClick={toggleSidebar}>
          {open ? <ArrowBackIos /> : <MenuIcon />}
        </IconButton>
      </ListItem>

      <List sx={{ width: "100%" }}>
        {menuItems.map((item, index) => (
          <Tooltip key={index} title={!open ? item.text : ""} placement="right">
            <ListItem disablePadding sx={{ display: "flex", justifyContent: open ? "flex-start" : "center" }}>
              <ListItemButton
                component={Link}
                to={item.link}
                selected={location.pathname === item.link} // Выделение активного элемента
                sx={{
                  justifyContent: open ? "flex-start" : "center",
                  backgroundColor: location.pathname === item.link ? "rgba(0, 0, 0, 0.08)" : "transparent",
                  "&.Mui-selected": {
                    backgroundColor: "rgba(0, 0, 0, 0.15)",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.2)"
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 0, justifyContent: "center" }}>{item.icon}</ListItemIcon>
                {open && <ListItemText primary={item.text} sx={{ marginLeft: 2 }} />}
              </ListItemButton>
            </ListItem>
          </Tooltip>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
