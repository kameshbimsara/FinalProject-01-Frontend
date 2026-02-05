import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider
} from "@mui/material";
import { IconButton, Chip } from "@mui/material";
import { ReceiptLong } from "@mui/icons-material";


export default function OrdersPage() {
  const [view, setView] = useState("add");
  const [orders, setOrders] = useState(
    JSON.parse(localStorage.getItem("orders")) || []
  );

  const [customer, setCustomer] = useState("");
  const [product, setProduct] = useState("");
  const [orderDate, setOrderDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [items, setItems] = useState([
    { product: "", quantity: 1, price: 0 }
  ]);

  const totalAmount = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const addItem = () => {
    setItems([...items, { product: "", quantity: 1, price: 0 }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] =
      field === "product" ? value : parseFloat(value) || 0;
    setItems(updated);
  };

  const createOrder = () => {
    if (items.length === 0) return alert("Add at least one item");

    const newOrder = {
      id: "ORD-" + Date.now(),
      customer,
      date: orderDate,
      orderDetails: items,
      totalAmount
    };

    setOrders([...orders, newOrder]);

    setCustomer("");
    setItems([{ product: "", quantity: 1, price: 0 }]);
    setView("view");
  };

  const buttonStyle = {
    borderColor: "#8b29f4ff",
    color: "#8b29f4ff",
    "&:hover": {
      borderColor: "#8b29f4ff",
      backgroundColor: "rgba(139, 41, 244, 0.08)",
    },
    "&.MuiButton-contained": {
      backgroundColor: "#8b29f4ff",
      color: "#fff",
      "&:hover": {
        backgroundColor: "#6f1fd1",
      },
    },
  };


  return (
    <Box>
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
          <Grid item>
            <Chip
              icon={<ReceiptLong />}
              // label={`${suppliers} Suppliers`}
              color="secondary"
            />
          </Grid>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 4, mt: 3 }}>
        <Button
          variant={view === "add" ? "contained" : "outlined"}
          onClick={() => setView("add")}
          sx={buttonStyle}
        >
          New Order
        </Button>
        <Button
          variant={view === "view order" ? "contained" : "outlined"}
          onClick={() => setView("view order")}
          sx={buttonStyle}
        >
          View Orders
        </Button>
        <Button
          variant={view === "view order details" ? "contained" : "outlined"}
          onClick={() => setView("view order details")}
          sx={buttonStyle}
        >
          View Order Details
        </Button>
      </Box>

      {view === "add" && (
        <Card sx={{ p: 3 }}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Customer Phone Number"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Product Name"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Order Date"
                  InputLabelProps={{ shrink: true }}
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" mb={2}>
              Order Items
            </Typography>

            {items.map((item, index) => (
              <Grid container spacing={2} mb={2} key={index}>

                <Grid item xs={6} md={2}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Qty"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", e.target.value)
                    }
                  />
                </Grid>

                <Grid item xs={6} md={3}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Price"
                    value={item.price}
                    onChange={(e) =>
                      handleItemChange(index, "price", e.target.value)
                    }
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <Button
                    color="error"
                    fullWidth
                    variant="outlined"
                    onClick={() => removeItem(index)}
                  >
                    Remove
                  </Button>
                </Grid>
              </Grid>
            ))}

            <Button onClick={addItem} sx={{ mb: 3, color: "#8b29f4ff" }}>
              + Add Item
            </Button>

            <TextField
              fullWidth
              label="Total Amount"
              value={totalAmount.toFixed(2)}
              InputProps={{ readOnly: true }}
              sx={{ mb: 3 }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={createOrder}
              sx={buttonStyle}
            >
              Create Order
            </Button>
          </CardContent>
        </Card>
      )}

      {/* VIEW ORDERS */}
      {view === "view" && (
        <Box sx={{ display: "grid", gap: 3 }}>
          {orders.length === 0 && (
            <Typography align="center" color="text.secondary">
              No orders yet
            </Typography>
          )}

          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent>
                <Typography variant="h5">{order.id}</Typography>
                <Typography color="text.secondary" mb={2}>
                  {new Date(order.date).toDateString()}
                </Typography>

                <Typography mb={1}>
                  Customer: <b>{order.customer}</b>
                </Typography>

                <Divider sx={{ my: 2 }} />

                {order.orderDetails.map((item, i) => (
                  <Grid container key={i} mb={1}>
                    <Grid item xs={4}>{item.product}</Grid>
                    <Grid item xs={2}>{item.quantity}</Grid>
                    <Grid item xs={3}>${item.price.toFixed(2)}</Grid>
                    <Grid item xs={3}>
                      ${(item.quantity * item.price).toFixed(2)}
                    </Grid>
                  </Grid>
                ))}

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" color="primary">
                  Total: ${order.totalAmount.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}
