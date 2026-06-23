// src/components/FoodNavbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const FoodNavbar = () => {
  const cartItems = useSelector(state => state.cart);

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white mr-4">Home</Link>
        <Link to="/kitchens" className="text-white mr-4">Kitchens</Link>
        <div className="relative">
          <Link to="/cart" className="text-white">
            Cart
          </Link>
          
            <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full w-4 h-4 flex items-center justify-center">
              <span className="text-white text-xs">{cartItems.length}</span>
            </div>
        
        </div>
      </div>
    </nav>
  );
};

export default FoodNavbar;
