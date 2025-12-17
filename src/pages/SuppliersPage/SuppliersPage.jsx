import React, { useState, useEffect } from "react";

export default function SupplierPage({ token }) {
  const [suppliers, setSuppliers] = useState([]);
  const [businesses, setBusinesses] = useState([]);

  const [newSupplier, setNewSupplier] = useState({
    companyName: "",
    contactNo: "",
    business_id: "",
  });

  const [editSupplier, setEditSupplier] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [searchBusinessId, setSearchBusinessId] = useState("");

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/v1/bizsuppler", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch suppliers");

      const data = await res.json();
      setSuppliers(data);
    } catch (err) {
      console.error(err);
      alert("Error loading suppliers");
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
    loadSuppliers();
    loadBusinesses();
  }, []);

  const handleAddSupplier = async () => {
    if (!newSupplier.companyName || !newSupplier.contactNo || !newSupplier.companyName) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/v1/bizsuppler", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newSupplier),
      });

      if (!res.ok) throw new Error("Failed to add supplier");

      setNewSupplier({ companyName: "", contactNo: "", business_id: "" });
      loadSuppliers();
      alert("Supplier added successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateSupplier = async () => {
    if (!editSupplier.companyName || !editSupplier.contactNo || !editSupplier.business_id) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/bizsuppler/${editSupplier.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editSupplier),
        }
      );

      if (!res.ok) throw new Error("Failed to update supplier");

      setEditSupplier(null);
      loadSuppliers();
      alert("Supplier updated successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteSupplier = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/v1/bizsuppler/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete supplier");

      loadSuppliers();
      alert("Supplier deleted!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSearchSupplier = async () => {
    try {
      setLoading(true);

      if (!searchBusinessId) {
        alert("Please select a business to search");
        return;
      }

      const res = await fetch(
        `http://localhost:8080/api/v1/bizsuppler/name/${searchName}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to search supplier");

      const data = await res.json();

      if (data.business_id === parseInt(searchBusinessId)) {
        setSuppliers([data]);
      } else {
        setSuppliers([]);
      }

    } catch (err) {
      console.error(err);
      alert("Error searching supplier");
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setSearchName("");
    setSearchBusinessId("");
    loadSuppliers();
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-8 space-y-6">
        <h2 className="text-2xl font-bold mb-4">Supplier Management</h2>

        <div className="bg-white p-4 rounded-lg shadow-md space-y-2">
          <h3 className="font-semibold mb-2">
            {editSupplier ? "Edit Supplier" : "Add New Supplier"}
          </h3>

          <div className="flex gap-2 flex-wrap">
            <input
              type="text"
              placeholder="Company Name"
              value={editSupplier ? editSupplier.companyName : newSupplier.companyName}
              onChange={(e) =>
                editSupplier
                  ? setEditSupplier({ ...editSupplier, companyName: e.target.value })
                  : setNewSupplier({ ...newSupplier, companyName: e.target.value })
              }
              className="border p-2 rounded flex-1"
            />

            <input
              type="text"
              placeholder="Contact Number"
              value={editSupplier ? editSupplier.contactNo : newSupplier.contactNo}
              onChange={(e) =>
                editSupplier
                  ? setEditSupplier({ ...editSupplier, contactNo: e.target.value })
                  : setNewSupplier({ ...newSupplier, contactNo: e.target.value })
              }
              className="border p-2 rounded flex-1"
            />

            <select
              value={editSupplier ? editSupplier.business_id : newSupplier.business_id}
              onChange={(e) =>
                editSupplier
                  ? setEditSupplier({
                    ...editSupplier,
                    business_id: Number(e.target.value),
                  })
                  : setNewSupplier({
                    ...newSupplier,
                    business_id: Number(e.target.value),
                  })
              }
              className="border p-2 rounded flex-1"
            >
              <option value="">Select Business</option>
              {businesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>

            {editSupplier ? (
              <>
                <button
                  onClick={handleUpdateSupplier}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Update
                </button>
                <button
                  onClick={() => setEditSupplier(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleAddSupplier}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md space-y-2">
          <h3 className="font-semibold mb-2">Search Supplier</h3>

          <div className="flex gap-2 flex-wrap">
            <select
              value={searchBusinessId}
              onChange={(e) => setSearchBusinessId(Number(e.target.value))}
              className="border p-2 rounded flex-1"
            >
              <option value="">Select Business</option>
              {businesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Company Name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="border p-2 rounded flex-1"
            />

            <button
              onClick={handleSearchSupplier}
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
          ) : suppliers.length === 0 ? (
            <p>No suppliers found.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">ID</th>
                  <th className="p-2 border">Company Name</th>
                  <th className="p-2 border">Contact No</th>
                  <th className="p-2 border">Business Name</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>

              <tbody>
                {suppliers.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-100">
                    <td className="border p-2">{s.id}</td>
                    <td className="border p-2">{s.companyName}</td>
                    <td className="border p-2">{s.contactNo}</td>
                    <td className="border p-2">{businesses.find((b) => b.id === s.business_id)?.name || "N/A"}</td>

                    <td className="border p-2 flex gap-2">
                      <button
                        onClick={() => setEditSupplier(s)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteSupplier(s.id)}
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
