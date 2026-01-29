import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Business from "../BusinessPage/BusinessPage";
import PaymentPage from "../PaymentPage/PaymentPage";

import {
  Box,
  Drawer,
  Typography,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Grid,
  Badge,
  Button,
  Paper,
} from "@mui/material";
import {
  ShoppingCart,
  TrendingUp,
  Menu,
  ChevronLeft,
  Logout,
  Home,
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const drawerWidth = 240;

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];


export default function AdminDashboardPage() {

  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("dashboard");
  const [businessList, setBusinessList] = useState([]);
  const [token] = useState(localStorage.getItem("token"));
  const [paymentList, setPaymentList] = useState([]);

  const [open, setOpen] = useState(true);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const loadAllBusiness = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/business", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setBusinessList(data);
    } catch (error) {
      console.error("Error fetching business list", error);
    }
  };

  const loadAllPayment = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/payment", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setPaymentList(data);
    } catch (error) {
      console.error("Error fetching Payment list", error);
    }
  };

  const loadAllOwners = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/business/biz/bizowner", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      const data = await response.json();
      setOwnersList(data);
    } catch (error) {
      console.error("Error fetching owners list", error);
    }
  };

  useEffect(() => {
    loadAllOwners();
    loadAllPayment();
  }, []);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
    loadAllBusiness();
  }, []);

  const paymentData = months.map((month, index) => {
    const total = paymentList
      .filter((p) => new Date(p.date).getMonth() === index)
      .reduce((sum, p) => sum + p.price, 0);

    return {
      day: month,
      amount: total,
    };
  });

  const menuItems = [
    { id: "dashboard", icon: <Home />, label: "Home" },
    { id: "business", icon: <ShoppingCart />, label: "Business" },
    { id: "payments", icon: (<Badge badgeContent={businessList.length} color="error"><TrendingUp /></Badge>), label: "Payments" },
  ];

  const stats = [
    { label: "Business", value: businessList.length },
    { label: "Payments", value: paymentList.length },
    { label: "Payment Total Revenue", value: paymentList.reduce((sum, p) => sum + p.price, 0) },
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f4f6f8" }}>

      <Drawer
        variant="permanent"
        sx={{
          width: open ? drawerWidth : 72,
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : 72,
            background: "linear-gradient(135deg,#667eea,#764ba2)",
            color: "#fff",
            transition: "0.3s",
          },
        }}
      >

        <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
          {open && <Typography variant="h6">SmartBiz</Typography>}
          <IconButton sx={{ color: "#fff", ml: "auto" }} onClick={() => setOpen(!open)}>
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
                "&.Mui-selected": { bgcolor: "rgba(255,255,255,0.25)" },
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
            <Button fullWidth startIcon={<Logout />} sx={{ color: "#fff" }} onClick={logout}>
              Logout
            </Button>
          </Box>
        )}
      </Drawer>

      <Box sx={{ p: 4, flexGrow: 1 }}>
        {activePage === "dashboard" && (
          <>
            <Typography variant="h4" fontWeight="bold" mb={4}>
              Home Page
            </Typography>

            <Grid container spacing={3} mb={4}>
              {stats.map((s, i) => (
                <Grid item xs={12} sm={6} md={3} key={i}>
                  <Card sx={{ borderTop: "10px solid #667eea", boxShadow: 10, width: 200 }}>
                    <CardContent sx={{ marginLeft: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {s.label}
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {s.value}
                      </Typography>
                      <Typography variant="caption" color="success.main">
                        {s.change}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                elevation={6}
                sx={{
                  p: 3,
                  borderRadius: 3,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="text.primary"
                  gutterBottom
                >
                  Year Payments
                </Typography>

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={paymentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar
                      dataKey="amount"
                      fill="#667eea"
                      radius={[8, 8, 0, 0]}
                      name="Amount ($)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </>

        )}

        {activePage === "business" && token && <Business token={token} />}
        {activePage === "payments" && token && <PaymentPage token={token} />}

      </Box>
    </Box>
  );
}
