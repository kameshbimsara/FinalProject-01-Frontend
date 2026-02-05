import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
} from "@mui/material";
import Category from "@mui/icons-material/Category";
import Swal from "sweetalert2";


export default function BatchPage({ token }) {
  const [search, setSearch] = useState("");
  const [product, setProduct] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [filteredBatches, setFilteredBatches] = useState([]);

  const businessId = localStorage.getItem("businessId");

  const [batch, setBatch] = useState({
    manufactureDate: "",
    expireDate: "",
    quantity: "",
    unitPrice: ""
  });
  const [searchMessage, setSearchMessage] = useState("Search To product");

  useEffect(() => {
    loadSuppliers();
  }, []);

  useEffect(() => {
    if (product !== null) {
      handleSearch();
    }
  }, [product]);

  const loadSuppliers = async () => {
    const res = await axios.get(`http://localhost:8080/api/v1/bizsuppler/business/${businessId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setSuppliers(res.data);
  };

  const loadProducts = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/products/product_with_batches",
        {
          productName: search,
          businessId: Number(businessId)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      setProduct(res.data);
      setSelectedProduct(res.data);

      setFilteredBatches(res.data.batches);
      setSearchMessage("");

    } catch (err) {
      console.error(err);
      setProduct(null);
      setSelectedProduct(null);
      setFilteredBatches([]);
      setSearchMessage("No product found for your business with this name");
    }
  };


  const handleSearch = async () => {
    if (search.trim() === "") {
      setSelectedProduct(null);
      setFilteredBatches([]);
      setSearchMessage("Search To product");
    }

    if (!product) {
      setSelectedProduct(null);
      setFilteredBatches([]);
      setSearchMessage("No product found for your business with this name");
      return;
    }

    try {
      setSelectedProduct(product);
      setSearchMessage("");

      setFilteredBatches(product.batches);

    } catch (err) {
      console.error(err);
      setFilteredBatches([]);
      setSearchMessage("Failed to load batches for this product");
    }
  };



  const saveBatch = async () => {
    if (!selectedProduct || !selectedSupplier) {
      Swal.fire({
        icon: "error",
        title: "Please select a product and supplier",
        confirmButtonColor: "#d33",
        confirmButtonText: "OK",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Add Batch?",
      text: "Are you sure you want to add this batch?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#8b29f4",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, add it",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axios.post(
          "http://localhost:8080/api/v1/batches",
          {
            ...batch,
            productId: selectedProduct.id,
            supplierId: selectedSupplier,
            businessId: Number(businessId)
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        await handleSearch();

        Swal.fire({
          title: "Batch Added!",
          text: "The batch has been added successfully.",
          icon: "success",
          confirmButtonColor: "#8b29f4",
          confirmButtonText: "OK",
        });

        setBatch({
          manufactureDate: "",
          expireDate: "",
          quantity: "",
          unitPrice: ""
        });
        setSelectedSupplier("");

      } catch (err) {
        console.error(err);
        Swal.fire({
          title: "Failed to add batch",
          text: "Something went wrong. Please try again.",
          icon: "error",
          confirmButtonColor: "#d33",
          confirmButtonText: "OK",
        });
      }
    }
  };


  return (
    <Box >

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

        <Typography variant="h6">Welcome To My Batch Managemant !</Typography>

        <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton color="inherit">
          </IconButton>
          <Grid item>
            <Chip
              icon={<Category />}
              label={`${filteredBatches.length} Batches`}
              color="secondary"
            />
          </Grid>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6">Search Product</Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: "flex", gap: 1 }}>

                <TextField
                  fullWidth
                  label="Product Name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button
                  variant="contained"
                  onClick={loadProducts}
                  sx={{
                    minWidth: 100,
                    height: 40,
                    backgroundColor: "#a758fcff",
                    "&:hover": {
                      backgroundColor: "#8b29f4ff",
                    }
                  }}
                >
                  Search
                </Button>
              </Box>


              {selectedProduct && (
                <Box mt={3}>
                  <Info label="Name" value={selectedProduct.name} />
                  <Info label="Brand" value={selectedProduct.brand} />
                  <Info label="Description" value={selectedProduct.description} />
                </Box>
              )}
              {searchMessage && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {searchMessage}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%", width: "100%" }}>
            <CardContent>
              <Typography variant="h6">Add Batch</Typography>
              <Divider sx={{ mb: 2 }} />

              <TextField
                select
                fullWidth
                label="Select Supplier"
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                sx={{ mb: 2 }}
              >
                {suppliers.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.companyName}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                type="date"
                fullWidth
                label="Manufacture Date"
                InputLabelProps={{ shrink: true }}
                value={batch.manufactureDate}
                onChange={(e) => setBatch({ ...batch, manufactureDate: e.target.value })}
                sx={{ mb: 2 }}
              />

              <TextField
                type="date"
                fullWidth
                label="Expire Date"
                InputLabelProps={{ shrink: true }}
                value={batch.expireDate}
                onChange={(e) => setBatch({ ...batch, expireDate: e.target.value })}
                sx={{ mb: 2 }}
              />

              <TextField
                type="number"
                fullWidth
                label="Quantity"
                value={batch.quantity}
                onChange={(e) => setBatch({ ...batch, quantity: e.target.value })}
                sx={{ mb: 2 }}
              />

              <TextField
                type="number"
                fullWidth
                label="Unit Price"
                value={batch.unitPrice}
                onChange={(e) => setBatch({ ...batch, unitPrice: e.target.value })}
                sx={{ mb: 2 }}
              />

              <Button
                variant="contained"
                onClick={saveBatch}
                sx={{
                  width: "50%",
                  height: 40,
                  backgroundColor: "#a758fcff",
                  "&:hover": {
                    backgroundColor: "#8b29f4ff",
                  }
                }}
              >
                Add Batch
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>


      <Grid item xs={12} sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6">Batch List</Typography>
            <Divider sx={{ mb: 2 }} />

            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ bgcolor: "#8b29f4ff" }}>
                  <TableRow>
                    <TableCell sx={{ color: "#fff", fontWeight: 600 }}>ID</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Product</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Supplier</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Manufacture</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Expire</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Qty</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Unit Price</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredBatches.length > 0 ? (
                    filteredBatches.map((b) => (
                      <TableRow key={b.id}>
                        <TableCell>{b.id}</TableCell>
                        <TableCell>
                          {product?.name}
                        </TableCell>
                        <TableCell>
                          {suppliers.find(s => s.id === b.supplierId)?.companyName}
                        </TableCell>
                        <TableCell>{b.manufactureDate}</TableCell>
                        <TableCell>{b.expireDate}</TableCell>
                        <TableCell>{b.quantity}</TableCell>
                        <TableCell>{b.unitPrice}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        {search.trim()
                          ? "No batches found for this product"
                          : "Search a product"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>

              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Box>
  );
}

function Info({ label, value }) {
  return (
    <Box sx={{ mb: 1 }}>
      <Typography variant="caption" color="primary">
        {label}
      </Typography>
      <Typography>{value}</Typography>
    </Box>
  );
}
