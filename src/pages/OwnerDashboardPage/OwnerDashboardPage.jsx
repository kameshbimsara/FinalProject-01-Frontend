import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomerPage from "../CustomerPage/CustomerPage";
import OrdersPage from "../OdersPage/OrdersPage";
import SuppliersPage from "../SuppliersPage/SuppliersPage";
import BatchPage from "../BatchPage/BatchPage";
import ProductPage from "../ProductPage/ProductPage";

import {
  Home,
  Store,
  People,
  LocalShipping,
  Inventory,
  Category,
  ReceiptLong,
  Menu,
  ChevronLeft,
  Logout,
} from "@mui/icons-material";

import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import {
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import {
  Box,
  Drawer,
  Typography,
  Button,
  Stack,
  Grid,
  Card,
  CardContent
} from "@mui/material";

const drawerWidth = 288;

export default function OwnerDashboardPage() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("dashboard");
  const [token] = useState(localStorage.getItem("token"));
  const [ownerName, setOwnerName] = useState("");
  const [open, setOpen] = useState(true);

  const fetchOwnerName = () => {
    const name = localStorage.getItem("ownerName");
    setOwnerName(name);
  };
  useEffect(() => {
    fetchOwnerName();
  }, []);

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const menuItems = [
    { id: "dashboard", icon: <Home />, label: "Home" },
    { id: "customer", icon: <People />, label: "Customers" },
    { id: "suppliers", icon: <LocalShipping />, label: "Suppliers" },
    { id: "product", icon: <Inventory />, label: "Products" },
    { id: "batch", icon: <Category />, label: "Batch" },
    { id: "orders", icon: <ReceiptLong />, label: "Orders" },
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f3f4f6" }}>

      <Drawer
        variant="permanent"
        sx={{
          width: open ? drawerWidth : 72,
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : 72,
            background: "linear-gradient(135deg,#667eea,#764ba2)",
            color: "#fff",
            transition: "0.3s",
            overflowX: "hidden",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
          {open && <Typography variant="h6">SmartBiz</Typography>}
          <IconButton
            sx={{ color: "#fff", ml: "auto" }}
            onClick={() => setOpen(!open)}
          >
            {open ? <ChevronLeft /> : <Menu />}
          </IconButton>
        </Box>

        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.id}
              selected={activePage === item.id}
              onClick={() => setActivePage(item.id)}
              sx={{
                mx: 1,
                mb: 0.5,
                borderRadius: 2,
                "&.Mui-selected": {
                  bgcolor: "rgba(255,255,255,0.25)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "#fff", minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              {open && <ListItemText primary={item.label} />}
            </ListItemButton>
          ))}
        </List>

        {open && (
          <Box sx={{ mt: "auto", p: 2 }}>
            <Button
              fullWidth
              startIcon={<Logout />}
              sx={{ color: "#fff" }}
              onClick={logout}
            >
              Logout
            </Button>
          </Box>
        )}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4
        }}
      >

        <Box sx={{ p: 4, flexGrow: 1 }}>
          {activePage === "dashboard" && (

            <Typography variant="h4" fontWeight="bold" mb={4}>
              Home Page
            </Typography>

          )}

          {activePage === "customer" && token && <CustomerPage token={token} />}
          {activePage === "suppliers" && token && <SuppliersPage token={token} />}
          {activePage === "product" && token && <ProductPage token={token} />}
          {activePage === "batch" && token && <BatchPage token={token} />}
          {activePage === "orders" && token && <OrdersPage token={token} />}

        </Box>
      </Box>
    </Box>
  );
}
