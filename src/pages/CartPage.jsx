import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await axios.get('/cart');
        setCart(data);
        setSelected(data?.items?.map(item => item.product?._id) || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleRemove = async (productId) => {
  try {
    await axios.delete(`/cart/${productId}`);
    const { data } = await axios.get('/cart');
    setCart(data);
    setSelected(prev => prev.filter(id => id !== productId));
  } catch (error) {
    console.error(error);
  }
};

  const handleRemoveSelected = async () => {
    try {
      for (const productId of selected) {
        await axios.delete(`/cart/${productId}`);
      }
      const { data } = await axios.get('/cart');
      setCart(data);
      setSelected([]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleQuantityChange = async (productId, newQty) => {
  if (newQty < 1) return;
  try {
    await axios.put(`/cart/${productId}`, { quantity: newQty });
    const { data } = await axios.get('/cart');
    setCart(data);
  } catch (error) {
    console.error(error);
  }
};

  const toggleSelect = (productId) => {
    setSelected(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === cart.items.length) {
      setSelected([]);
    } else {
      setSelected(cart.items.map(item => item.product?._id));
    }
  };

  const getTotal = () => {
    if (!cart || !cart.items) return '0.00';
    return cart.items
      .filter(item => selected.includes(item.product?._id))
      .reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0)
      .toFixed(2);
  };

  if (loading) return <p className="text-center py-20">Loading cart...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-amber-900 mb-8">Your Cart</h1>

      {!cart || cart.items?.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
          <Link
            to="/shop"
            className="bg-amber-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-900"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div>
          {/* Select All + Remove Selected */}
          <div className="flex justify-between items-center mb-4">
            <label className="flex items-center gap-2 text-gray-700 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={selected.length === cart.items.length}
                onChange={toggleSelectAll}
                className="w-4 h-4 accent-amber-800"
              />
              Select All
            </label>
            {selected.length > 0 && (
              <button
                onClick={handleRemoveSelected}
                className="text-red-500 hover:text-red-700 font-medium text-sm"
              >
                Remove Selected ({selected.length})
              </button>
            )}
          </div>

          <div className="space-y-4">
            {cart.items.map(item => (
              <div key={item._id} className="bg-white rounded-xl shadow p-4 flex justify-between items-center gap-4">
                <div className="flex items-center gap-4 flex-1">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selected.includes(item.product?._id)}
                    onChange={() => toggleSelect(item.product?._id)}
                    className="w-4 h-4 accent-amber-800"
                  />

                  {/* Product Image */}
                  <div className="bg-amber-50 rounded-lg w-16 h-16 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {item.product?.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-3xl">📓</span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{item.product?.name}</p>
                    <p className="text-amber-800 font-bold">${item.product?.price?.toFixed(2)}</p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleQuantityChange(item.product?._id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-amber-50 transition font-bold"
                      >
                        −
                      </button>
                      <span className="text-gray-800 font-medium w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.product?._id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-amber-50 transition font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Item Total + Remove */}
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-gray-800">
                    ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleRemove(item.product?._id)}
                    className="text-red-500 hover:text-red-700 font-medium text-sm mt-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total + Checkout */}
          <div className="bg-white rounded-xl shadow p-6 mt-6">
            <p className="text-sm text-gray-400 mb-2">
              Total for {selected.length} selected item{selected.length !== 1 ? 's' : ''}
            </p>
            <div className="flex justify-between items-center text-xl font-bold text-gray-800">
              <span>Total</span>
              <span className="text-amber-800">${getTotal()}</span>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              disabled={selected.length === 0}
              className="w-full bg-amber-800 text-white py-3 rounded-lg font-semibold hover:bg-amber-900 transition mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Proceed to Checkout ({selected.length} items)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;