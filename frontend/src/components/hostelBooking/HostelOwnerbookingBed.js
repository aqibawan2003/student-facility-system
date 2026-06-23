import React, { useEffect } from 'react';
import HostelNavbar from "./HostelOwnerNavbar";
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookings } from '../../store/bookingsSlice'; // Import fetchBookings action
import { removeRoomFromHistory } from '../../store/bookingsSlice'; // Assuming you have this action for removing booking history

const HostelOwnerBookingBed = () => {
  const dispatch = useDispatch();
  
  // Fetch the bookings state from Redux
  const { bookings, loading, error } = useSelector(state => state.bookings);
  console.log('bookings of hostelowner:', bookings);

  useEffect(() => {
    // Dispatch fetchBookings when the component mounts or is revisited
    dispatch(fetchBookings());
  }, [dispatch]);

  const handleRemove = (bookingId) => {
    // Dispatch removeRoomFromHistory to remove a booking
    dispatch(removeRoomFromHistory(bookingId));
  };

  return (
    <div className="bg-[#1E201E] min-h-screen">
      <HostelNavbar />

      <div className="p-8 ml-[180px]">
        <h1 className="text-3xl text-white font-bold mb-6">Booked Beds</h1>

        {loading ? (
          <p className="text-white">Loading bookings...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {Object.values(bookings).map((booking) => (
              <div key={booking.bookingId} className="bg-gray-800 p-6 flex gap-1 rounded-lg shadow-md border border-gray-600">
                <h3 className="text-xl text-yellow-400 font-bold mb-4">{booking.studentName}</h3>

                <div className="text-white space-y-2 gap-4 ml-8 flex">
                  <p><span className="font-semibold flex flex-col pt-2 text-gray-400">Booking ID:</span> {booking.bookingId}</p>
                  <p><span className="font-semibold flex flex-col text-gray-400">CNIC:</span> {booking.cnic}</p>
                  <p><span className="font-semibold flex flex-col text-gray-400">Email:</span> {booking.email}</p>
                  <p><span className="font-semibold flex flex-col text-gray-400">Phone Number:</span> {booking.phoneNumber}</p>
                  <p><span className="font-semibold flex flex-col text-gray-400">Room Number:</span> {booking.roomNumber}</p>
                  <p><span className="font-semibold flex flex-col text-gray-400">Bed Number:</span> {booking.bedNumber}</p>
                  <p>
                    <span className="font-semibold flex flex-col text-gray-400">Payment Status:</span>
                    <span className={booking.paymentStatus === 'Paid' ? 'text-green-500' : 'text-red-500'}>
                      {booking.paymentStatus}
                    </span>
                  </p>
                </div>

                <button
                  className="px-6 py-2 ml-10 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
                  onClick={() => handleRemove(booking.bookingId)}
                >
                  Remove from History
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HostelOwnerBookingBed;
