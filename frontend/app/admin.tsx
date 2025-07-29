"use client";
import { useState } from "react";
import Link from "next/link";

export default function Admin() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    const res = await fetch("http://localhost:4000/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price }),
    });
    if (res.ok) {
      setMessage("Product added!");
      setName("");
      setPrice("");
    } else {
      setMessage("Failed to add product");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto" }}>
      <nav style={{ marginBottom: 20 }}>
        <Link href="/">Home</Link>
      </nav>
      <h2>Admin: Add Product</h2>
      {message && <div style={{ color: "green" }}>{message}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label>Price:</label>
          <input type="number" value={price} onChange={e => setPrice(e.target.value)} required />
        </div>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}