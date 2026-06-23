// src/components/HostelNavbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';


const HostelNavbar = () => {
    const bookedRooms = useSelector((state) => state.bookings);

  return (
    <nav className="bg-gray-800 p-4 fixed w-full mb-4 top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <Link to="/" className="text-white hover:bg-gray-900 px-3 py-2 rounded">
            Home
          </Link>
          <Link to="/hostel-booking" className="text-white hover:bg-gray-900 px-3 py-2 rounded">
            Hostels
          </Link>
          <Link to="/booked-room" className="text-white hover:bg-gray-900 px-3 py-2 rounded">
           <p className='relative'>Booking
            {bookedRooms.length > 0 && (
                <p className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full">*</p>
              )}
              </p> 
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default HostelNavbar;
