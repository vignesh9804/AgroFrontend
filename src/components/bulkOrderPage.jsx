import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the toast styles
import LoadingScreen from "../loading"; // Assuming you have a LoadingScreen component

const BulkOrderPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(10); // Minimum quantity 10
  const [deliveryDetails, setDeliveryDetails] = useState({
    delivery_name: "",
    contact_info: "",
    address: "",
  });
  const [totalCost, setTotalCost] = useState(0);
  const [loading, setLoading] = useState(false); // Loading state for placing the order

  const token = Cookies.get("Jwt_Token");
  const userId = Cookies.get("userId");
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token || !userId) {
      navigate("/login");
    }
  }, [token, userId, navigate]);

  // Fetch all products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("https://agrobackendrender.onrender.com/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    if (token) fetchProducts();
  }, [token]);

  const handleProductChange = (e) => {
    setSelectedProduct(e.target.value);
    const selected = products.find((p) => p.product_id === e.target.value);
    if (selected) {
      setTotalCost(selected.price * quantity);
    }
  };

  const handleQuantityChange = (e) => {
    const newQuantity = Math.max(10, parseInt(e.target.value));
    setQuantity(newQuantity);
    const selected = products.find((p) => p.product_id === selectedProduct);
    if (selected) {
      setTotalCost(selected.price * newQuantity);
    }
  };

  const handleDeliveryDetailsChange = (e) => {
    setDeliveryDetails({
      ...deliveryDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlaceOrder = async () => {
    const { delivery_name, contact_info, address } = deliveryDetails;

    if (!delivery_name || !contact_info || !address || !selectedProduct || quantity < 10) {
      toast.error("❌ Please fill all the fields correctly.");
      return;
    }

    setLoading(true); // Start loading
    try {
      await axios.post(
        "https://agrobackendrender.onrender.com/api/bulk-orders",
        {
          user_id: userId,
          product_id: selectedProduct,
          quantity,
          delivery_name,
          contact_info,
          address,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("✅ Bulk order placed successfully!");
      setSelectedProduct("");
      setQuantity(10);
      setDeliveryDetails({
        delivery_name: "",
        contact_info: "",
        address: "",
      });
      setTotalCost(0);
    } catch (err) {
      console.error("Error placing bulk order:", err);
      toast.error("❌ Failed to place bulk order.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <>
      <ToastContainer /> {/* ToastContainer to render toast notifications */}

      {loading && <LoadingScreen />} {/* Show loading screen if placing order */}

      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-semibold text-center mb-6">Bulk Order Page</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Product and Quantity Selection */}
          <div className="flex-1 bg-white p-4 rounded shadow">
            <h3 className="text-xl font-semibold mb-4">Select Product and Quantity</h3>
            <div className="mb-4">
              <label className="block text-gray-700">Select Product</label>
              <select
                value={selectedProduct}
                onChange={handleProductChange}
                className="w-full border p-2 rounded"
              >
                <option value="">-- Select Product --</option>
                {products.map((product) => (
                  <option key={product.product_id} value={product.product_id}>
                    {product.name} - ₹{product.price}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Quantity (min 10)</label>
              <input
                type="number"
                min="10"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-full border p-2 rounded"
              />
            </div>
            {selectedProduct && (
              <div className="mb-4">
                <p className="text-xl font-semibold">
                  Total Cost: ₹{totalCost}
                </p>
              </div>
            )}
          </div>

          {/* Delivery Details */}
          <div className="flex-1 bg-white p-4 rounded shadow">
            <h3 className="text-xl font-semibold mb-4">Delivery Details</h3>
            <input
              type="text"
              name="delivery_name"
              value={deliveryDetails.delivery_name}
              onChange={handleDeliveryDetailsChange}
              placeholder="Delivery Name"
              className="border p-2 w-full mb-4"
            />
            <input
              type="text"
              name="contact_info"
              value={deliveryDetails.contact_info}
              onChange={handleDeliveryDetailsChange}
              placeholder="Contact Info"
              className="border p-2 w-full mb-4"
            />
            <textarea
              name="address"
              value={deliveryDetails.address}
              onChange={handleDeliveryDetailsChange}
              placeholder="Delivery Address"
              className="border p-2 w-full mb-4"
            />
            <button
              onClick={handlePlaceOrder}
              className="bg-blue-600 text-white py-2 px-4 rounded mt-2 hover:bg-blue-700 w-full"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BulkOrderPage;
