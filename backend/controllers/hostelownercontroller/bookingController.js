const stripe = require('../../config/stripe');
const Room = require('../../models/hostelowner/Hostelroom');
const Bed = require('../../models/hostelowner/RoomBed');
const Student = require('../../models/student/Student');
const HostelOwner = require('../../models/hostelowner/Hostelowner');
const Booking = require('../../models/student/Booking');

// Controller function to book a bed and process payment
exports.bookBed = async (req, res) => {
    const { hostelId, roomId, bedId } = req.params;
    const { paymentMethodId } = req.body;
    const customerId = req.user.id;

    try {
        // Find hostel and related data
        const hostel = await HostelOwner.findById(hostelId);
        if (!hostel) {
            return res.status(404).json({ error: 'Hostel not found' });
        }

        const room = await Room.findOne({ _id: roomId, hostelId: hostelId });
        if (!room) {
            return res.status(404).json({ error: 'Room not found or does not belong to the specified hostel' });
        }

        const bedToBook = await Bed.findOne({ roomId: room._id, bed_number: parseInt(bedId) });
        if (!bedToBook || bedToBook.isBooked) {
            return res.status(400).json({ error: 'Bed is already booked' });
        }

        const hostelOwner = await HostelOwner.findById(room.hostelId);
        if (!hostelOwner || !hostelOwner.stripeAccountId) {
            return res.status(400).json({ error: 'Invalid hostel owner or missing Stripe account' });
        }

        // Create a payment intent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: room.price * 100,
            currency: 'usd',
            payment_method: paymentMethodId,
            confirm: true,
            transfer_data: {
                destination: hostelOwner.stripeAccountId,
            },
        });

        // Update bed booking status based on payment intent status
        bedToBook.isBooked = true;
        bedToBook.paymentIntentId = paymentIntent.id;
        bedToBook.bookingDate = new Date();
        bedToBook.bookedBy = customerId;

        if (paymentIntent.status === 'succeeded') {
            bedToBook.paymentStatus = 'completed'; // Mark as completed
            if (paymentIntent.charges.data.length > 0) {
                bedToBook.paymentReceiptUrl = paymentIntent.charges.data[0].receipt_url;
            }
        } else if (paymentIntent.status === 'requires_action') {
            bedToBook.paymentStatus = 'pending'; // Pending status if further action is needed
            await bedToBook.save();
            const newBooking = new Booking({
                student_id: customerId,
                room_id: roomId,
                hostel_id: hostelId,
                booking_date: bedToBook.bookingDate,
                status: 'Booked',
            });

            // console.log('New booking:', newBooking);
            await newBooking.save();
            return res.status(200).json({
                success: true,
                requiresAction: true,
                clientSecret: paymentIntent.client_secret,
            });
        }

        await bedToBook.save();

        const newBooking = new Booking({
            student_id: customerId,
            room_id: roomId,
            hostel_id: hostelId,
            booking_date: bedToBook.bookingDate,
            status: 'Booked',
        });

        // console.log('New booking:', newBooking);
        await newBooking.save();

        // Return success response with payment intent details
        res.status(200).json({ success: true, paymentIntent, bedStatus: bedToBook, booking: newBooking });

    } catch (error) {
        console.error('Error processing booking:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.getBookedRooms = async (req, res, next) => {
    console.log("I am in get booked rooms controller");
    const userId = req.user.id; // Assuming userId is the student's ID

    try {
        // Find all bookings for the student
        const bookings = await Booking.find({ student_id: userId })
            .populate('student_id')
            .populate('room_id') // Populate room details
            .populate('hostel_id'); // Populate hostel details

        if (bookings.length === 0) {
            return res.status(404).json({ error: 'No bookings found' });
        }

        const mergedBookings = {};

        bookings.forEach(booking => {
            const room = booking.room_id;
            const hostel = booking.hostel_id;
            const roomKey = `${hostel._id}-${room._id}`; // Create a unique key for each room-hostel combination

            if (!mergedBookings[roomKey]) {
                // If no entry exists for this room, create a new one
                mergedBookings[roomKey] = {
                    bookingId: booking._id,  // Keep the most recent booking ID
                    // studentName: booking.student_id.first_name + " " + booking.student_id.last_name,
                    // studentEmail: booking.student_id.email,
                    // studentPhone: booking.student_id.phone_number,
                    // studentGender: booking.student_id.gender,
                    // studentCNIC: booking.student_id.cnic,
                    hostelName: hostel.hostel_name,
                    hostelAddress: hostel.hostel_address,
                    roomId: room._id,
                    roomName: room.name,
                    bookingDate: booking.booking_date,
                    status: booking.status,
                    beds: [] // Initialize beds array
                };
            }

            // Merge beds, avoiding duplicates based on the bed number (or _id)
            const newBeds = room.beds.filter(bed => bed.bookedBy && bed.bookedBy.toString() === userId);

            // Add new beds only if they don't already exist in the array (based on bed_number)
            newBeds.forEach(bed => {
                const existingBed = mergedBookings[roomKey].beds.find(b => b.bed_number === bed.bed_number);
                if (!existingBed) {
                    mergedBookings[roomKey].beds.push(bed);
                }
            });
        });

        const formattedBookings = Object.values(mergedBookings); // Convert the object back to an array
        res.status(200).json({ success: true, data: formattedBookings });
    } catch (error) {
        console.error('Error fetching booked rooms:', error);
        next(error); // Pass the error to the next middleware for centralized error handling
    }
};

exports.getHostelOwnerBookedBeds = async (req, res, next) => {
    try {
        const hostelOwnerId = req.user.id;

        // Fetch all rooms for the hostel owner, populate beds for full bed details
        const rooms = await Room.find({ hostelId: hostelOwnerId })
            .populate('beds');

        // Fetch all bookings for the hostel owner
        const bookings = await Booking.find({ hostel_id: hostelOwnerId })
            .populate('student_id', 'name cnic email phoneNumber')
            .select('room_id booking_date status student_id bed_number')
            .lean();

        // Debugging log to check fetched data
        console.log("Rooms:", rooms);
        console.log("Bookings:", bookings);

        if (rooms.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No rooms found for this hostel owner."
            });
        }

        // Prepare the response structure
        const groupedBookings = rooms.map(room => {
            // Filter bookings for this room
            const roomBookings = bookings.filter(booking => booking.room_id.equals(room._id));
            
            // Map over beds and attach booking info if it exists
            const bedsWithBookings = room.beds.map(bed => {
                const booking = roomBookings.find(b => b.bed_number === bed.bed_number);
                return {
                    bedNumber: bed.bed_number,
                    isBooked: booking ? true : false,
                    bookingDate: booking ? booking.booking_date : null,
                    bookingId: booking ? booking._id : null,
                    paymentStatus: booking ? booking.status : 'not booked',
                    studentName: booking ? booking.student_id.name : null,
                    cnic: booking ? booking.student_id.cnic : null,
                    email: booking ? booking.student_id.email : null,
                    phoneNumber: booking ? booking.student_id.phoneNumber : null
                };
            });

            return {
                roomNumber: room.name, // Using the 'name' field as room number
                beds: bedsWithBookings
            };
        });

        res.status(200).json({
            success: true,
            data: groupedBookings
        });
    } catch (error) {
        next(error);
    }
};



exports.unbookRoom = async (req, res) => {
    const { bookingId } = req.params;
    const userId = req.user.id;

    try {
        // Find the booking by ID
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Verify that the booking belongs to the logged-in student
        if (booking.student_id.toString() !== userId) {
            return res.status(403).json({ error: 'Unauthorized to cancel this booking' });
        }

        // Find the bed associated with the booking and update its booking status
        const bedToUnbook = await Bed.findOne({ roomId: booking.room_id, bookedBy: userId });

        if (!bedToUnbook) {
            return res.status(404).json({ error: 'Bed not found in the room for unbooking' });
        }

        // Reset bed booking status
        bedToUnbook.isBooked = false;
        bedToUnbook.bookedBy = null;
        bedToUnbook.paymentIntentId = null;
        bedToUnbook.paymentStatus = 'pending';
        bedToUnbook.bookingDate = null;

        await bedToUnbook.save();

        // Update booking status to 'Cancelled'
        booking.status = 'Cancelled';
        await booking.save();

        res.status(200).json({ success: true, message: 'Room unbooked successfully' });
    } catch (error) {
        console.error('Error unbooking room:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
