import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';


const AdminHome = () => {
  const navigate = useNavigate();

  // Check if the user is logged in as an admin or buyer
  useEffect(() => {
    const token = Cookies.get('Jwt_Token'); // Correct cookie name
    const userRole = Cookies.get('userRole'); // Get the userRole from cookies

    if (!token) {
      // If no token, redirect to login
      navigate('/login');
      return;
    }

    // If userRole is 'buyer', redirect to "No Access"
    if (userRole === 'buyer') {
      navigate('/no-access'); // Navigate to a "No Access" page
      return; // Prevent further execution
    }

    // Optionally, handle cases where the role is not 'admin'
    if (userRole !== 'admin') {
      navigate('/login'); // Ensure that only admins have access to this page
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Admin Home</h2>
        <p className="text-lg text-center">Welcome to the Admin Dashboard</p>
      </div>
    </div>
  );
};

export default AdminHome;
