import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import LoadingScreen from '../loading';

const AdminBulkOrders = () => {
  const [orders, setOrders] = useState([]);
  const [editOrderId, setEditOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = Cookies.get('Jwt_Token');
  const userId = Cookies.get('userId');

  const fetchBulkOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://agrobackendrender.onrender.com/api/admin/bulk-orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch bulk orders');
    }
    setLoading(false);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `https://agrobackendrender.onrender.com/api/admin/orders/${orderId}`,
        { status: newStatus,user_id:userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order.order_id === orderId ? { ...order, status: newStatus } : order
        )
      );

      toast.success('Order status updated');
      setEditOrderId(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status');
    }
  };

  useEffect(() => {
    fetchBulkOrders();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ToastContainer />
      <h2 className="text-3xl font-bold mb-6">Admin - Bulk Orders</h2>

      {loading ? (
        <LoadingScreen />
      ) : orders.length === 0 ? (
        <p>No bulk orders found</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
            >
              <p><strong>Order ID:</strong> {order.order_id}</p>
              <p><strong>Name:</strong> {order.delivery_name}</p>
              <p><strong>Contact:</strong> {order.contact_info}</p>
              <p><strong>Address:</strong> {order.address}</p>

              <div className="flex items-center gap-4 my-4 border border-gray-200 rounded p-2">
                <img
                  src={order.image_url}
                  alt={order.product_name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div>
                  <p><strong>Product:</strong> {order.product_name}</p>
                  <p><strong>Quantity:</strong> {order.quantity}</p>
                </div>
              </div>

              <p><strong>Status:</strong></p>
              <div className="flex items-center gap-3">
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order.order_id, e.target.value)
                  }
                  disabled={editOrderId !== order.order_id}
                  className={`border border-gray-300 rounded px-2 py-1 ${
                    editOrderId !== order.order_id ? 'bg-gray-200' : ''
                  }`}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                {editOrderId === order.order_id ? (
                  <button
                    onClick={() => setEditOrderId(null)}
                    className="px-3 py-1 bg-green-500 text-white rounded"
                  >
                    Done
                  </button>
                ) : (
                  <button
                    onClick={() => setEditOrderId(order.order_id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBulkOrders;
