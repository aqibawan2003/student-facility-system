import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBookedRooms } from '../../store/bookingsSlice';
import Navbar from '../Navbar';
import Footer from '../Footer';

const BookedRoom = () => {
  const dispatch = useDispatch();
  const { bookedRooms, status, error } = useSelector((state) => state.bookings);
  console.log('Booked rooms:', bookedRooms);

  useEffect(() => {
      dispatch(fetchBookedRooms());
  }, [dispatch]);

  const handleRemove = async (bookingId) => {
    // Implement the logic to remove a booking
    console.log('Remove booking:', bookingId);
  };
  
  if (status === 'loading') return <p>Loading...</p>;
  // if (status === 'failed') return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col min-h-screen bg-[#1E201E]">
      <Navbar module="hostel" />

      <div className="flex-grow p-4 md:p-8 ml-0 md:ml-[120px]">
        <h1 className="text-3xl text-white font-bold mb-6">Booked Beds</h1>
        {bookedRooms.length === 0 ? (
          <div className="text-white text-center mt-20">
            <p className="text-lg">No beds booked yet.</p>
            <p className="text-gray-400">Start booking your stay at our hostels!</p>
          </div>
        ) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookedRooms.map((booking) => (
            <div key={booking.bookingId} className="bg-gray-800 p-6 flex flex-col justify-center gap-4 rounded-lg shadow-md border border-gray-600">
              <h3 className="text-xl text-yellow-400 font-bold">{booking.hostelName}</h3>

              <div className="text-white space-y-2 text-center">
                <p>
                  <span className="font-semibold text-gray-400">Booking ID:</span> {booking.bookingId}
                </p>
                <p>
                  <span className="font-semibold text-gray-400">Hostel Address:</span> {booking.hostelAddress}
                </p>
                <p>
                  <span className="font-semibold text-gray-400">Room No.</span> {booking.roomName}
                </p>
                <p>
                  <span className="font-semibold text-gray-400">Booking Date:</span> {new Date(booking.bookingDate).toLocaleDateString()}
                </p>

                <ul className="list-none space-y-2">
                  {booking.beds.map((bed) => (
                    <li key={bed._id} className="flex gap-4 justify-center">
                      <p>
                        <span className="font-semibold text-gray-400">Bed Number:</span> {bed.bed_number}
                      </p>
                      <p>
                        <span className="font-semibold text-gray-400">Payment Status: </span>
                        <span className={bed.paymentStatus === 'paid' ? 'text-green-500' : 'text-red-500'}>
                          {bed.paymentStatus.toUpperCase()}
                        </span>
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition mx-auto"
                onClick={() => handleRemove(booking.bookingId)}
              >
                Remove from History
              </button>
            </div>
          ))}
        </div>) }


      </div>

      <Footer />
    </div>
  );
};

export default BookedRoom;
