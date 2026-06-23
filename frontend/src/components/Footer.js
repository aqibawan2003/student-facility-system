// Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import Mission from './Mission';
const Footer = () => {
  return (
    <footer className="bg-[#1E201E] border-t border-gray-600 pt-12 text-white py-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-5">
        {/* Logo and Brand Section */}
        <div className="flex flex-col items-start">
          <h2 className="text-2xl font-bold mb-4">Student Facility System</h2>
          <p className="text-sm">
            Making your experience better every day.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:font-bold">Home</a></li>
            <li><Link to="/AboutUs" className="hover:font-bold">About Us</Link></li>
            <li><a href="#" className="hover:font-bold">Services</a></li>
            <li><Link to="/ContactUs" className="hover:font-bold">Contact Us</Link></li>
          </ul>
        </div>

        {/* Contact and Social Media */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
          <p className="text-sm">Kabeer Street Urdu Bazar ,Lahore , Pakistan</p>
          <p className="text-sm">Email: amumarijaz@gmail.com</p>
          <p className="text-sm">Phone: +923040005863</p>
          <div className="flex space-x-4 mt-4">
            {/* Social Media Icons */}
            <a href="#" className="text-white hover:text-blue-500">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="text-white hover:text-blue-500">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-white hover:text-blue-500">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="#" className="text-white hover:text-blue-500">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center mt-8 border-t border-gray-700 pt-4">
        <p className="text-sm">&copy; {new Date().getFullYear()} Brand Name. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
