import React, { useState, useEffect } from "react";

export default function OwnerBusinessPage({ token }) {
  const [businessList, setBusinessList] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadBusinesses = async () => {
    try {
      setLoading(true);
      const ownerId = localStorage.getItem("ownerId")
      const response = await fetch(`http://localhost:8080/api/v1/business/owner/${ownerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status} - ${response.statusText}`);
      const data = await response.json();
      console.log("Fetched businesses:", data);
      setBusinessList(data);
    } catch (err) {
      console.error("Error fetching businesses:", err);
      alert("Error fetching businesses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBusinesses();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-8 space-y-6">
        <h2 className="text-2xl font-bold mb-4">My Business Management</h2>
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
                </tr>
              </thead>
              <tbody>
                {businessList.map((biz) => (
                  <tr key={biz.id} className="hover:bg-gray-100 transition-all">
                    <td className="border p-2">{biz.id}</td>
                    <td className="border p-2">{biz.name}</td>
                    <td className="border p-2">{biz.type}</td>
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
