import React, { useState, useEffect } from "react";
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

export default function OrdersPage({ token }) {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [ownerBusinesses, setOwnerBusinesses] = useState([]);

  const [newOrder, setNewOrder] = useState({
    customerId: "",
    date: "",
    totalAmount: "",
    businessId: "",
  });

  const [editOrder, setEditOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchCustomerId, setSearchCustomerId] = useState("");

  const loadOwnerBusinesses = async () => {
    try {
      const ownerId = localStorage.getItem("ownerId");

      const res = await fetch(
        `http://localhost:8080/api/v1/business/owner/${ownerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      setOwnerBusinesses(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/v1/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setOrders(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCustomers = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/customers", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadOwnerBusinesses();
    loadOrders();
    loadCustomers();
  }, []);

  const handleAddOrder = async () => {
    if (!newOrder.customerId || !newOrder.date || !newOrder.totalAmount || !newOrder.businessId) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newOrder),
      });

      if (!res.ok) throw new Error("Failed to create order");

      setNewOrder({
        customerId: "",
        date: "",
        totalAmount: "",
        businessId: "",
      });

      loadOrders();
      alert("Order created successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateOrder = async () => {
    if (!editOrder.customerId || !editOrder.date || !editOrder.totalAmount || !editOrder.businessId) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/v1/orders/${editOrder.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editOrder),
      });

      if (!res.ok) throw new Error("Failed to update order");

      setEditOrder(null);
      loadOrders();
      alert("Order updated successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/v1/orders/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete order");

      loadOrders();
      alert("Order deleted!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSearchOrders = async () => {
    if (!searchCustomerId) {
      alert("Please select a customer to search");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:8080/api/v1/orders/customer/${searchCustomerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error("Failed to search orders");

      const data = await res.json();
      setOrders(Array.isArray(data) ? data : [data]);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setSearchCustomerId("");
    loadOrders();
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#fff",
        p: 2,
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >

      <Typography variant="h6">Welcome To My Orders Managemant !</Typography>

      <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton color="inherit">
        </IconButton>
        <Avatar sx={{ bgcolor: "rgba(255,255,255,0.3)", color: "#fff" }}>SB</Avatar>
      </Box>
    </Box>
  );
}
