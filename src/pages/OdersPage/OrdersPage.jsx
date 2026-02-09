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
import axios from "axios";
import Swal from "sweetalert2";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";



export default function OrdersPage({ token }) {
  const [view, setView] = useState("add");
  const [orders, setOrders] = useState(JSON.parse(localStorage.getItem("orders")) || []);
  const businessId = Number(localStorage.getItem("businessId"));
  const [customer, setCustomer] = useState("");
  const [customerInfo, setCustomerInfo] = useState(null);
  const [loadingCustomer, setLoadingCustomer] = useState(false);
  const [items, setItems] = useState([{ product: "", quantity:0, price: 0 }]);
  const [customerPhoneMap, setCustomerPhoneMap] = useState({});
  const [product, setProduct] = useState("");

  const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);


  const fetchCustomer = async () => {
    if (!customer) {
      Swal.fire({
        icon: "warning",
        title: "Missing phone number",
        text: "Please enter the customer's phone number",
        confirmButtonColor: "#8b29f4",
      });
      return;
    }

    try {
      setLoadingCustomer(true);

      const res = await axios.post(
        "http://localhost:8080/api/customers/phoneNumber",
        {
          phoneNumber: customer,
          businessId: businessId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCustomerInfo(res.data);
    } catch (err) {
      setCustomerInfo(null);
      Swal.fire({
        icon: "error",
        title: "Customer not found",
        text: "No customer exists with this phone number",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoadingCustomer(false);
    }
  };


  const addItem = () => {
    setItems([...items, { product: "", quantity: 0, price: 0 }]);
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


  const createOrder = async () => {
    if (!customerInfo) {
      Swal.fire({
        icon: "error",
        title: "Customer required",
        text: "Please search and select a customer before creating the order",
        confirmButtonColor: "#d33",
      });
      return;
    }

    if (items.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No items added",
        text: "Please add at least one product to the order",
        confirmButtonColor: "#8b29f4",
      });
      return;
    }


    try {
      const orderDetails = [];

      for (const item of items) {
        const productRes = await axios.post(
          "http://localhost:8080/api/v1/products/productName",
          {
            productName: item.product,
            businessId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        orderDetails.push({
          productId: productRes.data.id,
          quantity: item.quantity,
          price: item.price,
        });
      }

      const newOrder = {
        customerId: customerInfo.id,
        businessId,
        orderDetails,
        totalAmount,
      };

      await axios.post("http://localhost:8080/api/v1/orders", newOrder, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        icon: "success",
        title: "Order created successfully",
        timer: 2000,
        showConfirmButton: false,
      });

      setCustomer("");
      setCustomerInfo(null);
      setItems([{ product: "", quantity: 1, price: 0 }]);
      setView("view");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to create order",
        text: err.response?.data?.message || "Something went wrong",
        confirmButtonColor: "#d33",
        confirmButtonText: "OK",
      });
    }
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


  const loadOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/v1/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(res.data);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to load orders",
        text: "Could not fetch orders from server",
      });
    }
  };


  const loadCustomers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/customers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Build ID → phone map
      const map = {};
      res.data.forEach(customer => {
        map[customer.id] = customer.phone;
      });

      setCustomerPhoneMap(map);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to load customers",
        text: "Could not fetch customer data",
      });
    }
  };

   const loadProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/v1/products",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const map = {};
      res.data.forEach(product => {
        map[product.id] = product.name;
      });

      setProduct(map);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to load products",
        text: "Could not fetch product data",
      });
    }
  };


  useEffect(() => {
    if (view === "view") {
      loadOrders();
      loadCustomers();
    }else{
      (view === "details")
      loadOrders();
      loadProducts();
    }
  }, [view]);

  const orderDetails = orders.flatMap(order =>
    (order.orderDetails || []).map(detail => ({
      id: detail.id,
      orderId: order.id,
      productId: detail.productId,
      quantity: detail.quantity,
      price: detail.price,
    }))
  );

  return (
    <Box>
      {/* HEADER */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "#fff",
          p: 2,
          borderRadius: 2,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6">
          Welcome To My Orders Management!
        </Typography>

        <Chip 
        icon={<ReceiptLong />} 
        label={`${orders.length} Orders`}
        color="secondary" />
      </Box>

      {/* TABS */}
      <Box sx={{ display: "flex", gap: 2, mt: 3, mb: 4 }}>
        <Button
          variant={view === "add" ? "contained" : "outlined"}
          onClick={() => setView("add")}
          sx={buttonStyle}
        >
          New Order
        </Button>
        <Button
          variant={view === "view" ? "contained" : "outlined"}
          onClick={() => setView("view")}
          sx={buttonStyle}
        >
          View Orders
        </Button>
        <Button
          variant={view === "details" ? "contained" : "outlined"}
          onClick={() => setView("details")}
          sx={buttonStyle}
        >
          View Order Details
        </Button>
      </Box>

      {/* ADD ORDER */}
      {view === "add" && (
        <Card>
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

              <Grid item xs={12} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={buttonStyle}
                  onClick={fetchCustomer}
                  disabled={loadingCustomer}
                >
                  Search Customer
                </Button>
              </Grid>
            </Grid>

            {customerInfo && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid #8b29f4ff",
                  backgroundColor: "rgba(139, 41, 244, 0.05)",
                }}
              >
                <Typography>
                  <b>Customer Name:</b> {customerInfo.name}
                </Typography>
                <Typography>
                  <b>Customer ID:</b> {customerInfo.id}
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6">Order Items</Typography>

            {items.map((item, index) => (
              <Grid container spacing={2} mt={1} key={index}>
                <Grid item xs={12} md={5}>
                  <TextField
                    fullWidth
                    label="Product Name"
                    value={item.product}
                    onChange={(e) =>
                      handleItemChange(index, "product", e.target.value)
                    }
                  />
                </Grid>

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

                <Grid item xs={12} md={2}>
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

            <Button onClick={addItem} sx={{ mt: 2, color: "#8b29f4ff" }}>
              + Add Item
            </Button>

            <TextField
              fullWidth
              label="Total Amount"
              value={totalAmount.toFixed(2)}
              InputProps={{ readOnly: true }}
              sx={{ my: 3 }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={createOrder}
              sx={buttonStyle}
              disabled={!customerInfo}
            >
              Create Order
            </Button>
          </CardContent>
        </Card>
      )}


      {view === "view" && (
        <Card>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Orders List
            </Typography>

            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ bgcolor: "#8b29f4ff" }}>
                  <TableRow>
                    <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Order Date</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Total Amount</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Customer No</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        No orders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          {order.date
                            ? new Date(order.date).toLocaleDateString()
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {order.totalAmount?.toFixed
                            ? order.totalAmount.toFixed(2)
                            : order.totalAmount}
                        </TableCell>
                        <TableCell>{customerPhoneMap[order.customerId]}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

          </CardContent>
        </Card>
      )}

      {view === "details" && (
        <Card>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Order Details List
            </Typography>

            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ bgcolor: "#8b29f4ff" }}>
                  <TableRow>
                    <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                      Order ID
                    </TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                      Product Name
                    </TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                      Quantity
                    </TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                      Unit Price
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {orderDetails.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No order details found
                      </TableCell>
                    </TableRow>
                  ) : (
                    orderDetails.map((detail) => (
                      <TableRow key={detail.id}>
                        <TableCell>{detail.orderId}</TableCell>
                        <TableCell>{product[detail.productId]}</TableCell>
                        <TableCell>{detail.quantity}</TableCell>
                        <TableCell>
                          {detail.price.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}





    </Box>
  );
}
