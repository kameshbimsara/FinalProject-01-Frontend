import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Tab,
  Tabs,
  TextField,
} from '@mui/material';
import {
  Business,
  AdminPanelSettings
} from '@mui/icons-material';
import axios, { Axios } from "axios";
import img1 from "../../assets/logo.jpeg";

export default function LoginPage() {
  const [tabValue, setTabValue] = useState("ADMIN");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setFormData({ email: '', password: '' });
  };

  const showToast = (icon, title) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon,
      title,
    });
  };


  const handleLogin = async () => {
    if (tabValue === "ADMIN") {
      try {
        const response = await axios.post("http://localhost:8080/api/v1/admin/login",
          { username, password }
        );
        const data = response.data;
        localStorage.setItem("token", data.token);
        showToast("success", "Signed in successfully");
        navigate("/admin-dashboard");
      } catch (error) {
        showToast("error", "Invalid Username or Password");
      }
    } else {
      try {
        const response = await axios.post("http://localhost:8080/api/v1/business/login",
          { username, password }
        );
        const data = response.data;
        localStorage.setItem("token", data.token);
        localStorage.setItem("businessId", data.id);
        localStorage.setItem("ownerName", data.ownerName);

        console.log("Login Response:", data);

        showToast("success", "Signed in successfully");
        navigate("/owner-dashboard");
      } catch (error) {
        showToast("error", "Invalid Username or Password");
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2,
      }}
    >

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 2,
        }}
      >
        <Box
          component="img"
          src={img1}
          alt="SmartBiz"
          sx={{
            width: 205,
            height: 105,
            mb: 2,
            position: 'absolute',
            top: 0,
            left: 0,
            borderRadius: '0 0 10px 0',
          }}
        />
      </Box>

      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: 4,
          boxShadow: 3,
          maxWidth: 450,
          width: "100%",
          padding: 4,
          display: "flex",
          flexDirection: "column",
        }}
      >

        <Box sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: 3,
          textAlign: 'center',
          margin: '-32px -32px 10px -32px',
          borderRadius: '14px 14px 0px 0px',
        }}>
          <Typography variant="h6" fontWeight="bold" textAlign="center" color="white" borderRadius="20px">
            Welcome To SmartBiz! Please Login Continue
          </Typography>
        </Box>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
            },
          }}
        >
          <Tab
            value="ADMIN"
            icon={<AdminPanelSettings />}
            iconPosition="start"
            label="Admin Login"
          />
          <Tab
            value="BUSINESS_OWNER"
            icon={<Business />}
            iconPosition="start"
            label="Business Owner"
          />
        </Tabs>

        <Box sx={{ mb: 1 }}>
          <TextField
            label="Email"
            type="text"
            fullWidth
            margin="normal"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Box>

        <Button
          onClick={handleLogin}
          sx={{
            width: "100%",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            py: 2,
            borderRadius: "lg",
          }}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
}
