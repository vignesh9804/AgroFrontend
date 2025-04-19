// AdminSingleProduct.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { Trash2, Pencil } from 'lucide-react'; // icons

const AdminSingleProduct = ({ product }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/admin/edit/products/${product.product_id}`);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `https://agrobackend-sptw.onrender.com/api/admin/products/${product.product_id}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('Jwt_Token')}`,
          },
        }
      );
      toast.success(response.data.message || 'Product deleted successfully');
      window.location.reload(); // or use a prop function to refresh list
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message === 'Order exists with this product'
      ) {
        toast.error('Cannot delete: Order exists with this product');
      } else {
        toast.error('Failed to delete product');
      }
    }
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
      <div className="flex gap-2 mt-4">
        <button
          onClick={handleEdit}
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md flex-1 flex items-center justify-center gap-1"
        >
          <Pencil size={16} />
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md flex-1 flex items-center justify-center gap-1"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
};

export default AdminSingleProduct;
