import React, { useState, useEffect } from "react";
import {
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  Typography,
  Button,
  Stack,
  Grid,
} from "@mui/material";
import {
  InputAdornment,
  Chip
} from "@mui/material";

import {
  Search,
  People,
  Email,
  Phone,
  LocationOn,
  CalendarMonth,
  ShoppingBag,
  Edit,
  Delete
} from "@mui/icons-material";
import axios from "axios";
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css';
import { PRIMARY_COLOR, PRIMARY_GRADIENT } from "../../theme/color";

export default function CustomerPage({ token }) {

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "" });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCustomer, setEditCustomer] = useState({ id: null, name: "", phone: "" });
  const openEditModal = (customer) => {
    setEditCustomer({ id: customer.id, name: customer.name, phone: customer.phone });
    setShowEditModal(true);
  };

  const ownerName = localStorage.getItem("ownerName");
  const businessId = localStorage.getItem("businessId");
  
  const loadCustomers = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/customers/business/${businessId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCustomers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setCustomers([]);
    }
  };

  useEffect(() => {
    if (token && businessId) loadCustomers();
  }, [token, businessId]);

  const searchCustomerByPhone = async () => {
    if (!searchTerm.trim()) {
      loadCustomers();
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:8080/api/customers/phoneNumber",
        {
          phoneNumber: searchTerm,
          businessId: parseInt(businessId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCustomers(Array.isArray(res.data) ? res.data : [res.data]);

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Customer not found",
        confirmButtonColor: "#8b29f4ff",
      });
    }
  };

  const submitAddCustomer = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/customers",
        { ...newCustomer, businessId: parseInt(businessId) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowAddModal(false);
      setNewCustomer({ name: "", phone: "" });
      loadCustomers();
      Swal.fire({ position: "top-end", icon: "success", title: "Customer added", showConfirmButton: false, timer: 1500 });
    } catch (err) {
      console.error("Failed to add customer", err);
      Swal.fire({ position: "top-end", icon: "error", title: "Failed to add customer", showConfirmButton: false, timer: 1500 });
    }
  };

  const submitEditCustomer = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/customers/${editCustomer.id}`,
        { name: editCustomer.name, phone: editCustomer.phone },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowEditModal(false);
      setEditCustomer({ id: null, name: "", phone: "" });
      loadCustomers();
      Swal.fire({ position: "top-end", icon: "success", title: "Customer updated", showConfirmButton: false, timer: 1500 });
    } catch (err) {
      console.error("Failed to update customer", err);
      Swal.fire({ position: "top-end", icon: "error", title: "Failed to update customer", showConfirmButton: false, timer: 1500 });
    }
  };


  const deleteCustomer = async (id) => {
    const result = await Swal.fire({
      title: "Delete Customer?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#8b29f4",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:8080/api/customers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadCustomers();
      Swal.fire({ position: "top-end", icon: "success", title: "Customer deleted", showConfirmButton: false, timer: 1500 });
    } catch (err) {
      console.error(err);
      Swal.fire({ position: "top-end", icon: "error", title: "Failed to delete customer", showConfirmButton: false, timer: 1500 });
    }
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

        <Typography variant="h6">Welcome To My Customers Managemant !</Typography>

        <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton color="inherit">
          </IconButton>
          <Grid item>
            <Chip
              icon={<People />}
              label={`${customers.length} Customers`}
              color="secondary"
            />
          </Grid>
        </Box>
      </Box>

      <Box sx={{ p: 4 }}>
        <Button variant="contained" onClick={() => setShowAddModal(true)}
          sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", fontWeight: 'bold', position: 'absolute', top: 150, right: 70 }}>
          + Add Customer
        </Button>
      </Box>


      <Dialog open={showAddModal} onClose={() => setShowAddModal(false)}>
        <DialogTitle sx={{ background:PRIMARY_GRADIENT, color: "#fff" }}>Add Customer</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 400, mt: 2}}>
          <TextField label="Name" value={newCustomer.name} onChange={e => setNewCustomer(prev => ({ ...prev, name: e.target.value }))} />
          <TextField label="Phone" value={newCustomer.phone} onChange={e => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddModal(false)} sx={{ color: PRIMARY_COLOR }}>Cancel</Button>
          <Button variant="contained" sx={{ background: PRIMARY_GRADIENT }} onClick={submitAddCustomer}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showEditModal} onClose={() => setShowEditModal(false)}>
        <DialogTitle sx={{ background: PRIMARY_GRADIENT, color: "#fff" }}>Edit Customer</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 400 }}>
          <TextField
            sx={{ mt: 2 }}
            label="Name"
            value={editCustomer.name}
            onChange={e => setEditCustomer(prev => ({ ...prev, name: e.target.value }))}
          />
          <TextField
            label="Phone"
            value={editCustomer.phone}
            onChange={e => setEditCustomer(prev => ({ ...prev, phone: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEditModal(false)} sx={{ color: PRIMARY_GRADIENT }}>Cancel</Button>
          <Button variant="contained" sx={{ background: PRIMARY_GRADIENT }} onClick={submitEditCustomer}>Save</Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ minHeight: "100vh", bgcolor: "#f9fafb" }}>

        <Box sx={{ maxWidth: "100%", mx: "auto", px: 2, mt: 4 }}>
          <TextField
            fullWidth
            placeholder="Search customers by phone..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
            sx={{ mb: 3 }}
          />
          <Button
            variant="contained"
            onClick={searchCustomerByPhone}
            sx={{
              mb: 3,
              background: PRIMARY_GRADIENT,
              fontWeight: "bold",
              px: 4,
            }}
          >
            Search
          </Button>

          {customers.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ background: PRIMARY_GRADIENT }}>
                  <TableRow>
                    <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                      <b>Name</b>
                    </TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                      <b>Phone</b>
                    </TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                      <b>Action</b>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {customers.map(customer => (
                    <TableRow
                      key={customer.id}
                      hover
                      sx={{ cursor: "pointer" }}
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(customer);
                          }}
                        >
                          <Edit />
                        </IconButton>

                        <IconButton
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCustomer(customer.id);
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Paper sx={{ p: 6, textAlign: "center" }}>
              <People sx={{ fontSize: 64, color: "text.disabled" }} />
              <Typography variant="h6" mt={2}>
                No customers found
              </Typography>
              <Typography color="text.secondary">
                Try adjusting your search terms
              </Typography>
            </Paper>
          )}

        </Box>

        <Dialog
          open={Boolean(selectedCustomer)}
          onClose={() => setSelectedCustomer(null)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Customer Details</DialogTitle>

          <DialogContent dividers>
            {selectedCustomer && (
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography fontWeight="bold" mb={2}>
                    Personal Information
                  </Typography>

                  <InfoRow icon={<People />} label="Name" value={selectedCustomer.name} />
                  <InfoRow icon={<Phone />} label="Phone" value={selectedCustomer.phone} />

                  <InfoRow
                    icon={<CalendarMonth />}
                    label="Customer Since"
                    value={
                      selectedCustomer.createdAt
                        ? new Date(selectedCustomer.createdAt).toLocaleDateString()
                        : "N/A"
                    }
                  />

                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography fontWeight="bold" mb={2}>
                    Purchase History
                  </Typography>

                  <InfoRow
                    icon={<ShoppingBag />}
                    label="Total Orders"
                    value={`${selectedCustomer.totalOrders} orders`}
                  />

                  <Paper sx={{ p: 2, mt: 2, bgcolor: "#e3f2fd" }}>
                    <Typography variant="caption">Total Spent</Typography>
                    <Typography variant="h5" fontWeight="bold" color="primary">
                      ${selectedCustomer.totalSpent.toLocaleString()}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            )}
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setSelectedCustomer(null)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );

  function InfoRow({ icon, label, value }) {
    return (
      <Stack direction="row" spacing={2} alignItems="center" mb={1}>
        {icon}
        <Box>
          <Typography variant="caption" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="body1">{value}</Typography>
        </Box>
      </Stack>
    );
  }

}