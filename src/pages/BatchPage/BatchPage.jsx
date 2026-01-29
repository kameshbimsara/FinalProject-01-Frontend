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
import Inventory2 from "@mui/icons-material/Inventory2";

export default function BatchPage({ token }) {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState("");

  const businessId = localStorage.getItem("businessId");

  const [batch, setBatch] = useState({
    manufactureDate: "",
    expireDate: "",
    quantity: "",
    unitPrice: ""
  });
  const [searchMessage, setSearchMessage] = useState("");

  useEffect(() => {
    loadProducts();
    loadSuppliers();
    loadBatches();
  }, []);

  const loadProducts = async () => {
    const res = await axios.get("http://localhost:8080/api/v1/products", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setProducts(res.data);
  };

  const loadSuppliers = async () => {
    const res = await axios.get("http://localhost:8080/api/v1/bizsuppler", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const businessSuppliers = res.data.filter(
      (s) => s.businessId === Number(businessId)
    );

    setSuppliers(businessSuppliers);
  };

  const loadBatches = async () => {
    const res = await axios.get("http://localhost:8080/api/v1/batches", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const enrichedBatches = res.data.map(b => ({
      ...b,
      product: products.find(p => p.id === b.productId),
      supplier: suppliers.find(s => s.id === b.supplierId),
    }));

    setBatches(enrichedBatches);
  };

  const handleSearch = () => {
    if (!search.trim()) {
      setSelectedProduct(null);
      return;
    }

    const found = products.find(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) &&
        p.businessId === Number(businessId)
    );

    if (found) {
      setSelectedProduct(found);
      setSearchMessage("");
    } else {
      setSelectedProduct(null);
      setSearchMessage("No product found for your business with this name");
    }

  };

  const saveBatch = async () => {
  const token = localStorage.getItem("token");
  const businessId = localStorage.getItem("businessId");

  if (!selectedProduct || !selectedSupplier) {
    alert("Select product and supplier");
    return;
  }

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

    await loadProducts();
    await loadSuppliers();
    await loadBatches();

    alert("Batch saved successfully");

    setSelectedSupplier("");
    setBatch({
      manufactureDate: "",
      expireDate: "",
      quantity: "",
      unitPrice: ""
    });
  } catch (err) {
    console.error(err);
    alert(err.response?.data || "Error saving batch");
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

      <Grid container spacing={3} sx={{mt:3}}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6">Search Product</Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: "flex", gap: 1 }}>

                <TextField
                  fullWidth
                  label="Product name"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  sx={{ minWidth: 100, height: 40 }}
                >
                  Search
                </Button>
              </Box>


              {selectedProduct && (
                <Box mt={3}>
                  <Info label="ID" value={selectedProduct.id} />
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
          <Card sx={{ height: "100%"}}>
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
                sx={{width:"40%"}}
                onClick={saveBatch}
              >
                Add Batch
              </Button>
            </CardContent>
          </Card>
        </Grid>
        </Grid>


        <Grid item xs={12} sx={{mt:3}}>
          <Card>
            <CardContent>
              <Typography variant="h6">Batch List</Typography>
              <Divider sx={{ mb: 2 }} />

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Product</TableCell>
                      <TableCell>Supplier</TableCell>
                      <TableCell>Manufacture</TableCell>
                      <TableCell>Expire</TableCell>
                      <TableCell>Qty</TableCell>
                      <TableCell>Unit Price</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {batches.map((b) => (
                      <TableRow key={b.id}>
                        <TableCell>{b.id}</TableCell>
                        <TableCell>{products.find(p => p.id === b.productId)?.name}</TableCell>
                        <TableCell>{suppliers.find(s => s.id === b.supplierId)?.companyName}</TableCell>
                        <TableCell>{b.manufactureDate}</TableCell>
                        <TableCell>{b.expireDate}</TableCell>
                        <TableCell>{b.quantity}</TableCell>
                        <TableCell>{b.unitPrice}</TableCell>
                      </TableRow>
                    ))}
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
