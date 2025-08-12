const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your-secret-key';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory database (for demo purposes)
let users = [
  {
    id: '1',
    username: 'test',
    password: bcrypt.hashSync('pass123', 10),
    isAdmin: false
  },
  {
    id: '2',
    username: 'admin',
    password: bcrypt.hashSync('admin123', 10),
    isAdmin: true
  }
];

let products = [
  {
    id: '1',
    name: 'Laptop',
    price: 999.99,
    description: 'High-performance laptop',
    image: 'https://via.placeholder.com/300x200?text=Laptop',
    stock: 10
  },
  {
    id: '2',
    name: 'Smartphone',
    price: 699.99,
    description: 'Latest smartphone model',
    image: 'https://via.placeholder.com/300x200?text=Smartphone',
    stock: 15
  },
  {
    id: '3',
    name: 'Headphones',
    price: 199.99,
    description: 'Wireless noise-canceling headphones',
    image: 'https://via.placeholder.com/300x200?text=Headphones',
    stock: 20
  }
];

let carts = {};
let orders = [];

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, isAdmin: user.isAdmin },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin
    }
  });
});

// Product Routes
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

// Admin: Add new product (WITH BUG - products won't be added)
app.post('/api/admin/products', authenticateToken, requireAdmin, (req, res) => {
  const { name, price, description, image, stock } = req.body;

  const newProduct = {
    id: uuidv4(),
    name,
    price: parseFloat(price),
    description,
    image: image || 'https://via.placeholder.com/300x200?text=Product',
    stock: parseInt(stock)
  };

  // BUG: This line is commented out, so products won't be added
  // products.push(newProduct);

  console.log('Attempting to add product:', newProduct);
  
  // Return success even though product wasn't added
  res.status(201).json({ 
    message: 'Product added successfully',
    product: newProduct 
  });
});

// Admin: Update product
app.put('/api/admin/products/:id', authenticateToken, requireAdmin, (req, res) => {
  const { name, price, description, image, stock } = req.body;
  const productIndex = products.findIndex(p => p.id === req.params.id);

  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  products[productIndex] = {
    ...products[productIndex],
    name: name || products[productIndex].name,
    price: price ? parseFloat(price) : products[productIndex].price,
    description: description || products[productIndex].description,
    image: image || products[productIndex].image,
    stock: stock ? parseInt(stock) : products[productIndex].stock
  };

  res.json({
    message: 'Product updated successfully',
    product: products[productIndex]
  });
});

// Admin: Delete product
app.delete('/api/admin/products/:id', authenticateToken, requireAdmin, (req, res) => {
  const productIndex = products.findIndex(p => p.id === req.params.id);

  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  products.splice(productIndex, 1);
  res.json({ message: 'Product deleted successfully' });
});

// Cart Routes
app.get('/api/cart', authenticateToken, (req, res) => {
  const userCart = carts[req.user.id] || [];
  res.json(userCart);
});

// Add to cart (WITH BUG - items won't be added to cart)
app.post('/api/cart/add', authenticateToken, (req, res) => {
  const { productId, quantity } = req.body;
  const product = products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  if (product.stock < quantity) {
    return res.status(400).json({ message: 'Insufficient stock' });
  }

  if (!carts[req.user.id]) {
    carts[req.user.id] = [];
  }

  const existingItem = carts[req.user.id].find(item => item.productId === productId);

  if (existingItem) {
    // BUG: This line has wrong variable name, should be existingItem.quantity
    existingItem.quantitty += quantity;
  } else {
    // BUG: This push is commented out, so new items won't be added
    // carts[req.user.id].push({
    //   productId,
    //   quantity,
    //   product
    // });
  }

  console.log('Attempting to add to cart:', { productId, quantity });
  console.log('Current cart:', carts[req.user.id]);

  res.json({ 
    message: 'Item added to cart successfully',
    cart: carts[req.user.id] 
  });
});

// Remove from cart
app.delete('/api/cart/remove/:productId', authenticateToken, (req, res) => {
  if (!carts[req.user.id]) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  carts[req.user.id] = carts[req.user.id].filter(item => item.productId !== req.params.productId);
  res.json({ 
    message: 'Item removed from cart',
    cart: carts[req.user.id] 
  });
});

// Update cart item quantity
app.put('/api/cart/update', authenticateToken, (req, res) => {
  const { productId, quantity } = req.body;

  if (!carts[req.user.id]) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  const item = carts[req.user.id].find(item => item.productId === productId);
  if (!item) {
    return res.status(404).json({ message: 'Item not found in cart' });
  }

  if (quantity <= 0) {
    carts[req.user.id] = carts[req.user.id].filter(item => item.productId !== productId);
  } else {
    item.quantity = quantity;
  }

  res.json({ 
    message: 'Cart updated successfully',
    cart: carts[req.user.id] 
  });
});

// Checkout
app.post('/api/checkout', authenticateToken, (req, res) => {
  const userCart = carts[req.user.id] || [];

  if (userCart.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  let total = 0;
  const orderItems = [];

  for (const item of userCart) {
    const product = products.find(p => p.id === item.productId);
    if (product && product.stock >= item.quantity) {
      product.stock -= item.quantity;
      total += product.price * item.quantity;
      orderItems.push({
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        price: product.price
      });
    }
  }

  const order = {
    id: uuidv4(),
    userId: req.user.id,
    items: orderItems,
    total: total,
    status: 'completed',
    createdAt: new Date().toISOString()
  };

  orders.push(order);
  carts[req.user.id] = [];

  res.json({
    message: 'Order placed successfully',
    order
  });
});

// Get user orders
app.get('/api/orders', authenticateToken, (req, res) => {
  const userOrders = orders.filter(order => order.userId === req.user.id);
  res.json(userOrders);
});

// Admin: Get all orders
app.get('/api/admin/orders', authenticateToken, requireAdmin, (req, res) => {
  res.json(orders);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});