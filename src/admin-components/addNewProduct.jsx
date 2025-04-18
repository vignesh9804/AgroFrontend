import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Don't forget to import the CSS for Toastify

const AddNewProduct = () => {
  const [form, setForm] = useState({
    name: '',
    price: '',
    image_url: '',
    product_type: '',
  });

  const navigate = useNavigate();
  const token = Cookies.get('Jwt_Token');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = async () => {
    const { name, price, image_url, product_type } = form;

    if (!name || !price || !image_url || !product_type) {
      toast.error('Please fill all fields ❌');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5001/api/admin/products',
        {
          name,
          price: parseFloat(price),
          image_url,
          product_type,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      toast.success('Product added successfully ✅');
      navigate('/admin/products');
    } catch (err) {
      console.error('Error adding product:', err);
      toast.error('Failed to add product ❌');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>

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
        onClick={handleAddProduct}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
      >
        Add Product
      </button>

      {/* Add ToastContainer to render toast notifications */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
    </div>
  );
};

export default AddNewProduct;
