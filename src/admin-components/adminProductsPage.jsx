import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import ClipLoader from 'react-spinners/ClipLoader';
import AdminSingleProduct from './adminSingleProduct';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:5001/api/products',{
          headers: {
            Authorization: `Bearer ${Cookies.get('Jwt_Token')}`,
          },
        });
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filtering and sorting logic
  useEffect(() => {
    let updatedProducts = [...products];

    if (searchTerm) {
      updatedProducts = updatedProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (category) {
      updatedProducts = updatedProducts.filter(product => product.product_type === category);
    }

    if (sortOrder === 'low-to-high') {
      updatedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'high-to-low') {
      updatedProducts.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(updatedProducts);
  }, [searchTerm, category, sortOrder, products]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Admin - All Products</h2>

      {/* Search + Filter + Sort */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full md:w-1/3"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full md:w-1/4"
        >
          <option value="">All Categories</option>
          <option value="fruits">Fruit</option>
          <option value="vegetables">Vegetable</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full md:w-1/4"
        >
          <option value="">Sort by Price</option>
          <option value="low-to-high">Low to High</option>
          <option value="high-to-low">High to Low</option>
        </select>
      </div>

      {/* Product Listing */}
      {isLoading ? (
        <div className="flex justify-center mt-20">
          <ClipLoader color="#4F46E5" size={50} />
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <AdminSingleProduct key={product.product_id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No products found</p>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AdminProductsPage;
