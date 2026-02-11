import React, { useState, useEffect } from "react";
import {
  Box, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, TextField,
  IconButton, InputAdornment, Dialog, DialogTitle,
  DialogContent, DialogActions, Grid, Chip
} from "@mui/material";
import { Search, Edit, Delete, Inventory2 } from "@mui/icons-material";
import axios from "axios";
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css';
import { PRIMARY_COLOR, PRIMARY_GRADIENT } from "../../theme/color";

export default function ProductPage({ token }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", brand: "", description: "" });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState({ id: null, name: "", brand: "", description: "" });

  const businessId = localStorage.getItem("businessId");

  const loadProducts = async () => {
    if (!businessId) return;
    try {
      const res = await axios.get(`http://localhost:8080/api/v1/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const allProducts = Array.isArray(res.data) ? res.data : [];

      const businessProducts = allProducts.filter(
        (p) => p.businessId === Number(businessId)
      );
      setProducts(businessProducts);

    } catch (err) {
      console.error("Failed to load products", err);
      setProducts([]);
    }
  };

  useEffect(() => { loadProducts(); }, [token, businessId]);


  const searchProductByName = async () => {
    if (!searchTerm.trim()) {
      loadProducts();
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/products/productName",
        {
          productName: searchTerm,
          businessId: parseInt(businessId),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = Array.isArray(res.data) ? res.data : [res.data];
      setProducts(data);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Product not found",
        confirmButtonColor: "#8b29f4",
      });
      setProducts([]);
    }
  };


  const submitAddProduct = async () => {
    if (!newProduct.name || !newProduct.brand || !newProduct.description) {
      return Swal.fire({ icon: "error", title: "Please fill all fields", timer: 1500, showConfirmButton: false });
    }
    try {
      await axios.post(`http://localhost:8080/api/v1/products`, {
        name: newProduct.name,
        brand: newProduct.brand,
        description: newProduct.description,
        businessId: parseInt(businessId),
      }, { headers: { Authorization: `Bearer ${token}` } });

      setNewProduct({ name: "", brand: "", description: "" });
      setShowAddModal(false);
      loadProducts();
      Swal.fire({ icon: "success", title: "Product added", timer: 1500, showConfirmButton: false });
    } catch (err) {
      console.error(err.response || err);
      Swal.fire({ icon: "error", title: "Failed to add product", timer: 1500, showConfirmButton: false });
    }
  };

  const submitEditProduct = async () => {
    if (!editProduct.name || !editProduct.brand || !editProduct.description) {
      return Swal.fire({ icon: "error", title: "Please fill all fields", timer: 1500, showConfirmButton: false });
    }
    try {
      await axios.put(`http://localhost:8080/api/v1/products/${editProduct.id}`, editProduct, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditProduct({ id: null, name: "", brand: "", description: "" });
      setShowEditModal(false);
      loadProducts();
      Swal.fire({ icon: "success", title: "Product updated", timer: 1500, showConfirmButton: false });
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Failed to update product", timer: 1500, showConfirmButton: false });
    }
  };

  const deleteProduct = async (id) => {
    const result = await Swal.fire({
      title: "Delete Product?",
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
      await axios.delete(`http://localhost:8080/api/v1/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadProducts();
      Swal.fire({ icon: "success", title: "Product deleted", timer: 1500, showConfirmButton: false });
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Failed to delete product", timer: 1500, showConfirmButton: false });
    }
  };

  const openEditModal = (product) => {
    setEditProduct({ id: product.id, name: product.name, brand: product.brand, description: product.description });
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
        <Typography variant="h6">Welcome To My Product Managemant !</Typography>

        <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton color="inherit">
          </IconButton>
          <Grid item>
            <Chip
              icon={<Inventory2 />}
              label={`${products.length} Products`}
              color="secondary"
            />
          </Grid>
        </Box>
      </Box>

      <Box sx={{ p: 4, position: "relative" }}>
        <Button variant="contained" onClick={() => setShowAddModal(true)}
          sx={{ background: PRIMARY_GRADIENT, fontWeight: "bold", position: "absolute", top: 0, right: 0, mt: 2 }}>
          + Add Product
        </Button>
      </Box>

      <TextField
        fullWidth
        placeholder="Search products by name..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
        sx={{ mb: 3 }}
      />

      <Button
        variant="contained"
        onClick={searchProductByName}
        sx={{ mb: 3, background: PRIMARY_GRADIENT, fontWeight: "bold" }}
      >
        Search
      </Button>

      {products.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ background: PRIMARY_GRADIENT }}>
              <TableRow>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Brand</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Description</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map(p => (
                <TableRow key={p.id} hover>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.brand}</TableCell>
                  <TableCell>{p.description}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => openEditModal(p)}><Edit /></IconButton>
                    <IconButton color="error" onClick={() => deleteProduct(p.id)}><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper sx={{ p: 6, textAlign: "center" }}>
          <Inventory2 sx={{ fontSize: 64, color: "text.disabled" }} />
          <Typography>No products found</Typography>
        </Paper>
      )}

      <Dialog open={showAddModal} onClose={() => setShowAddModal(false)}>
        <DialogTitle sx={{ background: PRIMARY_GRADIENT, color: "#fff" }}>Add Product</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 400, mt: 2 }}>
          <TextField label="Name" value={newProduct.name} onChange={e => setNewProduct(prev => ({ ...prev, name: e.target.value }))} />
          <TextField label="Brand" value={newProduct.brand} onChange={e => setNewProduct(prev => ({ ...prev, brand: e.target.value }))} />
          <TextField label="Description" value={newProduct.description} onChange={e => setNewProduct(prev => ({ ...prev, description: e.target.value }))} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddModal(false)}>Cancel</Button>
          <Button variant="contained" sx={{ background: PRIMARY_GRADIENT }} onClick={submitAddProduct}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showEditModal} onClose={() => setShowEditModal(false)}>
        <DialogTitle sx={{ background: PRIMARY_GRADIENT, color: "#fff" }}>Edit Product</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 400 }}>
          <TextField sx={{ mt: 2 }} label="Name" value={editProduct.name} onChange={e => setEditProduct(prev => ({ ...prev, name: e.target.value }))} />
          <TextField label="Brand" value={editProduct.brand} onChange={e => setEditProduct(prev => ({ ...prev, brand: e.target.value }))} />
          <TextField label="Description" value={editProduct.description} onChange={e => setEditProduct(prev => ({ ...prev, description: e.target.value }))} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button variant="contained" sx={{ background: PRIMARY_GRADIENT }} onClick={submitEditProduct}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
