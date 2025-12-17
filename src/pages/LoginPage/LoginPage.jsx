import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import React, { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate();

  const showToast = (icon, title) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon,
      title,
    });
  };

  const handleLogin = async () => {
    if (!role) {
      alert("Please select Admin or Business Owner");
      return;
    }

    const loginUrl =
      role === "ADMIN"
        ? "http://localhost:8080/api/v1/admin/login"
        : "http://localhost:8080/api/v1/business/biz/bizowner/login";

    try {
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        alert("Invalid Username or Password");
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("ownerId", data.ownerId)
      localStorage.setItem("name", data.ownerName)

      showToast("success", "Signed in successfully");

      setTimeout(() => {
        if (role === "ADMIN") {
          navigate("/admin-dashboard");
        } else {
          navigate("/owner-dashboard");
        }
      }, 1000);
    } catch (error) {
      console.error(error);
      showToast("error", "Login failed. Check your backend");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-1">
            Login As
          </label>
          <select
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">-- Select Role --</option>
            <option value="ADMIN">Admin</option>
            <option value="OWNER">Business Owner</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Email
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Enter your email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}
