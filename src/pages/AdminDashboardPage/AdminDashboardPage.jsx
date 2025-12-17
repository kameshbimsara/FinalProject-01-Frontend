import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BusinessOwner from "../BusinessOwnerPage/BusinessOwnerPage";
import Business from "../BusinessPage/BusinessPage";

export default function AdminDashboardPage() {

  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("dashboard");
  const [businessList, setBusinessList] = useState([]);
  const [ownersList, setOwnersList] = useState([]);
  const [token] = useState(localStorage.getItem("token"));

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const loadAllBusiness = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/business", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setBusinessList(data);
    } catch (error) {
      console.error("Error fetching business list", error);
    }
  };

  const loadAllOwners = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/business/biz/bizowner", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      const data = await response.json();
      setOwnersList(data);
    } catch (error) {
      console.error("Error fetching owners list", error);
    }
  };

  useEffect(() => {
    loadAllOwners();
  }, []);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
    loadAllBusiness();
  }, []);

  const menuItems = [
    { key: "dashboard", label: "Dashboard" },
    { key: "owner", label: "Business Owner" },
    { key: "business", label: "Business" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">

      <aside className="w-72 bg-gradient-to-b from-blue-800 to-blue-600 text-white p-6 flex flex-col justify-between h-screen fixed shadow-lg">
        <div>
          <h2 className="text-2xl font-bold mb-8 text-center">Admin Panel</h2>

          {menuItems.map((item) => (
            <button
              key={item.key}
              className={`w-full text-left px-5 py-3 mb-2 rounded-lg hover:bg-white hover:text-blue-700 transition-all duration-300 ${activePage === item.key
                ? "bg-white text-blue-700 font-semibold"
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all">
              <h3 className="text-lg font-semibold mb-2">Total Businesses</h3>
              <p className="text-2xl font-bold">{businessList.length}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all">
              <h3 className="text-lg font-semibold mb-2">Total Owners</h3>
              <p className="text-2xl font-bold">{ownersList.length}</p>
            </div>
          </div>
        )}

        {activePage === "owner" && token && <BusinessOwner token={token} />}

        {activePage === "business" && token && <Business token={token} />}
      </div>
    </div>
  );
}
