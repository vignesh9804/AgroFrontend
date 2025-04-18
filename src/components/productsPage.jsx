import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import SingleProduct from './singleProduct';
import FilterBar from './FilterBar';
import LoadingScreen from '../loading';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('Jwt_Token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:5001/api/products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [navigate]);

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((product) =>
      category ? product.product_type === category : true
    )
    .sort((a, b) => {
      if (sort === 'low') return parseFloat(a.price) - parseFloat(b.price);
      if (sort === 'high') return parseFloat(b.price) - parseFloat(a.price);
      return 0;
    });

  return (
    <>
      {isLoading && <LoadingScreen />}
      <ToastContainer />
      <div className="p-4 bg-gray-100 min-h-screen">
        <h2 className="text-3xl font-bold mb-6 text-center">Products</h2>
        <FilterBar
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          sort={sort}
          setSort={setSort}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
          {filteredProducts.map((product) => (
            <SingleProduct
              key={product.product_id}
              product={product}
              showToast={() => toast.success(`${product.name} added to cart ✅`)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductsPage;
