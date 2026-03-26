import { useState, useEffect } from 'react';
import axios from '../api/axios';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const AdminDashboardPage = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [form, setForm] = useState({
    name: '', description: '', price: '', category: '', image: '', images: '', countInStock: ''
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [success, setSuccess] = useState('');

  const categories = ['Journals & Notebooks', 'Planners', 'Stickers & Bookmarks', 'Pens', 'Keychains'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          axios.get('/products'),
          axios.get('/orders')
        ]);
        setProducts(productsRes.data);
        setOrders(ordersRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const imagesArray = form.images
      ? form.images.split(',').map(url => url.trim()).filter(Boolean)
      : [];
    try {
      if (editingProduct) {
        const { data } = await axios.put(`/products/${editingProduct._id}`, {
          ...form,
          price: Number(form.price),
          countInStock: Number(form.countInStock),
          images: imagesArray
        });
        setProducts(products.map(p => p._id === editingProduct._id ? data : p));
        setEditingProduct(null);
        setSuccess('Product updated successfully!');
      } else {
        const { data } = await axios.post('/products', {
          ...form,
          price: Number(form.price),
          countInStock: Number(form.countInStock),
          images: imagesArray
        });
        setProducts([...products, data]);
        setSuccess('Product added successfully!');
      }
      setForm({ name: '', description: '', price: '', category: '', image: '', images: '', countInStock: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image || '',
      images: product.images ? product.images.join(', ') : '',
      countInStock: product.countInStock
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setForm({ name: '', description: '', price: '', category: '', image: '', images: '', countInStock: '' });
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      const { data } = await axios.put(`/orders/${orderId}/status`, { status });
      setOrders(orders.map(o => o._id === orderId ? data : o));
      if (selectedOrder?._id === orderId) setSelectedOrder(data);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p className="text-center py-20">Loading dashboard...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-amber-900 mb-8">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-2 rounded-lg font-semibold ${
            activeTab === 'orders'
              ? 'bg-amber-800 text-white'
              : 'bg-white text-amber-800 border border-amber-800'
          }`}
        >
          Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-6 py-2 rounded-lg font-semibold ${
            activeTab === 'products'
              ? 'bg-amber-800 text-white'
              : 'bg-white text-amber-800 border border-amber-800'
          }`}
        >
          Products ({products.length})
        </button>
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="flex gap-6">
          {/* Orders Table */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-amber-50 text-amber-900">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Order ID</th>
                    <th className="px-4 py-3 text-left font-semibold">Customer</th>
                    <th className="px-4 py-3 text-left font-semibold">Total</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-left font-semibold">Date</th>
                    <th className="px-4 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-10 text-gray-400">No orders yet!</td>
                    </tr>
                  ) : (
                    orders.map(order => (
                      <tr
                        key={order._id}
                        className={`hover:bg-amber-50 transition cursor-pointer ${selectedOrder?._id === order._id ? 'bg-amber-50' : ''}`}
                        onClick={() => setSelectedOrder(order)}
                      >
                        <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                          #{order._id.slice(-8).toUpperCase()}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-gray-800">
                            {order.shippingAddress?.fullName || order.user?.name || 'Customer'}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {order.shippingAddress?.email || order.user?.email}
                          </p>
                        </td>
                        <td className="px-4 py-3 font-bold text-amber-800">
                          ${order.totalPrice?.toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2 flex-wrap">
                            {order.status !== 'shipped' && order.status !== 'delivered' && order.status !== 'cancelled' && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleUpdateStatus(order._id, 'shipped'); }}
                                className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-indigo-700 transition"
                              >
                                Mark Shipped
                              </button>
                            )}
                            {order.status === 'shipped' && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleUpdateStatus(order._id, 'delivered'); }}
                                className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-green-700 transition"
                              >
                                Mark Delivered
                              </button>
                            )}
                            {order.status !== 'cancelled' && order.status !== 'delivered' && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleUpdateStatus(order._id, 'cancelled'); }}
                                className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-xs font-medium hover:bg-red-200 transition"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Details Panel */}
          {selectedOrder && (
            <div className="w-80 bg-white rounded-xl shadow p-6 flex-shrink-0">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">Order Details</h3>
                <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>

              <p className="text-xs text-gray-400 font-mono mb-4">
                #{selectedOrder._id.slice(-8).toUpperCase()}
              </p>

              {/* Status Badge */}
              <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[selectedOrder.status]}`}>
                {selectedOrder.status}
              </span>

              {/* Customer Info */}
              <div className="mt-4 space-y-1">
                <p className="text-sm font-semibold text-gray-700">Customer</p>
                <p className="text-sm text-gray-600">{selectedOrder.shippingAddress?.fullName || selectedOrder.user?.name}</p>
                <p className="text-sm text-gray-400">{selectedOrder.shippingAddress?.email || selectedOrder.user?.email}</p>
                {selectedOrder.shippingAddress?.phone && (
                  <p className="text-sm text-gray-400">{selectedOrder.shippingAddress.phone}</p>
                )}
              </div>

              {/* Shipping Address */}
              <div className="mt-4 space-y-1">
                <p className="text-sm font-semibold text-gray-700">Shipping Address</p>
                <p className="text-sm text-gray-600">{selectedOrder.shippingAddress?.address}</p>
                <p className="text-sm text-gray-600">
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}
                </p>
              </div>

              {/* Items */}
              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Items</p>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.name} x{item.quantity}</span>
                      <span className="text-gray-800 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-3 pt-3 flex justify-between font-bold text-amber-800">
                  <span>Total</span>
                  <span>${selectedOrder.totalPrice?.toFixed(2)}</span>
                </div>
              </div>

              {/* Quick Status Update */}
              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Update Status</p>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleUpdateStatus(selectedOrder._id, e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editingProduct ? `Editing: ${editingProduct.name}` : 'Add New Product'}
            </h2>
            {success && (
              <div className="bg-green-100 text-green-700 px-4 py-3 rounded-lg mb-4">
                {success}
              </div>
            )}
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Product name"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Price"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
              <input
                type="number"
                name="countInStock"
                value={form.countInStock}
                onChange={handleChange}
                placeholder="Count in stock"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
              <input
                type="text"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="Main image URL"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <input
                type="text"
                name="images"
                value={form.images}
                onChange={handleChange}
                placeholder="Extra image URLs (comma separated)"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 md:col-span-2"
                required
              />
              <button
                type="submit"
                className={`${editingProduct ? 'md:col-span-1' : 'md:col-span-2'} bg-amber-800 text-white py-3 rounded-lg font-semibold hover:bg-amber-900 transition`}
              >
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
              {editingProduct && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              )}
            </form>
          </div>

          {/* Products List */}
          <div className="space-y-3">
            {products.map(product => (
              <div key={product._id} className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  {product.image && (
                    <img src={product.image} alt={product.name} className="w-12 h-12 object-contain rounded-lg bg-amber-50" />
                  )}
                  <div>
                    <p className="font-semibold text-gray-800">{product.name}</p>
                    <p className="text-gray-500 text-sm">
                      {product.category} — ${product.price}
                      {product.images?.length > 0 && (
                        <span className="ml-2 text-amber-700">+{product.images.length} photos</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-amber-800 border border-amber-800 px-3 py-1 rounded-lg text-sm font-medium hover:bg-amber-50 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="text-red-500 hover:text-red-700 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;