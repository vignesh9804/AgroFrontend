import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../loading'; // Assuming you have a LoadingScreen component

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading status
  const token = Cookies.get('Jwt_Token');
  const userId = Cookies.get('userId');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !userId) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.post(
          'http://localhost:5001/api/myorders',
          { user_id: userId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setOrders(res.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false); // Stop loading once the data is fetched
      }
    };

    fetchOrders();
  }, [userId, token, navigate]);

  return (
    <>
      {loading && <LoadingScreen />} {/* Show loading screen if data is being fetched */}
      {!loading && 
      <div className="p-6 bg-gray-100 min-h-screen">
        <h2 className="text-3xl font-bold mb-6">Your Orders</h2>

        {orders.length > 0 ? (
          orders.map((order, index) => (
            <div
              key={order.order_id}
              className="bg-white shadow-lg rounded-xl p-6 mb-6 relative border border-gray-200"
            >
              <div className="absolute top-4 right-4 text-sm font-semibold text-green-600">
                {order.status}
              </div>
              <h3 className="text-xl font-semibold mb-2">Order #{index + 1}</h3>
              <p className="text-gray-700 mb-1">Items: {order.no_of_items}</p>
              <p className="text-gray-800 font-semibold mb-4">
                Total Cost: ₹{parseFloat(order.price).toFixed(2)}
              </p>

              <p className="text-lg font-semibold mb-2">Ordered Items:</p>
              <div className="space-y-4">
                {order.products.map((product, idx) => (
                  <div
                    key={idx}
                    className="flex items-center bg-gray-50 rounded-md p-3 shadow-sm"
                  >
                    <img
                      src={product.image_url}
                      alt={product.product_name}
                      className="w-16 h-16 object-cover rounded-md mr-4"
                    />
                    <div>
                      <p className="text-gray-900 font-medium">
                        {product.product_name}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Quantity: {product.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center">No orders available</p>
        )}
      </div>}
    </>
  );
};

export default OrdersPage;
