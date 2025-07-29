# E-Commerce Platform

A full-stack e-commerce platform built with Next.js (frontend) and Node.js (backend) with intentional bugs for testing purposes.

## Features

### User Features
- User authentication (login/logout)
- Browse products catalog
- Add products to cart
- View and manage shopping cart
- Checkout and place orders
- View order history

### Admin Features
- Admin panel access
- Add new products to catalog
- Delete products
- View all orders

## Intentional Bugs

This application contains the following intentional bugs for testing purposes:

### 1. Cart Addition Bug
- **Location**: `backend/server.js` - `/api/cart/add` endpoint
- **Issue**: Products cannot be added to cart due to:
  - Typo in variable name: `existingItem.quantitty` instead of `existingItem.quantity`
  - Commented out code that adds new items to cart
- **Symptoms**: Users will see "Item added to cart successfully" message but cart remains empty

### 2. Admin Product Addition Bug
- **Location**: `backend/server.js` - `/api/admin/products` endpoint
- **Issue**: New products cannot be added to catalog due to commented out `products.push(newProduct)` line
- **Symptoms**: Admin will see "Product added successfully" message but product won't appear in catalog

## Technology Stack

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Axios for API calls
- js-cookie for authentication

### Backend
- Node.js
- Express.js
- JWT for authentication
- bcryptjs for password hashing
- CORS enabled
- In-memory data storage

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm run dev
   ```

The backend server will run on `http://localhost:5000`

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:3000`

## Login Credentials

### Regular User
- Username: `test`
- Password: `pass123`

### Admin User
- Username: `admin`
- Password: `admin123`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID

### Cart (Requires Authentication)
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart (BUGGY)
- `DELETE /api/cart/remove/:productId` - Remove item from cart
- `PUT /api/cart/update` - Update cart item quantity

### Orders (Requires Authentication)
- `POST /api/checkout` - Place order
- `GET /api/orders` - Get user's orders

### Admin (Requires Admin Authentication)
- `POST /api/admin/products` - Add new product (BUGGY)
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/orders` - Get all orders

## Project Structure

```
ecommerce-platform/
├── backend/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── components/
│   │   └── Layout.tsx
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── CartContext.tsx
│   ├── pages/
│   │   ├── _app.tsx
│   │   ├── index.tsx
│   │   ├── login.tsx
│   │   ├── cart.tsx
│   │   ├── admin.tsx
│   │   └── orders.tsx
│   ├── styles/
│   │   └── globals.css
│   ├── utils/
│   │   └── api.ts
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── tsconfig.json
└── README.md
```

## Bug Fixes (For Reference)

To fix the intentional bugs:

### Fix Cart Addition Bug
In `backend/server.js`, line ~144:
```javascript
// Fix the typo
existingItem.quantity += quantity; // was: existingItem.quantitty += quantity;

// Uncomment the push for new items
carts[req.user.id].push({
  productId,
  quantity,
  product
});
```

### Fix Admin Product Addition Bug
In `backend/server.js`, line ~122:
```javascript
// Uncomment this line
products.push(newProduct);
```

## Development Notes

- The application uses in-memory storage, so data will be lost when the server restarts
- CORS is enabled for development
- JWT tokens expire after 24 hours
- All API responses include appropriate error handling
- The frontend includes loading states and error messages

## License

This project is for educational purposes only.