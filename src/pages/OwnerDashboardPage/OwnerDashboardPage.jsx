import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OwnerBusiness from "../OwnerBusinessPage/OwnerBusinessPage";
import CustomerPage from "../CustomerPage/CustomerPage";
import OrdersPage from "../OdersPage/OrdersPage";
import SuppliersPage from "../SuppliersPage/SuppliersPage";
import BatchPage from "../BatchPage/BatchPage";
import ProductPage from "../ProductPage/ProductPage";

export default function OwnerDashboardPage() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("dashboard");
  const [token] = useState(localStorage.getItem("token"));
  const [myBusinessList, setMyBusinessList] = useState([]);
  const [ownerName, setOwnerName] = useState("");

  const fetchOwnerName = () => {
    const name = localStorage.getItem("ownerName");
    setOwnerName(name || "Owner");
  };
  useEffect(() => {
    fetchOwnerName();
  }, []);


  const loadMyBusinessList = async () => {
    try {
      const ownerId = localStorage.getItem("ownerId");
      const res = await fetch(`http://localhost:8080/api/v1/business/owner/${ownerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch owner's businesses");
      const data = await res.json();
      setMyBusinessList(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadMyBusinessList();
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const menuItems = [
    { key: "dashboard", label: "Dashboard" },
    { key: "ownerBusiness", label: "My Business" },
    { key: "customer", label: "Customers" },
    { key: "suppliers", label: "Suppliers" },
    { key: "product", label: "Product" },
    { key: "batch", label: "Batch" },
    { key: "orders", label: "Orders" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">

      <aside className="w-72 bg-gradient-to-b from-green-800 to-green-600 text-white p-6 flex flex-col justify-between h-screen fixed shadow-lg">
        <div>
          <h2 className="text-2xl font-bold mb-8 text-center">Owner Panel</h2>

          {menuItems.map((item) => (
            <button
              key={item.key}
              className={`w-full text-left px-5 py-3 mb-2 rounded-lg hover:bg-white hover:text-green-700 transition-all duration-300 ${activePage === item.key
                ? "bg-white text-green-700 font-semibold"
                : ""
                }`}
              onClick={() => setActivePage(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button
          onClick={logout}
          className="w-full px-5 py-3 mt-6 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </aside>

      <div className="flex-1 ml-72 p-8">

        {activePage === "dashboard" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Welcome, {ownerName}</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all">
                <h3 className="text-lg font-semibold mb-2">My Businesses</h3>
                <p className="text-2xl font-bold text-green-600">{myBusinessList.length}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all">
                <h3 className="text-lg font-semibold mb-2">Pending Orders</h3>
                <p className="text-2xl font-bold text-yellow-600">0</p>
              </div>
            </div>
          </div>
        )}

        {activePage === "ownerBusiness" && token && <OwnerBusiness token={token} />}

        {activePage === "customer" && token && <CustomerPage token={token} />}

        {activePage === "suppliers" && token && <SuppliersPage token={token} />}

        {activePage === "product" && token && <ProductPage token={token} />}

        {activePage === "batch" && token && <BatchPage token={token} />}

        {activePage === "orders" && token && <OrdersPage token={token} />}

      </div>
    </div>
  );
}
