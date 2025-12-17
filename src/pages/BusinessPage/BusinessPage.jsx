import React, { useState, useEffect } from "react";

export default function BusinessPage({ token }) {
  const [businessList, setBusinessList] = useState([]);
  const [newBusiness, setNewBusiness] = useState({ name: "", type: "", owner_id: "" });
  const [editBusiness, setEditBusiness] = useState(null);
  const [loading, setLoading] = useState(false);
  const [owners, setOwners] = useState([]);

  const loadBusinesses = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/api/v1/business", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status} - ${response.statusText}`);
      const data = await response.json();
      setBusinessList(data);
    } catch (err) {
      console.error("Error fetching businesses:", err);
      alert("Error fetching businesses");
    } finally {
      setLoading(false);
    }
  };

  const loadOwners = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/v1/business/biz/bizowner", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch owners");
      const data = await res.json();
      setOwners(data);
    } catch (err) {
      console.error(err);
      alert("Error fetching owners");
    }
  };

  useEffect(() => {
    loadBusinesses();
    loadOwners();
  }, []);

  const handleAddBusiness = async () => {
    if (!newBusiness.name || !newBusiness.type || !newBusiness.owner_id) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/v1/business", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newBusiness),
      });
      if (!response.ok) throw new Error("Failed to add business");

      setNewBusiness({ name: "", type: "", owner_id: "" });
      loadBusinesses();
      alert("Business added successfully!");
    } catch (err) {
      console.error("Error adding business:", err);
      alert("Error adding business: " + err.message);
    }
  };

  const handleUpdateBusiness = async () => {
    if (!editBusiness.name || !editBusiness.type || !editBusiness.owner_id) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/v1/business/${editBusiness.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editBusiness.name,
          type: editBusiness.type,
          owner_id: editBusiness.owner_id,
        }),
      });
      if (!response.ok) throw new Error("Failed to update business");

      setEditBusiness(null);
      loadBusinesses();
      alert("Business updated successfully!");
    } catch (err) {
      console.error("Error updating business:", err);
      alert("Error updating business: " + err.message);
    }
  };

  const handleDeleteBusiness = async (id) => {
    if (!window.confirm("Are you sure you want to delete this business?")) return;
    try {
      const response = await fetch(`http://localhost:8080/api/v1/business/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to delete business");
      loadBusinesses();
      alert("Business deleted successfully!");
    } catch (err) {
      console.error("Error deleting business:", err);
      alert("Error deleting business: " + err.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-8 space-y-6">
        <h2 className="text-2xl font-bold mb-4">Business Management</h2>

        <div className="bg-white p-4 rounded-lg shadow-md space-y-2">
          <h3 className="font-semibold mb-2">{editBusiness ? "Edit Business" : "Add New Business"}</h3>
          <div className="flex gap-2 flex-wrap">
            <input
              type="text"
              placeholder="Name"
              value={editBusiness ? editBusiness.name : newBusiness.name}
              onChange={(e) =>
                editBusiness
                  ? setEditBusiness({ ...editBusiness, name: e.target.value })
                  : setNewBusiness({ ...newBusiness, name: e.target.value })
              }
              className="border p-2 rounded flex-1"
            />
            <input
              type="text"
              placeholder="Type"
              value={editBusiness ? editBusiness.type : newBusiness.type}
              onChange={(e) =>
                editBusiness
                  ? setEditBusiness({ ...editBusiness, type: e.target.value })
                  : setNewBusiness({ ...newBusiness, type: e.target.value })
              }
              className="border p-2 rounded flex-1"
            />
            <select
              value={editBusiness ? editBusiness.owner_id : newBusiness.owner_id}
              onChange={(e) =>
                editBusiness
                  ? setEditBusiness({ ...editBusiness, owner_id: parseInt(e.target.value) })
                  : setNewBusiness({ ...newBusiness, owner_id: parseInt(e.target.value) })
              }
              className="border p-2 rounded flex-1"
            >
              <option value="">Select Owner Nic Number</option>

              {owners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.nicNumber}
                </option>
              ))}
            </select>

            {editBusiness ? (
              <>
                <button
                  onClick={handleUpdateBusiness}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Update
                </button>
                <button
                  onClick={() => setEditBusiness(null)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleAddBusiness}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add
              </button>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
          {loading ? (
            <p>Loading...</p>
          ) : businessList.length === 0 ? (
            <p>No businesses found.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">ID</th>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Type</th>
                  <th className="p-2 border">Owner ID</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {businessList.map((biz) => (
                  <tr key={biz.id} className="hover:bg-gray-100 transition-all">
                    <td className="border p-2">{biz.id}</td>
                    <td className="border p-2">{biz.name}</td>
                    <td className="border p-2">{biz.type}</td>
                    <td className="border p-2">{biz.owner_id}</td>
                    <td className="border p-2 flex gap-2">
                      <button
                        onClick={() =>
                          setEditBusiness({
                            id: biz.id,
                            name: biz.name,
                            type: biz.type,
                            owner_id: biz.owner_id,
                          })
                        }
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBusiness(biz.id)}
                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
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
