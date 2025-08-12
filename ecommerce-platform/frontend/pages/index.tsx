import React, { useState, useEffect } from 'react';
import { productsAPI } from '../utils/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  stock: number;
}

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: string) => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      await addToCart(productId, 1);
      alert('Item added to cart successfully!');
    } catch (error) {
      alert('Failed to add item to cart');
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Products</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="card">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover mb-4 rounded"
            />
            
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-4">{product.description}</p>
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold text-green-600">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500">
                Stock: {product.stock}
              </span>
            </div>
            
            <button
              onClick={() => handleAddToCart(product.id)}
              disabled={product.stock === 0}
              className={`w-full py-2 px-4 rounded font-bold ${
                product.stock === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'btn-primary'
              }`}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        ))}
      </div>
      
      {products.length === 0 && (
        <div className="text-center py-8 text-gray-600">
          No products available at the moment.
        </div>
      )}
    </div>
  );
};

export default HomePage;