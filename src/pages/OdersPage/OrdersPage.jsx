import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
} from "@mui/material";
import { ReceiptLong } from "@mui/icons-material";
import axios from "axios";
import Swal from "sweetalert2";
import { PRIMARY_COLOR, PRIMARY_GRADIENT } from "../../theme/color";

export default function OrdersPage({ token }) {
  const [view, setView] = useState("add");
  const [orders, setOrders] = useState(JSON.parse(localStorage.getItem("orders")) || []);
  const [customer, setCustomer] = useState("");
  const [customerInfo, setCustomerInfo] = useState(null);
  const [loadingCustomer, setLoadingCustomer] = useState(false);
  const [customerPhoneMap, setCustomerPhoneMap] = useState({});
  const [searchDate, setSearchDate] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [productDataMap, setProductDataMap] = useState({});
  const [searchPhone, setSearchPhone] = useState("");
  const [searchOrderId, setSearchOrderId] = useState("");

  const businessId = Number(localStorage.getItem("businessId"));

  const [items, setItems] = useState([{ productId: "", quantity: "", price: 0, productName: "" }]);

  const totalAmount = items
    .filter(item => item.quantity > 0 && item.price > 0)
    .reduce((sum, item) => sum + item.quantity * item.price, 0);

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
    setItems([...items, { productId: "", quantity: 0, price: 0, productName: "" }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = field === "productId" ? value : parseFloat(value) || 0;
    setItems(updated);
  };

  const createOrder = async () => {

    const validItems = items.filter(item => item.quantity > 0 && item.price > 0 && item.productId);
    if (validItems.length === 0) {
      Swal.fire({ icon: 'warning', title: 'No valid items', text: 'Add items with available stock' });
      return;
    }

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
      const orderDetails = validItems.map(item => ({
        productId: Number(item.productId),
        quantity: item.quantity,
        price: item.price,
      }));

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

  const searchOrders = async () => {
    try {
      if (searchOrderId) {
        const res = await axios.get(
          `http://localhost:8080/api/v1/orders/${searchOrderId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setOrders([res.data]);
        return;
      }

      if (searchPhone) {
        const res = await axios.post(
          "http://localhost:8080/api/v1/orders/customerPhone",
          {
            customerPhone: searchPhone,
            businessId,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setOrders(res.data);
        return;
      }

      if (searchDate) {
        const res = await axios.post(
          "http://localhost:8080/api/v1/orders/orderDate",
          { date: searchDate, businessId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setOrders(res.data);
        return;
      }

      Swal.fire({
        icon: "warning",
        title: "No search criteria",
        text: "Please enter Order ID, Customer Phone, or Date",
      });

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Search failed",
        text: "No orders found",
      });
    }
  };

  const buttonStyle = {
    borderColor: PRIMARY_COLOR,
    color: PRIMARY_COLOR,
    fontWeight: "bold",

    "&:hover": {
      borderColor: PRIMARY_COLOR,
      background: PRIMARY_GRADIENT,
      color: "#fff"
    },

    "&.MuiButton-contained": {
      background: PRIMARY_GRADIENT,
      color: "#fff",
    },
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
        map[product.id] = {
          name: product.name,
          businessId: product.businessId
        };
      });
      setProductDataMap(map);

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to load products",
        text: "Could not fetch product data",
      });
    }
  };


  const fetchBatchesByProduct = async (productId, index) => {
    try {
      const batchRes = await axios.get(
        `http://localhost:8080/api/v1/batches/product/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const availableBatches = batchRes.data.filter(
        batch => batch.quantity > 0
      );

      if (availableBatches.length === 0) {
        setItems(prev => {
          const updated = [...prev];
          updated[index].price = 0;
          return updated;
        });
        return;
      }

      const soonestBatch = availableBatches.reduce((a, b) =>
        new Date(a.expireDate) < new Date(b.expireDate) ? a : b
      );

      setItems(prev => {
        const updated = [...prev];
        updated[index].price = soonestBatch.unitPrice;
        return updated;
      });

    } catch (err) {
      console.warn("Batch fetch failed", err);
    }
  };

  useEffect(() => {
    loadCustomers();
    loadProducts();
  }, []);

  const orderDetails = orders
    .flatMap(order =>
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
      </Box>

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
                    type="number"
                    label="Product ID"
                    value={item.productId}
                    onChange={(e) =>
                      handleItemChange(index, "productId", e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();

                        if (item.productId) {
                          const product = productDataMap[item.productId];

                          if (!product) {
                            Swal.fire({
                              icon: "error",
                              title: "Invalid Product ID",
                              text: "This product does not exist",
                            });
                            return;
                          }

                          if (product.businessId !== businessId) {
                            Swal.fire({
                              icon: "error",
                              title: "Unauthorized Product",
                              text: "This product does not belong to your business",
                            });

                            setItems(prev => {
                              const updated = [...prev];
                              updated[index] = {
                                ...updated[index],
                                productId: "",
                                productName: "",
                                price: 0,
                                quantity: ""
                              };
                              return updated;
                            });
                            return;
                          }

                          fetchBatchesByProduct(item.productId, index);

                          setItems(prev => {
                            const updated = [...prev];
                            updated[index].productName = product.name;
                            return updated;
                          });
                        }

                      }
                    }}
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <TextField
                    fullWidth
                    label="Product Name"
                    value={item.productName}
                  />
                </Grid>
                <Grid item xs={6} md={2}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Qty"
                    disabled={!item.price}
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
                    label="Unit Price"
                    value={item.price}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Total"
                    value={(item.quantity * item.price || 0).toFixed(2)}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => removeItem(index)}
                    sx={buttonStyle}
                  >
                    Remove
                  </Button>
                </Grid>
              </Grid>
            ))}

            <Button onClick={addItem} sx={{ mt: 2, color: PRIMARY_COLOR }}>
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
              Add Order
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

            <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
              <TextField
                type="date"
                label="Order Date"
                InputLabelProps={{ shrink: true }}
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
              />

              <TextField
                label="Customer Phone"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
              />

              <TextField
                label="Order ID"
                type="number"
                value={searchOrderId}
                onChange={(e) => setSearchOrderId(e.target.value)}
              />

              <Button
                variant="contained"
                sx={buttonStyle}
                onClick={searchOrders}
              >
                Search
              </Button>

              <Button
                variant="outlined"
                sx={buttonStyle}
                onClick={() => {
                  setOrders([]);
                  setSearchDate("");
                  setSearchPhone("");
                  setSearchOrderId("");
                }}
              >
                Reset
              </Button>
            </Box>

            {orders.length === 0 ? (
              <Typography align="center" color="text.secondary">
                {searchDate
                  ? "No orders found for this date."
                  : "Please select a date to view orders."}
              </Typography>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{ background: PRIMARY_GRADIENT }}>
                    <TableRow>
                      <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                        Order Date
                      </TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                        Total Amount
                      </TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                        Customer No
                      </TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                        View Details
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {orders.map((order) => (
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
                        <TableCell>
                          <Button
                            variant="contained"
                            size="small"
                            sx={buttonStyle}
                            onClick={async () => {
                              if (!Object.keys(productDataMap).length) {
                                await loadProducts(); // make sure products are loaded
                              }
                              setSelectedOrder(order);
                              setOpenDialog(true);
                            }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      )}

      {selectedOrder && (
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <Card sx={{ m: 2, p: 2, borderRadius: 3 }}>
            <Typography variant="h6" mb={2}>Order Details</Typography>
            <Typography variant="subtitle1" mb={1}><b>Order Date:</b> {selectedOrder.date ? new Date(selectedOrder.date).toLocaleDateString() : "N/A"}</Typography>
            <Typography variant="subtitle1" mb={2}><b>Total Amount:</b> {selectedOrder.totalAmount?.toFixed(2)}</Typography>
            <Divider sx={{ my: 1 }} />

            {(selectedOrder.orderDetails || []).map((detail, index) => (
              <Box key={detail.id} sx={{ display: "flex", justifyContent: "space-between", mb: 1, p: 1, borderRadius: 2, backgroundColor: "rgba(139, 41, 244, 0.05)" }}>
                <Typography>
                  {productDataMap[detail.productId]?.name || "Product"}
                </Typography>
                <Typography>Qty: {detail.quantity} | Price: {detail.price.toFixed(2)}</Typography>
              </Box>
            ))}

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button variant="outlined" sx={buttonStyle} onClick={() => setOpenDialog(false)}>Close</Button>
            </Box>
          </Card>
        </Dialog>
      )}
    </Box>
  );
}
