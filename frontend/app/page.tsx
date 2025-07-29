"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/api/products")
      .then(res => res.json())
      .then(setProducts);
  }, []);

  const addToCart = async (id: number) => {
    setMessage("");
    const res = await fetch("http://localhost:4000/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setMessage("Added to cart!");
    } else {
      setMessage("Failed to add to cart");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <nav style={{ marginBottom: 20 }}>
        <Link href="/login">Login</Link> | <Link href="/cart">Cart</Link> | <Link href="/admin">Admin</Link>
      </nav>
      <h2>Product Catalog</h2>
      {message && <div style={{ color: "green" }}>{message}</div>}
      <ul>
        {products.map((p: any) => (
          <li key={p.id} style={{ marginBottom: 10 }}>
            {p.name} - ${p.price}
            <button style={{ marginLeft: 10 }} onClick={() => addToCart(p.id)}>
              Add to Cart
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
