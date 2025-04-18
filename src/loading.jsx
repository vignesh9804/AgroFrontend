// components/LoadingScreen.js
import React from 'react';
import { ClipLoader } from 'react-spinners';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-75 z-50 flex items-center justify-center">
      <ClipLoader size={60} color="#2563eb" />
    </div>
  );
};

export default LoadingScreen;
