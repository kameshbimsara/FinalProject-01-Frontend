import React, { useState, useEffect } from "react";

export default function CustomerPage({ token }) {
  const [customers, setCustomers] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [ownerBusinesses, setOwnerBusinesses] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    businessId: "",
  });
  const [editCustomer, setEditCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [searchBusinessId, setSearchBusinessId] = useState("");

  const handleSearchCustomer = async () => {
    try {
      setLoading(true);

      if (!searchBusinessId) {
        alert("Please select a business to search");
        return;
      }

      const res = await fetch(
        `http://localhost:8080/api/customers/name/${searchName}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch customer");

      const data = await res.json();

      if (data.businessId === parseInt(searchBusinessId)) {
        setCustomers([data]);
      } else {
        setCustomers([]);
      }

    } catch (err) {
      console.error(err);
      alert("Error searching customer");
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setSearchName("");
    setSearchBusinessId("");
    loadCustomers();
  };

  const loadOwnerBusinesses = async () => {
    try {
      const ownerId = localStorage.getItem("ownerId");
      const res = await fetch(`http://localhost:8080/api/v1/business/owner/${ownerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch owner's businesses");
      const data = await res.json();
      setOwnerBusinesses(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadOwnerBusinesses();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/customers", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch customers");

      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error(err);
      alert("Error loading customers");
    } finally {
      setLoading(false);
    }
  };

  const loadBusinesses = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/v1/business", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch businesses");

      const data = await res.json();
      setBusinesses(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCustomers();
    loadBusinesses();
  }, []);

  const handleAddCustomer = async () => {
    if (!newCustomer.name || !newCustomer.phone || !newCustomer.businessId) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCustomer),
      });

      if (!res.ok) throw new Error("Failed to add customer");

      setNewCustomer({ name: "", phone: "", businessId: "" });
      loadCustomers();
      alert("Customer added successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateCustomer = async () => {
    if (!editCustomer.name || !editCustomer.phone || !editCustomer.businessId) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/customers/${editCustomer.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editCustomer),
        }
      );

      if (!res.ok) throw new Error("Failed to update customer");

      setEditCustomer(null);
      loadCustomers();
      alert("Customer updated successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/customers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete customer");

      loadCustomers();
      alert("Customer deleted!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-8 space-y-6">
        <h2 className="text-2xl font-bold mb-4">Customer Management</h2>

        <div className="bg-white p-4 rounded-lg shadow-md space-y-2">
          <h3 className="font-semibold mb-2">
            {editCustomer ? "Edit Customer" : "Add New Customer"}
          </h3>

          <div className="flex gap-2 flex-wrap">

            <select
              value={
                editCustomer ? editCustomer.businessId : newCustomer.businessId
              }
              onChange={(e) =>
                editCustomer
                  ? setEditCustomer({
                    ...editCustomer,
                    businessId: Number(e.target.value),
                  })
                  : setNewCustomer({
                    ...newCustomer,
                    businessId: Number(e.target.value),
                  })
              }
              className="border p-2 rounded flex-1"
            >
              <option value="">Select Business</option>
              {ownerBusinesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Customer Name"
              value={editCustomer ? editCustomer.name : newCustomer.name}
              onChange={(e) =>
                editCustomer
                  ? setEditCustomer({ ...editCustomer, name: e.target.value })
                  : setNewCustomer({ ...newCustomer, name: e.target.value })
              }
              className="border p-2 rounded flex-1"
            />

            <input
              type="text"
              placeholder="Phone"
              value={editCustomer ? editCustomer.phone : newCustomer.phone}
              onChange={(e) =>
                editCustomer
                  ? setEditCustomer({ ...editCustomer, phone: e.target.value })
                  : setNewCustomer({ ...newCustomer, phone: e.target.value })
              }
              className="border p-2 rounded flex-1"
            />

            {editCustomer ? (
              <>
                <button
                  onClick={handleUpdateCustomer}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Update
                </button>
                <button
                  onClick={() => setEditCustomer(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleAddCustomer}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md space-y-2">
          <h3 className="font-semibold mb-2">Search Customer</h3>

          <div className="flex gap-2 flex-wrap">

            <select
              value={searchBusinessId}
              onChange={(e) => setSearchBusinessId(Number(e.target.value))}
              className="border p-2 rounded flex-1"
            >
              <option value="">Select Business</option>
              {ownerBusinesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Search Name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="border p-2 rounded flex-1"
            />

            <button
              onClick={handleSearchCustomer}
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
          ) : customers.length === 0 ? (
            <p>No customers found.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">ID</th>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Phone</th>
                  <th className="p-2 border">Business Name</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-100">
                    <td className="border p-2">{c.id}</td>
                    <td className="border p-2">{c.name}</td>
                    <td className="border p-2">{c.phone}</td>
                    <td className="border p-2">{ownerBusinesses.find(b => b.id === c.businessId)?.name || "Unknown"}</td>


                    <td className="border p-2 flex gap-2">
                      <button
                        onClick={() => setEditCustomer(c)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteCustomer(c.id)}
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
