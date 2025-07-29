"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/cart")
      .then(res => res.json())
      .then(setCart);
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <nav style={{ marginBottom: 20 }}>
        <Link href="/">Home</Link>
      </nav>
      <h2>Your Cart</h2>
      <ul>
        {cart.length === 0 && <li>Cart is empty.</li>}
        {cart.map((item: any, idx: number) => (
          <li key={idx}>{item.name} - ${item.price}</li>
        ))}
      </ul>
    </div>
  );
}