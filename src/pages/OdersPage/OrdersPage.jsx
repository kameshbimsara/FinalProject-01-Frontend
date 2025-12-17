import React, { useState, useEffect } from "react";

export default function OrdersPage({ token }) {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [ownerBusinesses, setOwnerBusinesses] = useState([]);

  const [newOrder, setNewOrder] = useState({
    customerId: "",
    date: "",
    totalAmount: "",
    businessId: "",
  });

  const [editOrder, setEditOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchCustomerId, setSearchCustomerId] = useState("");

  const loadOwnerBusinesses = async () => {
    try {
      const ownerId = localStorage.getItem("ownerId");

      const res = await fetch(
        `http://localhost:8080/api/v1/business/owner/${ownerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      setOwnerBusinesses(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/v1/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setOrders(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCustomers = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/customers", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadOwnerBusinesses();
    loadOrders();
    loadCustomers();
  }, []);

  const handleAddOrder = async () => {
    if (!newOrder.customerId || !newOrder.date || !newOrder.totalAmount || !newOrder.businessId) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newOrder),
      });

      if (!res.ok) throw new Error("Failed to create order");

      setNewOrder({
        customerId: "",
        date: "",
        totalAmount: "",
        businessId: "",
      });

      loadOrders();
      alert("Order created successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateOrder = async () => {
    if (!editOrder.customerId || !editOrder.date || !editOrder.totalAmount || !editOrder.businessId) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/v1/orders/${editOrder.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editOrder),
      });

      if (!res.ok) throw new Error("Failed to update order");

      setEditOrder(null);
      loadOrders();
      alert("Order updated successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/v1/orders/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete order");

      loadOrders();
      alert("Order deleted!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSearchOrders = async () => {
    if (!searchCustomerId) {
      alert("Please select a customer to search");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:8080/api/v1/orders/customer/${searchCustomerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error("Failed to search orders");

      const data = await res.json();
      setOrders(Array.isArray(data) ? data : [data]);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setSearchCustomerId("");
    loadOrders();
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-8 space-y-6">
        <h2 className="text-2xl font-bold mb-4">Orders Management</h2>

        <div className="bg-white p-4 rounded-lg shadow-md space-y-2">
          <h3 className="font-semibold mb-3">
            {editOrder ? "Edit Order" : "Add New Order"}
          </h3>

          <div className="flex gap-2 flex-wrap">

            <select
              value={editOrder ? editOrder.customerId : newOrder.customerId}
              onChange={(e) =>
                editOrder
                  ? setEditOrder({ ...editOrder, customerId: Number(e.target.value) })
                  : setNewOrder({ ...newOrder, customerId: Number(e.target.value) })
              }
              className="border p-2 rounded flex-1"
            >
              <option value="">Select Customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <input
              type="date"
              value={editOrder ? editOrder.date : newOrder.date}
              onChange={(e) =>
                editOrder
                  ? setEditOrder({ ...editOrder, date: e.target.value })
                  : setNewOrder({ ...newOrder, date: e.target.value })
              }
              className="border p-2 rounded flex-1"
            />

            <input
              type="number"
              placeholder="Total Amount"
              value={editOrder ? editOrder.totalAmount : newOrder.totalAmount}
              onChange={(e) =>
                editOrder
                  ? setEditOrder({ ...editOrder, totalAmount: Number(e.target.value) })
                  : setNewOrder({ ...newOrder, totalAmount: Number(e.target.value) })
              }
              className="border p-2 rounded flex-1"
            />

            <select
              value={editOrder ? editOrder.businessId : newOrder.businessId}
              onChange={(e) =>
                editOrder
                  ? setEditOrder({ ...editOrder, businessId: Number(e.target.value) })
                  : setNewOrder({ ...newOrder, businessId: Number(e.target.value) })
              }
              className="border p-2 rounded flex-1"
            >
              <option value="">Select Business</option>
              {ownerBusinesses.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>

            {editOrder ? (
              <>
                <button onClick={handleUpdateOrder} className="bg-green-600 text-white px-4 py-2 rounded">
                  Update
                </button>
                <button onClick={() => setEditOrder(null)} className="bg-gray-500 text-white px-4 py-2 rounded">
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={handleAddOrder} className="bg-blue-600 text-white px-4 py-2 rounded">
                Add
              </button>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md space-y-2">
          <h3 className="font-semibold mb-2">Search Orders by Customer</h3>

          <div className="flex gap-2 flex-wrap">
            <select
              value={searchCustomerId}
              onChange={(e) => setSearchCustomerId(Number(e.target.value))}
              className="border p-2 rounded flex-1"
            >
              <option value="">Select Customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleSearchOrders}
              className="bg-purple-600 text-white px-4 py-2 rounded"
            >
              Search
            </button>

            <button
              onClick={resetSearch}
              className="bg-gray-600 text-white px-4 py-2 rounded"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
          {loading ? (
            <p>Loading...</p>
          ) : orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">ID</th>
                  <th className="p-2 border">Customer</th>
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Total Amount</th>
                  <th className="p-2 border">Business</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-100">
                    <td className="border p-2">{o.id}</td>
                    <td className="border p-2">
                      {customers.find((c) => c.id === o.customerId)?.name || "N/A"}
                    </td>
                    <td className="border p-2">{o.date}</td>
                    <td className="border p-2">{o.totalAmount}</td>
                    <td className="border p-2">
                      {ownerBusinesses.find((b) => b.id === o.businessId)?.name}
                    </td>

                    <td className="border p-2 flex gap-2">
                      <button
                        onClick={() => setEditOrder(o)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteOrder(o.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
