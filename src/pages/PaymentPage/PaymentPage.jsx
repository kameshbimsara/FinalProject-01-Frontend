import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Paper,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    Button,
    IconButton,
    TextField,
    InputAdornment
} from "@mui/material";
import {
    Search,
    AttachMoney,
    CalendarMonth
} from "@mui/icons-material";
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

export default function PaymentPage({ token }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [businesses, setBusinesses] = useState([]);
    const [payments, setPayments] = useState([]);
    const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);

    const [newPayment, setNewPayment] = useState({
        price: "",
        date: ""
    });

    useEffect(() => {
        getBusinesses();
        getPayments();
    }, []);

    const getBusinesses = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/v1/business", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setBusinesses(data);
        } catch (err) {
            console.error("Error fetching businesses", err);
        }
    };

    const getPayments = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/v1/payment", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setPayments(data);
        } catch (err) {
            console.error("Error fetching payments", err);
        }
    };

    const filteredBusinesses = businesses.filter(b =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const businessPayments = selectedBusiness
        ? payments.filter(p => p.businessId === selectedBusiness.id)
        : [];

    const totalAmount = businessPayments.reduce((sum, p) => sum + p.price, 0);

    const handleSearch = () => {
        if (filteredBusinesses.length > 0) {
            setSelectedBusiness(filteredBusinesses[0]);
        } else {
            setSelectedBusiness(null);
        }
    };

    const submitAddPayment = async () => {
        try {
            const payload = {
                businessId: selectedBusiness.id,
                price: Number(newPayment.price),
                date: newPayment.date
            };

            const res = await fetch("http://localhost:8080/api/v1/payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to add payment");

            setShowAddPaymentModal(false);
            setNewPayment({ price: "", date: "" });
            getPayments();

            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Payment added successfully",
                showConfirmButton: false,
                timer: 1500,
                toast: true,
            });

        } catch (error) {
            console.error(error);
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Failed to add payment",
                showConfirmButton: false,
                timer: 1500,
            });
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

                <Typography variant="h6">Welcome To Payment Management !</Typography>

                <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 2 }}>
                    <IconButton color="inherit">
                    </IconButton>
                    <Avatar sx={{ bgcolor: "rgba(255,255,255,0.3)", color: "#fff" }}>SB</Avatar>
                </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 2, mt: 3, mb: 3 }}>
                <TextField
                    fullWidth
                    placeholder="Search business name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        )
                    }}
                />
                <Button
                    variant="contained"
                    sx={{ bgcolor: "#7c3aed" }}
                    onClick={handleSearch}
                >
                    Search
                </Button>
            </Box>

            {selectedBusiness ? (
                <Grid container spacing={3} sx={{ display: "flex", justifyContent: "center" }}>
                    <Grid item xs={12} md={6} display="flex">
                        <Paper sx={{ width: 550, boxShadow: 10, borderRadius: 15 }}>
                            <Box display="flex" alignItems="center" sx={{ bgcolor: "#7c3aed", borderTopLeftRadius: 15, borderTopRightRadius: 15 }}>
                                <Box>
                                    <Typography sx={{ m: 2, fontWeight: "bold", color: "#fff" }} variant="h6">{selectedBusiness.name}</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ m: 1 }}>
                                <Stat icon={<AttachMoney />} label="Total" value={`${totalAmount}`} />
                            </Box>

                            <Box
                                sx={{
                                    border: 2,
                                    borderColor: "#945cf5ff",
                                    p: 2,
                                    bgcolor: "#945cf5ff",
                                    borderBottomRightRadius: 15,
                                    borderBottomLeftRadius: 15,
                                    mt: 10
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, bgcolor: "#7c3aed", borderRadius: 2, p: 3 }}>
                                    <LocationOnIcon sx={{ color: "#f87171" }} />
                                    <Typography color="#fff">
                                        <strong>Location :</strong> {selectedBusiness.location}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, bgcolor: "#7c3aed", borderRadius: 2, p: 3 }}>
                                    <PersonIcon sx={{ color: "#60a5fa" }} />
                                    <Typography color="#fff">
                                        <strong>Owner Name :</strong> {selectedBusiness.username}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, bgcolor: "#7c3aed", borderRadius: 2, p: 3 }}>
                                    <CalendarMonthIcon sx={{ color: "#e5e7eb" }} />
                                    <Typography color="#fff">
                                        <strong>Register Date :</strong> {selectedBusiness.regDate}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TableContainer component={Paper}
                            sx={{
                                width: 550,
                                maxHeight: 300,
                                overflowY: "auto"
                            }}>
                            <Table>
                                <TableHead sx={{ bgcolor: "#7c3aed" }}>
                                    <TableRow>
                                        <TableCell sx={{ color: "#fff" }}>Amount</TableCell>
                                        <TableCell sx={{ color: "#fff" }}>Date</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {businessPayments.map(p => (
                                        <TableRow key={p.id} hover>
                                            <TableCell>RS.{p.price}</TableCell>
                                            <TableCell>
                                                <Box display="flex" gap={1} alignItems="center">
                                                    <CalendarMonth fontSize="small" />
                                                    {p.date}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            ) : (
                <Paper sx={{ p: 6, textAlign: "center" }}>
                    <Avatar
                        sx={{ bgcolor: "#ede9fe", width: 80, height: 80, mx: "auto", mb: 2 }}
                    >
                        <Search sx={{ fontSize: 40, color: "#7c3aed" }} />
                    </Avatar>
                    <Typography variant="h6">Search for a Business</Typography>
                    <Typography color="text.secondary">
                        Use the search bar above to view payment history
                    </Typography>
                </Paper>
            )}
            {selectedBusiness && (
                <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                    <Button
                        variant="contained"
                        sx={{ bgcolor: "#7c3aed", fontWeight: "bold" }}
                        onClick={() => {
                            setNewPayment({
                                businessId: selectedBusiness.id,
                                price: "",
                                date: ""
                            });
                            setShowAddPaymentModal(true);
                        }}
                    >
                        + Add Payment
                    </Button>
                </Box>
            )}
            <Dialog open={showAddPaymentModal} onClose={() => setShowAddPaymentModal(false)}>
                <DialogTitle sx={{ bgcolor: "#7c3aed", color: "#fff" }}>
                    Add Payment
                </DialogTitle>

                <DialogContent
                    sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 400 }}
                >
                    <TextField
                        sx={{ mt: 1 }}
                        label="Amount"
                        type="number"
                        value={newPayment.price}
                        onChange={(e) =>
                            setNewPayment(prev => ({ ...prev, price: e.target.value }))
                        }
                    />

                    <TextField
                        label="Payment Date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={newPayment.date}
                        onChange={(e) =>
                            setNewPayment(prev => ({ ...prev, date: e.target.value }))
                        }
                    />
                </DialogContent>

                <DialogActions>
                    <Button
                        sx={{ color: "#7c3aed" }}
                        onClick={() => setShowAddPaymentModal(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        sx={{ bgcolor: "#7c3aed" }}
                        onClick={submitAddPayment}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>


        </Box>
    );
}

function Stat({ icon, label, value }) {
    return (
        <Box textAlign="center">
            <Avatar sx={{ bgcolor: "#ede9fe", mx: "auto", mb: 1 }}>{icon}</Avatar>
            <Typography variant="body2" color="text.secondary">
                {label}
            </Typography>
            <Typography fontWeight="bold">{value}</Typography>
        </Box>
    );
}
