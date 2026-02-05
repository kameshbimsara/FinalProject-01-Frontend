import React, { useState, useEffect } from "react";
import {
  Box, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, TextField,
  IconButton, InputAdornment, Dialog, DialogTitle, DialogContent,
  DialogActions, Grid, Stack, Chip
} from "@mui/material";
import { Search, Edit, Delete, People, LocalShipping } from "@mui/icons-material";
import axios from "axios";
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css';

export default function SupplierPage({ token }) {
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSupplier, setNewSupplier] = useState({ companyName: "", contactNo: "" });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editSupplier, setEditSupplier] = useState({ id: null, companyName: "", contactNo: "" });

  const businessId = localStorage.getItem("businessId");

  localStorage.getItem("token")

  const loadSuppliers = async () => {
    if (!businessId) return;
    try {
      const res = await axios.get(`http://localhost:8080/api/v1/bizsuppler`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const allSuppliers = Array.isArray(res.data) ? res.data : [];

      const businessSuppliers = allSuppliers.filter(
        (s) => s.businessId === Number(businessId)
      );
      setSuppliers(businessSuppliers);

    } catch (err) {
      console.error("Failed to load suppliers", err);
      setSuppliers([]);
    }
  };

  useEffect(() => { loadSuppliers(); }, [token, businessId]);

  const filteredSuppliers = suppliers.filter(s =>
    s.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.contactNo.includes(searchTerm)
  );

  const submitAddSupplier = async () => {
    if (!newSupplier.companyName || !newSupplier.contactNo) {
      return Swal.fire({
        icon: "error",
        title: "Please fill all fields",
        timer: 1500,
        showConfirmButton: false
      });
    }

    try {
      await axios.post("http://localhost:8080/api/v1/bizsuppler", {
        companyName: newSupplier.companyName,
        contactNo: newSupplier.contactNo,
        businessId: parseInt(businessId)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNewSupplier({ companyName: "", contactNo: "" });
      setShowAddModal(false);
      loadSuppliers();
      Swal.fire({ icon: "success", title: "Supplier added", timer: 1500, showConfirmButton: false });
    } catch (err) {
      console.error(err.response || err);
      Swal.fire({ icon: "error", title: "Failed to add supplier", timer: 1500, showConfirmButton: false });
    }
  };


  const submitEditSupplier = async () => {
    if (!editSupplier.companyName || !editSupplier.contactNo) {
      return Swal.fire({ icon: "error", title: "Please fill all fields", timer: 1500, showConfirmButton: false });
    }
    try {
      await axios.put(`http://localhost:8080/api/v1/bizsuppler/${editSupplier.id}`, editSupplier, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditSupplier({ id: null, companyName: "", contactNo: "" });
      setShowEditModal(false);
      loadSuppliers();
      Swal.fire({ icon: "success", title: "Supplier updated", timer: 1500, showConfirmButton: false });
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Failed to update supplier", timer: 1500, showConfirmButton: false });
    }
  };

  const deleteSupplier = async (id) => {
    const result = await Swal.fire({
      title: "Delete Supplier?",
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
      await axios.delete(`http://localhost:8080/api/v1/bizsuppler/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadSuppliers();
      Swal.fire({ icon: "success", title: "Supplier deleted", timer: 1500, showConfirmButton: false });
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Failed to delete supplier", timer: 1500, showConfirmButton: false });
    }
  };

  const openEditModal = (supplier) => {
    setEditSupplier({ id: supplier.id, companyName: supplier.companyName, contactNo: supplier.contactNo });
    setShowEditModal(true);
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

        <Typography variant="h6">Welcome To My Suppliers Managemant !</Typography>

        <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton color="inherit">
          </IconButton>
          <Grid item>
            <Chip
              icon={<LocalShipping />}
              label={`${suppliers.length} Suppliers`}
              color="secondary"
            />
          </Grid>
        </Box>
      </Box>

      <Box sx={{ p: 4 }}>
        <Button variant="contained" onClick={() => setShowAddModal(true)}
          sx={{ background: "#8b29f4ff", fontWeight: 'bold', position: 'absolute', top: 120, right: 40 }}>
          + Add Suppliers
        </Button>
      </Box>

      <TextField
        fullWidth
        placeholder="Search suppliers by name or contact..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
        sx={{ mb: 3, mt: 3 }}
      />

      {filteredSuppliers.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: "#8b29f4ff" }}>
              <TableRow>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Company Name</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Contact No</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSuppliers.map(s => (
                <TableRow key={s.id} hover>
                  <TableCell>{s.companyName}</TableCell>
                  <TableCell>{s.contactNo}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => openEditModal(s)}><Edit /></IconButton>
                    <IconButton color="error" onClick={() => deleteSupplier(s.id)}><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper sx={{ p: 6, textAlign: "center" }}>
          <People sx={{ fontSize: 64, color: "text.disabled" }} />
          <Typography>No suppliers found</Typography>
        </Paper>
      )}

      <Dialog open={showAddModal} onClose={() => setShowAddModal(false)}>
        <DialogTitle sx={{ bgcolor: "#8b29f4ff", color: "#fff"}}>Add Supplier</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 400, mt: 2 }}>
          <TextField label="Company Name" value={newSupplier.companyName} onChange={e => setNewSupplier(prev => ({ ...prev, companyName: e.target.value }))} />
          <TextField label="Contact No" value={newSupplier.contactNo} onChange={e => setNewSupplier(prev => ({ ...prev, contactNo: e.target.value }))} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddModal(false)}>Cancel</Button>
          <Button variant="contained" sx={{ bgcolor: "#8b29f4" }} onClick={submitAddSupplier}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showEditModal} onClose={() => setShowEditModal(false)}>
        <DialogTitle sx={{ bgcolor: "#8b29f4ff", color: "#fff" }}>Edit Supplier</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 400 }}>
          <TextField
            sx={{ mt: 2 }}
            label="Company Name"
            value={editSupplier.companyName}
            onChange={e => setEditSupplier(prev => ({ ...prev, companyName: e.target.value }))} />
          <TextField label="Contact No" value={editSupplier.contactNo} onChange={e => setEditSupplier(prev => ({ ...prev, contactNo: e.target.value }))} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button variant="contained" sx={{ bgcolor: "#8b29f4" }} onClick={submitEditSupplier}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
