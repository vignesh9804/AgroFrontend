// AdminSingleProduct.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminSingleProduct = ({ product }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/admin/edit/products/${product.product_id}`);
  };

  return (
    <div className="bg-white p-4 shadow-md rounded-lg flex flex-col">
      <img
        src={product.image_url}
        alt={product.name}
        className="w-full h-48 object-cover rounded-md"
      />
      <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
      <p className="text-gray-700 mt-1">₹{product.price}</p>
      <p className="text-sm text-gray-500 capitalize">
        Category: {product.product_type}
      </p>
      <button
        onClick={handleEdit}
        className="mt-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md w-full"
      >
        Edit
      </button>
    </div>
  );
};

export default AdminSingleProduct;
