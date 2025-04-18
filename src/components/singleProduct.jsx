import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SingleProduct = ({ product }) => {
  const handleAddToCart = async () => {
    const token = Cookies.get('Jwt_Token');
    const userId = Cookies.get('userId');

    if (!token || !userId) {
      toast.error('You must be logged in');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5001/api/addtocart',
        {
          user_id: userId,
          product_id: product.product_id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(`${product.name} added to cart ✅`);
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error('Failed to add to cart ❌');
    }
  };

  return (
    <div className="bg-white p-4 shadow-md rounded-lg">
      <img
        src={product.image_url}
        alt={product.name}
        className="w-full h-48 object-cover rounded-md"
      />
      <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
      <p className="text-gray-700 mt-1">₹{product.price}</p>
      <button
        onClick={handleAddToCart}
        className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md w-full"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default SingleProduct;
