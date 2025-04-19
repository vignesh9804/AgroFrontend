// EditProductPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast,ToastContainer } from 'react-toastify';
import ClipLoader from 'react-spinners/ClipLoader';
import 'react-toastify/dist/ReactToastify.css';

const EditProductPage = () => {
  const { id } = useParams();
  const token = Cookies.get('Jwt_Token');
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    price: '',
    image_url: '',
    product_type: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch product details by ID

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://agrobackendrender.onrender.com/api/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        setForm({
          name: data.name,
          price: data.price,
          image_url: data.image_url,
          product_type: data.product_type,
        });
      } catch (err) {
        console.error('Error fetching product:', err);
        toast.error('Failed to load product details');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchProduct();
  }, [id, token]); // include token for safety
  

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSave = async () => {
    try {
      await axios.put(
        `https://agrobackendrender.onrender.com/api/admin/products/${id}`,
        {
          name: form.name,
          price: parseFloat(form.price),
          image_url: form.image_url,
          product_type: form.product_type,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      toast.success('Product updated successfully ✅');
      navigate('/admin/products');
    } catch (err) {
      console.error('Update error:', err);
      toast.error('Failed to update product ❌');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader color="#4F46E5" size={50} />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>

      <label className="block mb-2 font-medium">Name</label>
      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />

      <label className="block mb-2 font-medium">Price</label>
      <input
        type="number"
        name="price"
        value={form.price}
        onChange={handleChange}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />

      <label className="block mb-2 font-medium">Image URL</label>
      <input
        type="text"
        name="image_url"
        value={form.image_url}
        onChange={handleChange}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />

      <label className="block mb-2 font-medium">Product Type</label>
      <select
        name="product_type"
        value={form.product_type}
        onChange={handleChange}
        className="w-full p-2 mb-6 border border-gray-300 rounded"
      >
        <option value="">-- Select Type --</option>
        <option value="fruits">Fruits</option>
        <option value="vegetables">Vegetables</option>
      </select>

      <button
        onClick={handleSave}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
      >
        Save Changes
      </button>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
    </div>
  );
};

export default EditProductPage;
