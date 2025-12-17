import React, { useState, useEffect } from "react";

export default function ProductPage({ token }) {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [businesses, setBusinesses] = useState([]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    brand: "",
    description: "",
    quantity: "",
    supplierId: "",
    businessId: "",
  });

  const [editProduct, setEditProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchProductName, setSearchProductName] = useState("");
  const [searchBusinessId, setSearchBusinessId] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/v1/products", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch products");

      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      alert("Error loading products");
    } finally {
      setLoading(false);
    }
  };

  const loadSuppliers = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/v1/bizsuppler", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch suppliers");

      const data = await res.json();
      setSuppliers(data);
    } catch (err) {
      console.error(err);
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
    loadProducts();
    loadSuppliers();
    loadBusinesses();
  }, []);

  const handleAddProduct = async () => {
    const { name, brand, description, quantity, supplierId, businessId } = newProduct;



    if (!name || !brand || !description || !quantity || !supplierId || !businessId) {
      alert("Please fill all fields");
      console.log(newProduct);
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/v1/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProduct),

      });

      if (!res.ok) throw new Error("Failed to add product");

      setNewProduct({
        name: "",
        brand: "",
        description: "",
        quantity: "",
        supplierId: "",
        businessId: "",
      });

      loadProducts();
      alert("Product added successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateProduct = async () => {
    const { name, brand, description, quantity, supplierId, businessId } = editProduct;

    if (!name || !brand || !description || !quantity || !supplierId || !businessId) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/products/${editProduct.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editProduct),
        }
      );

      if (!res.ok) throw new Error("Failed to update product");

      setEditProduct(null);
      loadProducts();
      alert("Product updated successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/v1/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete product");

      loadProducts();
      alert("Product deleted!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSearch = () => {
    if (!searchBusinessId) {
      alert("Select a business");
      return;
    }

    const filtered = products.filter(
      (p) =>
        p.businessId === Number(searchBusinessId) &&
        p.name.toLowerCase().includes(searchProductName.toLowerCase())
    );

    setProducts(filtered);
  };

  const resetSearch = () => {
    setSearchProductName("");
    setSearchBusinessId("");
    loadProducts();
  };

  const getSupplierName = (id) =>
    suppliers.find((s) => s.id === id)?.companyName || "Unknown";

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-8 space-y-6">
        <h2 className="text-2xl font-bold mb-4">Product Management</h2>

        <div className="bg-white p-4 rounded shadow-md space-y-2">
          <h3 className="font-semibold">
            {editProduct ? "Edit Product" : "Add New Product"}
          </h3>

          <div className="flex gap-2 flex-wrap">
            <input
              type="text"
              placeholder="Product Name"
              value={editProduct ? editProduct.name : newProduct.name}
              onChange={(e) =>
                editProduct
                  ? setEditProduct({ ...editProduct, name: e.target.value })
                  : setNewProduct({ ...newProduct, name: e.target.value })
              }
              className="border p-2 rounded flex-1"
            />

            <input
              type="text"
              placeholder="Brand"
              value={editProduct ? editProduct.brand : newProduct.brand}
              onChange={(e) =>
                editProduct
                  ? setEditProduct({ ...editProduct, brand: e.target.value })
                  : setNewProduct({ ...newProduct, brand: e.target.value })
              }
              className="border p-2 rounded flex-1"
            />

            <input
              type="number"
              placeholder="Quantity"
              value={editProduct ? editProduct.quantity : newProduct.quantity}
              onChange={(e) =>
                editProduct
                  ? setEditProduct({
                    ...editProduct,
                    quantity: Number(e.target.value),
                  })
                  : setNewProduct({
                    ...newProduct,
                    quantity: Number(e.target.value),
                  })
              }
              className="border p-2 rounded flex-1"
            />

            <select
              value={editProduct ? editProduct.supplierId : newProduct.supplierId}
              onChange={(e) =>
                editProduct
                  ? setEditProduct({
                    ...editProduct,
                    supplierId: Number(e.target.value),
                  })
                  : setNewProduct({
                    ...newProduct,
                    supplierId: Number(e.target.value),
                  })
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

            <select
              value={editProduct ? editProduct.businessId : newProduct.businessId}
              onChange={(e) =>
                editProduct
                  ? setEditProduct({
                    ...editProduct,
                    businessId: Number(e.target.value),
                  })
                  : setNewProduct({
                    ...newProduct,
                    businessId: Number(e.target.value),
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

            <input
              type="text"
              placeholder="Description"
              value={
                editProduct ? editProduct.description : newProduct.description
              }
              onChange={(e) =>
                editProduct
                  ? setEditProduct({
                    ...editProduct,
                    description: e.target.value,
                  })
                  : setNewProduct({
                    ...newProduct,
                    description: e.target.value,
                  })
              }
              className="border p-2 rounded flex-1"
            />

            {editProduct ? (
              <>
                <button
                  onClick={handleUpdateProduct}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Update
                </button>
                <button
                  onClick={() => setEditProduct(null)}
                  className="bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleAddProduct}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow-md space-y-2">
          <h3 className="font-semibold">Search Products</h3>

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
              placeholder="Product Name"
              value={searchProductName}
              onChange={(e) => setSearchProductName(e.target.value)}
              className="border p-2 rounded flex-1"
            />

            <button
              onClick={handleSearch}
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

        <div className="bg-white p-4 rounded shadow-md overflow-x-auto">
          {loading ? (
            <p>Loading...</p>
          ) : products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">ID</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Brand</th>
                  <th className="border p-2">Description</th>
                  <th className="border p-2">Qty</th>
                  <th className="border p-2">Supplier</th>
                  <th className="border p-2">Business</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-100">
                    <td className="border p-2">{p.id}</td>
                    <td className="border p-2">{p.name}</td>
                    <td className="border p-2">{p.brand}</td>
                    <td className="border p-2">{p.description}</td>
                    <td className="border p-2">{p.quantity}</td>
                    <td className="border p-2">{getSupplierName(p.supplierId)}</td>
                    <td className="border p-2">
                      {businesses.find((b) => b.id === p.businessId)?.name ||
                        "Unknown"}
                    </td>

                    <td className="border p-2 flex gap-2">
                      <button
                        onClick={() => setEditProduct(p)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(p.id)}
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
