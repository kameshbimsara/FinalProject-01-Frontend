import React, { useState, useEffect } from "react";

export default function BusinessOwnerPage({ token }) {
  const [owners, setOwners] = useState([]);
  const [newOwner, setNewOwner] = useState({ name: "", email: "", password: "", nicNumber: "" });
  const [editOwner, setEditOwner] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadOwners = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/v1/business/biz/bizowner", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch owners");
      const data = await res.json();
      setOwners(data);
    } catch (err) {
      console.error(err);
      alert("Error fetching owners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOwners();
  }, []);

  const handleAddOwner = async () => {
    if (!newOwner.name || !newOwner.email || !newOwner.password || !newOwner.nicNumber) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/v1/business/biz/bizowner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newOwner),
      });
      if (!res.ok) throw new Error("Failed to add owner");

      setNewOwner({ name: "", email: "", password: "", nicNumber: "" });
      loadOwners();
      alert("Owner added successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateOwner = async () => {
    if (!editOwner.name || !editOwner.email || !editOwner.password || !editOwner.nicNumber) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/v1/business/biz/bizowner/${editOwner.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editOwner),
      });
      if (!res.ok) throw new Error("Failed to update owner");

      setEditOwner(null);
      loadOwners();
      alert("Owner updated successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteOwner = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/v1/business/biz/bizowner/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete owner");

      loadOwners();
      alert("Owner deleted!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-8 space-y-6">
        <h2 className="text-2xl font-bold mb-4">Business Owner Management</h2>

        <div className="bg-white p-4 rounded-lg shadow-md space-y-2">
          <h3 className="font-semibold mb-2">{editOwner ? "Edit Owner" : "Add New Owner"}</h3>
          <div className="flex gap-2 flex-wrap">
            <input
              type="text"
              placeholder="Name"
              value={editOwner ? editOwner.name : newOwner.name}
              onChange={(e) =>
                editOwner
                  ? setEditOwner({ ...editOwner, name: e.target.value })
                  : setNewOwner({ ...newOwner, name: e.target.value })
              }
              className="border p-2 rounded flex-1"
            />

            <input
              type="text"
              placeholder="Email"
              value={editOwner ? editOwner.email : newOwner.email}
              onChange={(e) =>
                editOwner
                  ? setEditOwner({ ...editOwner, email: e.target.value })
                  : setNewOwner({ ...newOwner, email: e.target.value })
              }
              className="border p-2 rounded flex-1"
            />

            <input
              type="password"
              placeholder="Password"
              value={editOwner ? editOwner.password : newOwner.password}
              onChange={(e) =>
                editOwner
                  ? setEditOwner({ ...editOwner, password: e.target.value })
                  : setNewOwner({ ...newOwner, password: e.target.value })
              }
              className="border p-2 rounded flex-1"
            />

            <input
              type="text"
              placeholder="NIC  Number"
              value={editOwner ? editOwner.nicNumber : newOwner.nicNumber}
              onChange={(e) =>
                editOwner
                  ? setEditOwner({ ...editOwner, nicNumber: e.target.value })
                  : setNewOwner({ ...newOwner, nicNumber: e.target.value })
              }
              className="border p-2 rounded flex-1"
            />

            {editOwner ? (
              <>
                <button
                  onClick={handleUpdateOwner}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Update
                </button>
                <button
                  onClick={() => setEditOwner(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleAddOwner}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
          {loading ? (
            <p>Loading...</p>
          ) : owners.length === 0 ? (
            <p>No owners found.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">ID</th>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {owners.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-100">
                    <td className="border p-2">{o.id}</td>
                    <td className="border p-2">{o.name}</td>
                    <td className="border p-2">{o.email}</td>
                    <td className="border p-2 flex gap-2">
                      <button
                        onClick={() => setEditOwner(o)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteOwner(o.id)}
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
