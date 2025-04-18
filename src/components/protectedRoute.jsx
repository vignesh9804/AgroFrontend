// src/components/ProtectedRoute.js
import React from 'react';
import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = (Component) => {
  const Wrapper = (props) => {
    const token = Cookies.get('Jwt_Token');
    const userId = Cookies.get('userId');

    if (!token || userId!=="buyer") {
      return <Navigate to="/login" replace />;
    }

    return <Component {...props} />;
  };

  return Wrapper;
};

export default ProtectedRoute;
