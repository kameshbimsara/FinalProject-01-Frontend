import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
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
  Menu as MenuIcon,
  Edit,
  Delete,
} from "@mui/icons-material";
import { Switch } from "@mui/material";
import SearchBar from "../../Component/Common/SearchBar";
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css';

export default function BusinessPage({ token }) {
  const [businesses, setBusinesses] = useState([]);
  const [searchBusiness, setSearchBusiness] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editBusinessModal, setEditBusinessModal] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [newBusiness, setNewBusiness] = useState({
    name: "",
    location: "",
    ownerName: "",
    ownerContact: "",
    username: "",
    password: "",
    status: 1,
    adminId: 1
  });
  const [editBusinessData, setEditBusinessData] = useState({
    name: "",
    location: "",
    ownerName: "",
    ownerContact: "",
    username: "",
    password: "",
    status: 1,
    adminId: 1
  });
  useEffect(() => {
    lordBusinesses();
  }, [token]);

  const lordBusinesses = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/business", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setBusinesses(data);
    } catch (err) {
      console.error("Error loading businesses", err);
    }
  };

  const filteredBusinesses = businesses.filter((business) => {
    const query = searchBusiness.toLowerCase();

    return (
      business.name?.toLowerCase().includes(query) ||
      business.ownerName?.toLowerCase().includes(query) ||
      business.location?.toLowerCase().includes(query) ||
      business.username?.toLowerCase().includes(query) ||
      business.ownerContact?.toLowerCase().includes(query)
    );
  });


  const toggleBusinessStatus = async (biz) => {
    const newStatus = biz.status === 1 ? 0 : 1;

    setBusinesses((prev) =>
      prev.map((b) =>
        b.id === biz.id ? { ...b, status: newStatus } : b
      )
    );

    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/business/status/${biz.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      console.error("Status update failed:", error);

      setBusinesses((prev) =>
        prev.map((b) =>
          b.id === biz.id ? { ...b, status: biz.status } : b
        )
      );

      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "failed to update status",
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  const deleteBusiness = async (id) => {

    const result = await Swal.fire({
      title: "Delete Business?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#8b29f4",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/business/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      lordBusinesses();
    } catch (error) {
      console.error("Error deleting business", error);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "failed to delete business",
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  const openEditModal = (biz) => {
    setSelectedBusiness(biz);
    setEditBusinessData({
      name: biz.name, 
      ownerName: biz.ownerName,
      ownerContact: biz.ownerContact,
      location: biz.location,
      username: biz.username,
      password: biz.password,
      status: 1,
    });
    setEditBusinessModal(true);
  };

  const submitEditBusiness = async () => {
    if (!selectedBusiness) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/business/${selectedBusiness.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editBusinessData),
        }
      );
      if (!res.ok) throw new Error("Failed to update business");

      setEditBusinessModal(false);
      setSelectedBusiness(null);
      lordBusinesses();
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "business updated successfully",
        showConfirmButton: false,
        timer: 1500
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "failed to update business",
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  const submitAddBusiness = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/v1/business", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newBusiness),
      });

      if (!res.ok) throw new Error("Failed to add business");

      setShowAddModal(false);
      setNewBusiness({
        name: "",
        ownerContact: "",
        location: "",
      });
      lordBusinesses();
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Business Saved",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        toast: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "failed to add business",
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f3f4f6", p: 2 }}>
      <Box component="main" sx={{ flex: 1 }}>
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

          <Typography variant="h6">Welcome To Business Management !</Typography>

          <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton color="inherit">
            </IconButton>
            <Avatar sx={{ bgcolor: "rgba(255,255,255,0.3)", color: "#fff" }}>SB</Avatar>
          </Box>
        </Box>

        <Box sx={{ p: 4 }}>
          <Button variant="contained" onClick={() => setShowAddModal(true)}
            sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", fontWeight: 'bold', position: 'absolute', top: 120, right: 40,mt:2 }}>
            + Add Business
          </Button>
        </Box>

        <SearchBar
          value={searchBusiness}
          onChange={setSearchBusiness}
          placeholder="Search business..."
        />

        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: "#8b29f4ff" }}>
              <TableRow>
                {["Business", "Contact", "Location", "Joined", "Status", "Actions"].map(h => (
                  <TableCell key={h} sx={{ color: "#fff", fontWeight: 600 }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredBusinesses.map(b => (
                <TableRow key={b.id} hover>
                  <TableCell>{b.name}</TableCell>
                  <TableCell>{b.ownerContact}</TableCell>
                  <TableCell>{b.location}</TableCell>
                  <TableCell>{b.regDate}</TableCell>
                  <TableCell>
                    <Switch
                      checked={b.status === 1}
                      onChange={() => toggleBusinessStatus(b)}
                      color="success"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => openEditModal(b)}>
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => deleteBusiness(b.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={editBusinessModal} onClose={() => setEditBusinessModal(false)}>
          <DialogTitle sx={{ bgcolor: "#8b29f4ff", color: "#fff" }}>Edit Business</DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 400 }}>
            <TextField
              label="Business Name"
              value={editBusinessData.name}
              sx={{ mt: 1 }}
              onChange={(e) =>
                setEditBusinessData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <TextField
              label="Owner Contact"
              value={editBusinessData.ownerContact}
              onChange={(e) =>
                setEditBusinessData((prev) => ({ ...prev, ownerContact: e.target.value }))
              }
            />
            <TextField
              label="Location"
              value={editBusinessData.location}
              onChange={(e) =>
                setEditBusinessData((prev) => ({ ...prev, location: e.target.value }))
              }
            />
            <TextField
              label="Owner Name"
              value={editBusinessData.ownerName}
              onChange={(e) =>
                setEditBusinessData((prev) => ({ ...prev, ownerName: e.target.value }))
              }
            />
            <TextField
              label="Username"
              value={editBusinessData.username}
              onChange={(e) =>
                setEditBusinessData((prev) => ({ ...prev, username: e.target.value }))
              }
            />
            <TextField
              label="Password"
              value={editBusinessData.password}
              onChange={(e) =>
                setEditBusinessData((prev) => ({ ...prev, password: e.target.value }))
              }
            />
          </DialogContent>
          <DialogActions>
            <Button sx={{ color: "#8b29f4ff" }} onClick={() => setEditBusinessModal(false)}>Cancel</Button>
            <Button sx={{ bgcolor: "#8b29f4ff" }} variant="contained" onClick={submitEditBusiness}>Save</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={showAddModal} onClose={() => setShowAddModal(false)}>
          <DialogTitle sx={{ bgcolor: "#8b29f4ff", color: "#fff" }}>Add Business</DialogTitle>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 400 }}
          >
            <TextField
              sx={{ mt: 1 }}
              label="Business Name"
              value={newBusiness.name}
              onChange={(e) =>
                setNewBusiness((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <TextField
              label="Owner Contact"
              value={newBusiness.ownerContact}
              onChange={(e) =>
                setNewBusiness((prev) => ({
                  ...prev,
                  ownerContact: e.target.value,
                }))
              }
            />
            <TextField
              label="Location"
              value={newBusiness.location}
              onChange={(e) =>
                setNewBusiness((prev) => ({ ...prev, location: e.target.value }))
              }
            />
            <TextField
              label="ownerName"
              value={newBusiness.ownerName}
              onChange={(e) =>
                setNewBusiness((prev) => ({ ...prev, ownerName: e.target.value }))
              }
            />
            <TextField
              label="username"
              value={newBusiness.username}
              onChange={(e) =>
                setNewBusiness((prev) => ({ ...prev, username: e.target.value }))
              }
            />
            <TextField
              label="password"
              value={newBusiness.password}
              onChange={(e) =>
                setNewBusiness((prev) => ({ ...prev, password: e.target.value }))
              }
            />
          </DialogContent>
          <DialogActions>
            <Button sx={{ color: "#8b29f4ff" }} onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button
              sx={{ bgcolor: "#8b29f4ff" }}
              variant="contained"
              onClick={submitAddBusiness}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
    </Box>
  );
}
