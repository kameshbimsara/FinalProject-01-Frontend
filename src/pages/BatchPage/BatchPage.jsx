import React, { useState, useEffect } from "react";

export default function BatchPage({ token }) {
  const [batches, setBatches] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [newBatch, setNewBatch] = useState({
    manufactureDate: "",
    expireDate: "",
    unitPrice: "",
    quantity: "",
    productId: "",
    supplierId: "",
  });

  const [editBatch, setEditBatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchProductId, setSearchProductId] = useState("");

  const loadBatches = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/v1/batches", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch batches");

      const data = await res.json();
      setBatches(data);
    } catch (err) {
      alert("Error loading batches");
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/v1/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch products");

      const data = await res.json();
      setProducts(data);
    } catch (err) { }
  };

  const loadSuppliers = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/v1/bizsuppler", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch suppliers");

      const data = await res.json();
      setSuppliers(data);
    } catch (err) { }
  };

  useEffect(() => {
    loadBatches();
    loadProducts();
    loadSuppliers();
  }, []);

  const handleAddBatch = async () => {
    if (
      !newBatch.manufactureDate ||
      !newBatch.expireDate ||
      !newBatch.unitPrice ||
      !newBatch.quantity ||
      !newBatch.productId ||
      !newBatch.supplierId
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/v1/batches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newBatch),
      });

      if (!res.ok) throw new Error("Failed to add batch");

      setNewBatch({
        manufactureDate: "",
        expireDate: "",
        unitPrice: "",
        quantity: "",
        productId: "",
        supplierId: "",
      });

      loadBatches();
      alert("Batch added successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateBatch = async () => {
    if (
      !editBatch.manufactureDate ||
      !editBatch.expireDate ||
      !editBatch.unitPrice ||
      !editBatch.quantity ||
      !editBatch.productId ||
      !editBatch.supplierId
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/v1/batches/${editBatch.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editBatch),
      });

      if (!res.ok) throw new Error("Failed to update batch");

      setEditBatch(null);
      loadBatches();
      alert("Batch updated successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteBatch = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/v1/batches/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete batch");

      loadBatches();
      alert("Batch deleted!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSearchBatch = async () => {
    if (!searchProductId) {
      alert("Please select a product to search");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:8080/api/v1/batches/product/${searchProductId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error("Failed to search batches");

      const data = await res.json();
      setBatches(data);
    } catch (err) {
      alert("Error searching batches");
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setSearchProductId("");
    loadBatches();
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-8 space-y-6">
        <h2 className="text-2xl font-bold mb-4">Batch Management</h2>

        <div className="bg-white p-4 rounded-lg shadow-md space-y-2">
          <h3 className="font-semibold mb-3">
            {editBatch ? "Edit Batch" : "Add New Batch"}
          </h3>

          <div className="flex gap-2 flex-wrap">
            <label className="mt-2">Manufacture Date</label>
            <input
              type="date"
              value={editBatch ? editBatch.manufactureDate : newBatch.manufactureDate}
              onChange={(e) =>
                editBatch
                  ? setEditBatch({ ...editBatch, manufactureDate: e.target.value })
                  : setNewBatch({ ...newBatch, manufactureDate: e.target.value })
              }
              className="border p-2 rounded flex-1"
            />
            <label className="mt-2">Expire Date</label>
            <input
              type="date"
              value={editBatch ? editBatch.expireDate : newBatch.expireDate}
              onChange={(e) =>
                editBatch
                  ? setEditBatch({ ...editBatch, expireDate: e.target.value })
                  : setNewBatch({ ...newBatch, expireDate: e.target.value })
              }
              className="border p-2 rounded flex-1"
            />

            <input
              type="number"
              placeholder="Unit Price"
              value={editBatch ? editBatch.unitPrice : newBatch.unitPrice}
              onChange={(e) =>
                editBatch
                  ? setEditBatch({ ...editBatch, unitPrice: e.target.value })
                  : setNewBatch({ ...newBatch, unitPrice: e.target.value })
              }
              className="border p-2 rounded flex-1"
            />

            <input
              type="number"
              placeholder="Quantity"
              value={editBatch ? editBatch.quantity : newBatch.quantity}
              onChange={(e) =>
                editBatch
                  ? setEditBatch({ ...editBatch, quantity: e.target.value })
                  : setNewBatch({ ...newBatch, quantity: e.target.value })
              }
              className="border p-2 rounded flex-1"
            />

            <select
              value={editBatch ? editBatch.productId : newBatch.productId}
              onChange={(e) =>
                editBatch
                  ? setEditBatch({ ...editBatch, productId: Number(e.target.value) })
                  : setNewBatch({ ...newBatch, productId: Number(e.target.value) })
              }
              className="border p-2 rounded flex-1"
            >
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <select
              value={editBatch ? editBatch.supplierId : newBatch.supplierId}
              onChange={(e) =>
                editBatch
                  ? setEditBatch({ ...editBatch, supplierId: Number(e.target.value) })
                  : setNewBatch({ ...newBatch, supplierId: Number(e.target.value) })
              }
              className="border p-2 rounded flex-1"
            >
              <option value="">Select Supplier</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.companyName}
                </option>
              ))}
            </select>

            {editBatch ? (
              <>
                <button
                  onClick={handleUpdateBatch}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Update
                </button>
                <button
                  onClick={() => setEditBatch(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleAddBatch}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md space-y-2">
          <h3 className="font-semibold mb-2">Search Batch by Product</h3>

          <div className="flex gap-2 flex-wrap">
            <select
              value={searchProductId}
              onChange={(e) => setSearchProductId(Number(e.target.value))}
              className="border p-2 rounded flex-1"
            >
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleSearchBatch}
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
          ) : batches.length === 0 ? (
            <p>No batches found.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">ID</th>
                  <th className="p-2 border">Manufacture Date</th>
                  <th className="p-2 border">Expire Date</th>
                  <th className="p-2 border">Unit Price</th>
                  <th className="p-2 border">Quantity</th>
                  <th className="p-2 border">Product</th>
                  <th className="p-2 border">Supplier</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>

              <tbody>
                {batches.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-100">
                    <td className="border p-2">{b.id}</td>
                    <td className="border p-2">{b.manufactureDate}</td>
                    <td className="border p-2">{b.expireDate}</td>
                    <td className="border p-2">{b.unitPrice}</td>
                    <td className="border p-2">{b.quantity}</td>
                    <td className="border p-2">
                      {products.find((p) => p.id === b.productId)?.name || "N/A"}
                    </td>
                    <td className="border p-2">
                      {suppliers.find((s) => s.id === b.supplierId)?.companyName || "N/A"}
                    </td>

                    <td className="border p-2 flex gap-2">
                      <button
                        onClick={() => setEditBatch(b)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteBatch(b.id)}
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
