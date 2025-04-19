import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const token = Cookies.get('Jwt_Token');
  const userRole = Cookies.get('userRole');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    Cookies.remove('Jwt_Token');
    Cookies.remove('userRole');
    Cookies.remove('userId');
    navigate('/login');
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const commonLinks = (
    <Link to="/" className="hover:text-green-800 font-medium">Home</Link>
  );

  const adminLinks = (
    <>
      <Link to="/admin/products" className="hover:text-green-800">Products</Link>
      <Link to="/admin/add-new-product" className="hover:text-green-800">Add New Product</Link>
      <Link to="/admin/orders" className="hover:text-green-800">Orders</Link>
      <Link to="/admin/bulk-orders" className="hover:text-green-800">Bulk Orders</Link>
    </>
  );

  const buyerLinks = (
    <>
      <Link to="/products" className="hover:text-green-800">Products</Link>
      <Link to="/cart" className="hover:text-green-800">Cart</Link>
      <Link to="/user/bulkorder" className="hover:text-green-800">Bulk Orders</Link>
      <Link to="/my-orders" className="hover:text-green-800">My Orders</Link>
    </>
  );

  const authButton = token ? (
    <button
      onClick={handleLogout}
      className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
    >
      Logout
    </button>
  ) : (
    <Link
      to="/login"
      className="bg-green-600 px-3 py-1 rounded hover:bg-green-700 transition text-white"
    >
      Login
    </Link>
  );

  return (
    <nav className="bg-gradient-to-r from-green-100 to-green-200 text-green-900 px-4 py-3 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-700">FreshBasket</h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          {commonLinks}
          {userRole === 'admin' && adminLinks}
          {userRole === 'buyer' && buyerLinks}
          {authButton}
        </div>

        {/* Mobile Toggle Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col space-y-3 mt-3 px-4 pb-4 text-green-800 font-medium">
          {commonLinks}
          {userRole === 'admin' && adminLinks}
          {userRole === 'buyer' && buyerLinks}
          {authButton}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
