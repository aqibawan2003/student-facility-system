import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import Navbar from "../Navbar";
import { bookRoom } from "../../store/bookingsSlice";
import CheckoutModal from "./Checkout";
import Footer from "../Footer";

const RoomDetail = () => {
  const [selectedBed, setSelectedBed] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [roomData, setRoomData] = useState(useLocation().state.room); // Store room data in state
  const { hostelId } = useLocation().state; // Accessing room data passed from HostelDetail
  const dispatch = useDispatch();

  const handleBookBedClick = (bed) => {
    console.log("bed roomdetail", bed);
    setSelectedBed(bed);
    setIsCheckoutOpen(true); // Open the checkout modal
  };

  const handleCheckoutSuccess = async (paymentData) => {
    // After successful payment, update the bed status to booked
    const updatedBed = {
      ...selectedBed,
      isBooked: true,
      paymentStatus: "completed",
    };

    // Dispatch the booking action to update the Redux store
    await dispatch(
      bookRoom({ hostelId, roomId: roomData._id, bed: updatedBed, paymentData })
    );

    // Update the local room state to reflect the change immediately
    setRoomData((prevRoom) => ({
      ...prevRoom,
      beds: prevRoom.beds.map((bed) =>
        bed.bed_number === updatedBed.bed_number ? updatedBed : bed
      ),
    }));

    setIsCheckoutOpen(false); // Close the modal
  };

  return (
    <>
      <Navbar module="hostel" />
      <div className="bg-[#697565] w-full h-full border-b border-gray-500 pb-8 text-white flex flex-col items-center">
        {/* Center the room image */}
        <div className="container mt-28 bg-[#1E201E] border border-[#59636e] items-center pb-4">
          <img
            className="w-full h-[500px]"
            src={roomData.imageUrls[0]}
            alt={`Room ${roomData.name}`}
          />
          <h2 className="pt-2 font-bold text-2xl pb-4 text-center">
            Room No: {roomData.name}{" "}
          </h2>
          <p className="text-center">No. of Beds: {roomData.capacity}</p>

          {/* Ensure text wraps properly and is centered */}
          <p className="text-center ml-32  whitespace-normal break-words mx-4">
            Description: {roomData.description}
          </p>

          <p className="text-center">Price per Bed: {roomData.price}</p>
          <h3 className="text-xl text-center font-semibold mt-4">Beds:</h3>

          {/* Rest of the content */}
          <div className="flex justify-center items-center w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 w-full max-w-4xl">
              {roomData.beds.map((bed) => (
                <div
                  key={bed.bed_number}
                  className={`border border-[#59636e] p-4 rounded ${
                    bed.isBooked ? "bg-gray-200" : ""
                  }`}
                >
                  <p>Bed Number: {bed.bed_number}</p>
                  <p>Status: {bed.isBooked ? "Booked" : "Available"}</p>
                  {bed.isBooked ? (
                    <button
                      className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
                      disabled
                    >
                      Occupied
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBookBedClick(bed)}
                      className="bg-[#697565] hover:bg-[#3C3D37] text-white font-bold py-2 px-4 mt-2 rounded"
                    >
                      Book Bed
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          bed={selectedBed}
          room={roomData}
          hostelOwnerId={hostelId}
          onSuccess={handleCheckoutSuccess}
        />
      )}
      <Footer />
    </>
  );
};

export default RoomDetail;
