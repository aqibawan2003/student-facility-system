// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { removeOrder } from '..//store/orderSlice';
// import { removeBooking } from '../store/bookingsSlice';
// // import { updateProfile, logoutUser } from '../features/auth/authSlice'; // Assuming these actions exist for profile update and logout

// const StudentProfile = () => {
//   const dispatch = useDispatch();
// //   const { user } = useSelector((state) => state.auth); // Fetch the logged-in user's information
//   const foodOrders = useSelector((state) => state.orders); // Fetch food orders from Redux
//   const bedBookings = useSelector((state) => state.bookings); // Fetch bed bookings from Redux

//   const [showFoodDetails, setShowFoodDetails] = useState(null);
//   const [showBookingDetails, setShowBookingDetails] = useState(null);
//   const [editMode, setEditMode] = useState(false); // Toggle for edit mode
// //   const [profileData, setProfileData] = useState({
// //     email: user.email,
// //     profilePicture: user.profilePicture,
// //     name: user.name,
// //   });

//   // Handle input change in profile edit form
// //   const handleInputChange = (e) => {
// //     setProfileData({ ...profileData, [e.target.name]: e.target.value });
// //   };

//   // Handle profile update form submission
// //   const handleProfileUpdate = (e) => {
// //     e.preventDefault();
// //     dispatch(updateProfile(profileData)); // Dispatch action to update profile
// //     setEditMode(false);
// //   };

// //   // Handle logout
// //   const handleLogout = () => {
// //     dispatch(logoutUser()); // Dispatch action to log out
// //   };

// //   // Handle delete for food orders
// //   const handleDeleteOrder = (orderId) => {
// //     dispatch(removeOrder(orderId));
// //   };

// //   // Handle delete for bed bookings
// //   const handleDeleteBooking = (bookingId) => {
// //     dispatch(removeBooking(bookingId));
// //   };

//   return (
//     // <div className="p-4 bg-gray-100">
//     //   <h1 className="text-xl font-semibold">Your Profile</h1>

//     //   {/* Profile Information Section */}
//     //   <div className="mt-6 p-4 bg-white rounded shadow">
//     //     <h2 className="text-lg font-medium">Profile Information</h2>
//     //     {editMode ? (
//     //       <form onSubmit={handleProfileUpdate} className="space-y-4">
//     //         <div>
//     //           <label className="block font-medium">Profile Picture URL</label>
//     //           <input
//     //             type="text"
//     //             name="profilePicture"
//     //             value={profileData.profilePicture}
//     //             onChange={handleInputChange}
//     //             className="w-full p-2 border rounded"
//     //           />
//     //         </div>
//     //         <div>
//     //           <label className="block font-medium">Name</label>
//     //           <input
//     //             type="text"
//     //             name="name"
//     //             value={profileData.name}
//     //             onChange={handleInputChange}
//     //             className="w-full p-2 border rounded"
//     //           />
//     //         </div>
//     //         <div>
//     //           <label className="block font-medium">Email</label>
//     //           <input
//     //             type="email"
//     //             name="email"
//     //             value={profileData.email}
//     //             onChange={handleInputChange}
//     //             className="w-full p-2 border rounded"
//     //           />
//     //         </div>
//     //         <button
//     //           type="submit"
//     //           className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//     //         >
//     //           Save Changes
//     //         </button>
//     //         <button
//     //           type="button"
//     //           onClick={() => setEditMode(false)}
//     //           className="ml-4 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
//     //         >
//     //           Cancel
//     //         </button>
//     //       </form>
//     //     ) : (
//     //       <div className="flex items-center justify-between">
//     //         <div>
//     //           <img
//     //             src={profileData.profilePicture}
//     //             alt="Profile"
//     //             className="w-16 h-16 rounded-full"
//     //           />
//     //           <p>Name: {profileData.name}</p>
//     //           <p>Email: {profileData.email}</p>
//     //         </div>
//     //         <button
//     //           onClick={() => setEditMode(true)}
//     //           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//     //         >
//     //           Edit Profile
//     //         </button>
//     //       </div>
//     //     )}

//     //     {/* Logout Button */}
//     //     <button
//     //       onClick={handleLogout}
//     //       className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//     //     >
//     //       Logout
//     //     </button>
//     //   </div>

//     //   {/* Food Orders Section */}
//     //   <div className="mt-6">
//     //     <h2 className="text-lg font-medium">Food Order History</h2>
//     //     {foodOrders.length > 0 ? (
//     //       <ul className="space-y-4">
//     //         {foodOrders.map((order) => (
//     //           <li key={order.id} className="p-4 bg-white rounded shadow">
//     //             <div className="flex justify-between items-center">
//     //               <div>
//     //                 <p>Order ID: {order.id}</p>
//     //                 <p>Date: {new Date(order.date).toLocaleDateString()}</p>
//     //                 <p>Total: ${order.total}</p>
//     //               </div>
//     //               <div>
//     //                 <button
//     //                   onClick={() => setShowFoodDetails(order.id)}
//     //                   className="text-blue-500 hover:underline"
//     //                 >
//     //                   View Details
//     //                 </button>
//     //                 <button
//     //                   onClick={() => handleDeleteOrder(order.id)}
//     //                   className="ml-4 text-red-500 hover:underline"
//     //                 >
//     //                   Delete
//     //                 </button>
//     //               </div>
//     //             </div>

//     //             {showFoodDetails === order.id && (
//     //               <div className="mt-4 bg-gray-50 p-4 rounded">
//     //                 <h3 className="font-semibold">Food Order Details</h3>
//     //                 {order.items.map((item, index) => (
//     //                   <div key={index} className="flex justify-between">
//     //                     <p>{item.name}</p>
//     //                     <p>${item.price}</p>
//     //                   </div>
//     //                 ))}
//     //               </div>
//     //             )}
//     //           </li>
//     //         ))}
//     //       </ul>
//     //     ) : (
//     //       <p>No food orders found.</p>
//     //     )}
//     //   </div>

//     //   {/* Bed Booking Section */}
//     //   <div className="mt-6">
//     //     <h2 className="text-lg font-medium">Bed Booking History</h2>
//     //     {bedBookings.length > 0 ? (
//     //       <ul className="space-y-4">
//     //         {bedBookings.map((booking) => (
//     //           <li key={booking.id} className="p-4 bg-white rounded shadow">
//     //             <div className="flex justify-between items-center">
//     //               <div>
//     //                 <p>Booking ID: {booking.id}</p>
//     //                 <p>Room: {booking.roomName}</p>
//     //                 <p>Bed Number: {booking.bedNumber}</p>
//     //                 <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
//     //               </div>
//     //               <div>
//     //                 <button
//     //                   onClick={() => setShowBookingDetails(booking.id)}
//     //                   className="text-blue-500 hover:underline"
//     //                 >
//     //                   View Details
//     //                 </button>
//     //                 <button
//     //                   onClick={() => handleDeleteBooking(booking.id)}
//     //                   className="ml-4 text-red-500 hover:underline"
//     //                 >
//     //                   Delete
//     //                 </button>
//     //               </div>
//     //             </div>

//     //             {showBookingDetails === booking.id && (
//     //               <div className="mt-4 bg-gray-50 p-4 rounded">
//     //                 <h3 className="font-semibold">Booking Details</h3>
//     //                 <p>Room Name: {booking.roomName}</p>
//     //                 <p>Bed Number: {booking.bedNumber}</p>
//     //                 <p>Price: ${booking.price}</p>
//     //                 <p>Check-In Date: {new Date(booking.checkInDate).toLocaleDateString()}</p>
//     //                 <p>Check-Out Date: {new Date(booking.checkOutDate).toLocaleDateString()}</p>
//     //               </div>
//     //             )}
//     //           </li>
//     //         ))}
//     //       </ul>
//     //     ) : (
//     //       <p>No bed bookings found.</p>
//     //     )}
//     //   </div>
//     // </div>
      
//     <div className="p-4 bg-gray-100">
//       <h1 className="text-xl font-semibold">Your Profile</h1>

//        {/* Profile Information Section */}
//        <div className="mt-6 p-4 bg-white rounded shadow">
//          <h2 className="text-lg font-medium">Profile Information</h2>
//          {editMode ? (
//            <form onSubmit={handleProfileUpdate} className="space-y-4">
//              <div>
//                <label className="block font-medium">Profile Picture URL</label>
//                <input
//                  type="text"
//              name="profilePicture"
//                 value={profileData.profilePicture}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded"
//               />
//             </div>
//             <div>
//               <label className="block font-medium">Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={profileData.name}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded"
//               />
//             </div>
//             <div>
//               <label className="block font-medium">Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={profileData.email}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded"
//               />
//             </div>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//             >
//               Save Changes
//             </button>
//             <button
//               type="button"
//               onClick={() => setEditMode(false)}
//               className="ml-4 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
//             >
//               Cancel
//             </button>
//           </form>
//         ) : (
//           <div className="flex items-center justify-between">
//             <div>
//               <img
//                 src={profileData.profilePicture}
//                 alt="Profile"
//                 className="w-16 h-16 rounded-full"
//               />
//               <p>Name: {profileData.name}</p>
//               <p>Email: {profileData.email}</p>
//             </div>
//             <button
//               onClick={() => setEditMode(true)}
//               className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//             >
//               Edit Profile
//             </button>
//           </div>
//         )}

//         {/* Logout Button */}
//         <button
//           onClick={handleLogout}
//           className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//         >
//           Logout
//         </button>
//       </div>

//       {/* Food Orders Section */}
//       <div className="mt-6">
//         <h2 className="text-lg font-medium">Food Order History</h2>
//         {foodOrders.length > 0 ? (
//           <ul className="space-y-4">
//             {foodOrders.map((order) => (
//               <li key={order.id} className="p-4 bg-white rounded shadow">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <p>Order ID: {order.id}</p>
//                     <p>Date: {new Date(order.date).toLocaleDateString()}</p>
//                     <p>Total: PKR {order.total}</p>
//                   </div>
//                   <div>
//                     <button
//                       onClick={() => setShowFoodDetails(order.id)}
//                       className="text-blue-500 hover:underline"
//                     >
//                       View Details
//                     </button>
//                     <button
//                       onClick={() => handleDeleteOrder(order.id)}
//                       className="ml-4 text-red-500 hover:underline"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </div>

//                 {showFoodDetails === order.id && (
//                   <div className="mt-4 bg-gray-50 p-4 rounded">
//                     <h3 className="font-semibold">Food Order Details</h3>
//                     {order.items.map((item, index) => (
//                       <div key={index} className="flex justify-between">
//                         <p>{item.name}</p>
//                         <p>${item.price}</p>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No food orders found.</p>
//         )}
//       </div>

//       {/* Bed Booking Section */}
//       <div className="mt-6">
//         <h2 className="text-lg font-medium">Bed Booking History</h2>
//         {bedBookings.length > 0 ? (
//           <ul className="space-y-4">
//             {bedBookings.map((booking) => (
//               <li key={booking.id} className="p-4 bg-white rounded shadow">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <p>Booking ID: {booking.id}</p>
//                     <p>Room: {booking.roomName}</p>
//                     <p>Bed Number: {booking.bedNumber}</p>
//                     <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
//                   </div>
//                   <div>
//                     <button
//                       onClick={() => setShowBookingDetails(booking.id)}
//                       className="text-blue-500 hover:underline"
//                     >
//                       View Details
//                     </button>
//                     <button
//                       onClick={() => handleDeleteBooking(booking.id)}
//                       className="ml-4 text-red-500 hover:underline"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </div>

//                 {showBookingDetails === booking.id && (
//                   <div className="mt-4 bg-gray-50 p-4 rounded">
//                     <h3 className="font-semibold">Booking Details</h3>
//                     <p>Room Name: {booking.roomName}</p>
//                     <p>Bed Number: {booking.bedNumber}</p>
//                     <p>Price: PKR {booking.price}</p>
//                     <p>Check-In Date: {new Date(booking.checkInDate).toLocaleDateString()}</p>
//                     <p>Check-Out Date: {new Date(booking.checkOutDate).toLocaleDateString()}</p>
//                   </div>
//                 )}
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No bed bookings found.</p>
//         )}
//       </div>
//     </div>





//   );
// };

// export default StudentProfile;



import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeOrder } from '../store/orderSlice';
// import { removeBooking } from '../store/bookingsSlice';
// import { updateProfile, logoutUser } from '../features/auth/authSlice'; // Uncomment this if needed

const StudentProfile = () => {
  const dispatch = useDispatch();
  const foodOrders = useSelector((state) => state.orders); // Fetch food orders
  const bedBookings = useSelector((state) => state.bookings); // Fetch bed bookings

  const [showFoodDetails, setShowFoodDetails] = useState(null);
  const [showBookingDetails, setShowBookingDetails] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Sample profile data - replace with real user data
  const [profileData, setProfileData] = useState({
    email: "john.doe@example.com",
    profilePicture: "https://example.com/profile.jpg",
    name: "John Doe",
  });

  // Handle input change in profile edit form
  const handleInputChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  // Handle profile update form submission
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // dispatch(updateProfile(profileData)); // Dispatch action to update profile
    setEditMode(false);
  };

  // Handle logout
  const handleLogout = () => {
    // dispatch(logoutUser()); // Dispatch action to log out
  };

  // Handle delete for food orders
  const handleDeleteOrder = (orderId) => {
    // dispatch(removeOrder(orderId));
  };

  // Handle delete for bed bookings
  const handleDeleteBooking = (bookingId) => {
    // dispatch(removeBooking(bookingId));
  };

  return (
    <div className="p-4 bg-gray-100">
      <h1 className="text-xl font-semibold">Your Profile</h1>

      {/* Profile Information Section */}
      <div className="mt-6 p-4 bg-white rounded shadow">
        <h2 className="text-lg font-medium">Profile Information</h2>
        {editMode ? (
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block font-medium">Profile Picture URL</label>
              <input
                type="text"
                name="profilePicture"
                value={profileData.profilePicture}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="ml-4 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <img
                src={profileData.profilePicture}
                alt="Profile"
                className="w-16 h-16 rounded-full"
              />
              <p>Name: {profileData.name}</p>
              <p>Email: {profileData.email}</p>
            </div>
            <button
              onClick={() => setEditMode(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Edit Profile
            </button>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Food Orders Section */}
      <div className="mt-6">
        <h2 className="text-lg font-medium">Food Order History</h2>
        {foodOrders.length > 0 ? (
          <ul className="space-y-4">
            {foodOrders.map((order) => (
              <li key={order.id} className="p-4 bg-white rounded shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <p>Order ID: {order.id}</p>
                    <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                    <p>Total: PKR {order.total}</p>
                  </div>
                  <div>
                    <button
                      onClick={() => setShowFoodDetails(order.id)}
                      className="text-blue-500 hover:underline"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      className="ml-4 text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {showFoodDetails === order.id && (
                  <div className="mt-4 bg-gray-50 p-4 rounded">
                    <h3 className="font-semibold">Food Order Details</h3>
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <p>{item.name}</p>
                        <p>PKR {item.price}</p>
                      </div>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No food orders found.</p>
        )}
      </div>

      {/* Bed Booking Section */}
      <div className="mt-6">
        <h2 className="text-lg font-medium">Bed Booking History</h2>
        {bedBookings.length > 0 ? (
          <ul className="space-y-4">
            {bedBookings.map((booking) => (
              <li key={booking.id} className="p-4 bg-white rounded shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <p>Booking ID: {booking.id}</p>
                    <p>Room: {booking.roomName}</p>
                    <p>Bed Number: {booking.bedNumber}</p>
                    <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <button
                      onClick={() => setShowBookingDetails(booking.id)}
                      className="text-blue-500 hover:underline"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleDeleteBooking(booking.id)}
                      className="ml-4 text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {showBookingDetails === booking.id && (
                  <div className="mt-4 bg-gray-50 p-4 rounded">
                    <h3 className="font-semibold">Booking Details</h3>
                    <p>Room Name: {booking.roomName}</p>
                    <p>Bed Number: {booking.bedNumber}</p>
                    <p>Price: PKR {booking.price}</p>
                    <p>Check-In Date: {new Date(booking.checkInDate).toLocaleDateString()}</p>
                    <p>Check-Out Date: {new Date(booking.checkOutDate).toLocaleDateString()}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No bed bookings found.</p>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;
