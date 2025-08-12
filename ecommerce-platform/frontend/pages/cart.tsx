import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { orderAPI } from '../utils/api';

const CartPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { cart, removeFromCart, updateCartItem, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleQuantityChange = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    
    try {
      await updateCartItem(productId, quantity);
    } catch (error) {
      alert('Failed to update cart item');
      console.error('Error updating cart item:', error);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeFromCart(productId);
      alert('Item removed from cart');
    } catch (error) {
      alert('Failed to remove item from cart');
      console.error('Error removing item:', error);
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      const response = await orderAPI.checkout();
      alert('Order placed successfully!');
      clearCart();
      router.push('/orders');
    } catch (error) {
      alert('Failed to place order');
      console.error('Error during checkout:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <div>Please login to view your cart.</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <button
            onClick={() => router.push('/')}
            className="btn-primary"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {cart.map((item) => (
              <div key={item.productId} className="card mb-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{item.product.name}</h3>
                    <p className="text-gray-600">${item.product.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-2 rounded"
                    >
                      -
                    </button>
                    <span className="mx-2 font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-2 rounded"
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="text-lg font-semibold">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                  
                  <button
                    onClick={() => handleRemoveItem(item.productId)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg">Total:</span>
                <span className="text-2xl font-bold text-green-600">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
              
              <button
                onClick={handleCheckout}
                disabled={loading}
                className={`w-full py-3 px-4 rounded font-bold ${
                  loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                {loading ? 'Processing...' : 'Proceed to Checkout'}
              </button>
              
              <button
                onClick={() => router.push('/')}
                className="w-full mt-2 btn-secondary"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;