const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// In-memory data
let products = [
  { id: 1, name: 'Laptop', price: 1200 },
  { id: 2, name: 'Phone', price: 800 },
];
let cart = [];

// User login (hardcoded)
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'test' && password === 'pass123') {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Get products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Add to cart (BUG: does not actually add product)
app.post('/api/cart', (req, res) => {
  // Intentionally buggy: does not push to cart
  res.json({ success: true, cart });
});

// Get cart
app.get('/api/cart', (req, res) => {
  res.json(cart);
});

// Admin: Add product (BUG: does not add to products)
app.post('/api/admin/products', (req, res) => {
  // Intentionally buggy: does not push to products
  res.json({ success: true, products });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});