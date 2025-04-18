import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { MdDelete } from 'react-icons/md';
import { toast, ToastContainer } from 'react-toastify'; // Import ToastContainer here
import 'react-toastify/dist/ReactToastify.css';
import LoadingScreen from '../loading'; // Import LoadingScreen

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [deliveryDetails, setDeliveryDetails] = useState({
    delivery_name: '',
    contact_info: '',
    address: '',
  });
  const [loading, setLoading] = useState(false); // Loading state for placing order
  const [isFetching, setIsFetching] = useState(false); // Loading state for cart items fetch

  const token = Cookies.get('Jwt_Token');
  const userId = Cookies.get('userId');

  const fetchCartItems = useCallback(async () => {
    setIsFetching(true);
    try {
      if (!userId || !token) {
        console.error('User ID or Token missing');
        return;
      }

      const res = await axios.post(
        'http://localhost:5001/api/cart',
        { user_id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCartItems(res.data);
      calculateTotal(res.data);
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setIsFetching(false);
    }
  }, [userId, token]);

  const calculateTotal = (items) => {
    const sum = items.reduce((acc, item) => acc + item.price * item.quantity_cart, 0);
    setTotal(sum);
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1 || newQuantity > 6) return;

    try {
      await axios.put(
        'http://localhost:5001/api/cart/update',
        {
          user_id: userId,
          product_id: productId,
          quantity: newQuantity,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchCartItems();
    } catch (err) {
      console.error('Error updating cart quantity:', err);
    }
  };

  const handleDeleteItem = async (productId) => {
    try {
      await axios.delete('http://localhost:5001/api/cart/delete', {
        data: { user_id: userId, product_id: productId },
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchCartItems();
    } catch (err) {
      console.error('Error deleting item from cart:', err);
    }
  };

  const handlePlaceOrder = async () => {
    const { delivery_name, contact_info, address } = deliveryDetails;

    if (!delivery_name || !contact_info || !address) {
      toast.error('Please fill all delivery details');
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        'http://localhost:5001/api/orders',
        {
          user_id: userId,
          delivery_name,
          contact_info,
          address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('✅ Order placed successfully!');
      setCartItems([]);
      setTotal(0);
      setDeliveryDetails({ delivery_name: '', contact_info: '', address: '' });
    } catch (err) {
      console.error('Error placing order:', err);
      toast.error('❌ Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  return (
    <>
      {isFetching || loading ? <LoadingScreen /> : null}

      <div className="p-6 bg-gray-100 min-h-screen md:flex gap-4">
        <div className="basis-2/3">
          <div className="overflow-y-scroll max-h-[70vh]">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div
                  key={item.product_id}
                  className="bg-white shadow-md p-4 rounded mb-4 flex justify-between items-center"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p>Price: ₹{item.price}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity_cart - 1)}
                          className="bg-red-500 text-white px-2 rounded hover:bg-red-600"
                          disabled={item.quantity_cart <= 1}
                        >
                          −
                        </button>
                        <span>{item.quantity_cart}</span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity_cart + 1)}
                          className="bg-green-500 text-white px-2 rounded hover:bg-green-600"
                          disabled={item.quantity_cart >= 6}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <p className="font-bold">₹{item.price * item.quantity_cart}</p>
                    <button onClick={() => handleDeleteItem(item.product_id)}>
                      <MdDelete className="text-red-600 text-2xl hover:text-red-800" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">Your cart is empty</p>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold">Total: ₹{total}</h3>
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded shadow ht-6 md:h-fit basis-1/3">
          <h3 className="text-lg font-semibold mb-2">Delivery Details</h3>
          <input
            type="text"
            placeholder="Delivery Name"
            value={deliveryDetails.delivery_name}
            onChange={(e) =>
              setDeliveryDetails({ ...deliveryDetails, delivery_name: e.target.value })
            }
            className="border p-2 w-full mb-2"
          />
          <input
            type="text"
            placeholder="Contact Info"
            value={deliveryDetails.contact_info}
            onChange={(e) =>
              setDeliveryDetails({ ...deliveryDetails, contact_info: e.target.value })
            }
            className="border p-2 w-full mb-2"
          />
          <textarea
            placeholder="Address"
            value={deliveryDetails.address}
            onChange={(e) =>
              setDeliveryDetails({ ...deliveryDetails, address: e.target.value })
            }
            className="border p-2 w-full mb-2"
          />
          <button
            onClick={handlePlaceOrder}
            className={`bg-blue-600 text-white py-2 px-4 rounded mt-2 hover:bg-blue-700 ${loading ? 'cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>

      {/* Add ToastContainer here */}
      <ToastContainer /> {/* ToastContainer should be added to show toasts */}
    </>
  );
};

export default CartPage;
