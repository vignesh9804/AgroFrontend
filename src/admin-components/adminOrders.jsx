import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast,ToastContainer } from 'react-toastify';
import ClipLoader from 'react-spinners/ClipLoader';
import 'react-toastify/dist/ReactToastify.css';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editOrderId, setEditOrderId] = useState(null);
  const token = Cookies.get('Jwt_Token');
  const userRole = Cookies.get('userRole');

  const fetchOrders = async () => {
    try {
      const response = await axios.get('https://agrobackend-sptw.onrender.com/api/admin/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const groupedOrders = groupByOrderId(response.data);
      setOrders(groupedOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
      toast.error('Failed to load orders ❌');
    } finally {
      setIsLoading(false);
    }
  };

  const groupByOrderId = (data) => {
    const grouped = {};

    data.forEach((row) => {
      const {
        order_id,
        user_id,
        status,
        delivery_name,
        contact_info,
        address,
        product_id,
        quantity,
        product_name,
        image_url,
      } = row;

      if (!grouped[order_id]) {
        grouped[order_id] = {
          order_id,
          user_id,
          status,
          delivery_name,
          contact_info,
          address,
          items: [],
        };
      }

      grouped[order_id].items.push({ product_id, quantity, product_name, image_url });
    });

    return Object.values(grouped);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Make sure user_id is included in the request body
  
      const response = await axios.put(
        `https://agrobackend-sptw.onrender.com/api/admin/orders/${orderId}`,
        {
          status: newStatus,
          user:{role:`${userRole}`} // Send user_id in the request body
        },
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
  
      toast.success('Order status updated ✅');
      setEditOrderId(null); // Exit edit mode
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error('Failed to update order status ❌');
    }
  };
  

  useEffect(() => {
    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader color="#4F46E5" size={50} />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Admin - All Orders</h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600">No orders found</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.order_id}
              className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
            >
              <div className="mb-2 font-semibold text-gray-700">
                Order #{order.order_id}
              </div>
              <p><span className="font-medium">Name:</span> {order.delivery_name}</p>
              <p><span className="font-medium">Contact:</span> {order.contact_info}</p>
              <p><span className="font-medium">Address:</span> {order.address}</p>

              <div className="mt-3">
                <span className="font-medium block mb-1">Items:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {order.items.map((item) => (
                    <div
                      key={item.product_id}
                      className="flex items-center border border-gray-200 p-2 rounded"
                    >
                      <img
                        src={item.image_url}
                        alt={item.product_name}
                        className="w-16 h-16 object-cover rounded mr-4"
                      />
                      <div>
                        <p className="font-semibold">{item.product_name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <label className="mr-2 font-medium">Status:</label>
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order.order_id, e.target.value)
                  }
                  disabled={editOrderId !== order.order_id}
                  className={`border border-gray-300 rounded px-2 py-1 ${
                    editOrderId !== order.order_id ? 'bg-gray-200 cursor-not-allowed' : ''
                  }`}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                {editOrderId === order.order_id ? (
                  <button
                    onClick={() => setEditOrderId(null)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Done
                  </button>
                ) : (
                  <button
                    onClick={() => setEditOrderId(order.order_id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
    </div>
  );
};

export default AdminOrdersPage;
