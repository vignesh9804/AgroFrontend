import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-white">
      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-green-700 mb-4">
          Welcome to FreshBasket
        </h1>
        <p className="text-gray-700 text-lg md:text-xl max-w-2xl mx-auto">
          Manage your products, handle bulk orders, and ensure timely delivery—all from one powerful dashboard.
        </p>
        <Link to="/products">
          <button className="mt-8 px-6 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition">
            Get Started
          </button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="px-6 md:px-16 py-10">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-bold text-green-700 mb-2">Add Products</h2>
            <p className="text-gray-600">
              Quickly add new fruits and vegetables with images, prices, and categories.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-bold text-green-700 mb-2">Manage Orders</h2>
            <p className="text-gray-600">
              Track all incoming orders, edit status, and ensure smooth delivery.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-bold text-green-700 mb-2">Bulk Requests</h2>
            <p className="text-gray-600">
              Handle large quantity orders with ease, view and edit as needed.
            </p>
          </div>
        </div>
      </section>

      {/* Footer Call-to-Action */}
      <footer className="text-center py-10 bg-green-50">
        <p className="text-gray-700 mb-4">Need to Order Products?</p>
        <Link to="/products">
          <button className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition">
            Go to Products 
          </button>
        </Link>
      </footer>
    </div>
  );
};

export default Home;
