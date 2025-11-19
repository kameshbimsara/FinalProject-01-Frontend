import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Business from "../Business/Business";

export default function BusinessOwner() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("dashboard");
  const [token] = useState(localStorage.getItem("token"));

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  const menuItems = [
    { key: "dashboard", label: "Dashboard" },
    { key: "business", label: "My Business" },
    { key: "orders", label: "Orders" },
    { key: "products", label: "Products" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-72 bg-gradient-to-b from-green-800 to-green-600 text-white p-6 flex flex-col justify-between h-screen fixed shadow-lg">
        <div>
          <h2 className="text-2xl font-bold mb-8 text-center">Business Owner</h2>

          {menuItems.map((item) => (
            <button
              key={item.key}
              className={`w-full text-left px-5 py-3 mb-2 rounded-lg hover:bg-white hover:text-green-700 transition-all duration-300 ${
                activePage === item.key
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

      {/* MAIN CONTENT */}
      <div className="flex-1 ml-72 p-8">
        {/* Dashboard Section */}
        {activePage === "dashboard" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Welcome, Business Owner</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all">
                <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
                <p className="text-2xl font-bold text-green-600">0</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all">
                <h3 className="text-lg font-semibold mb-2">Pending Orders</h3>
                <p className="text-2xl font-bold text-yellow-600">0</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all">
                <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
                <p className="text-2xl font-bold text-blue-600">$0</p>
              </div>
            </div>
          </div>
        )}

        {/* Business Section */}
        {activePage === "business" && token && <Business token={token} />}

        {/* Placeholder for other sections */}
        {activePage === "orders" && (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Orders</h2>
            <p className="text-gray-600">Orders section coming soon...</p>
          </div>
        )}

        {activePage === "products" && (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Products</h2>
            <p className="text-gray-600">Products section coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}
