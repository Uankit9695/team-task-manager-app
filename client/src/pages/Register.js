import React, { useState } from "react";
import API from "../services/api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    try {
      await API.post("/auth/register", { name, email, password });
      alert("Signup successful! Now login.");
      window.location.href = "/";
    } catch (err) {
      alert(err.response?.data || "Error signing up");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4">Signup</h2>

        <input
          placeholder="Name"
          className="border p-2 w-full mb-2"
          onChange={(e)=>setName(e.target.value)}
        />

        <input
          placeholder="Email"
          className="border p-2 w-full mb-2"
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-2"
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button
          onClick={register}
          className="bg-green-600 text-white w-full py-2 rounded"
        >
          Signup
        </button>
      </div>
    </div>
  );
}

export default Register;