const express = require('express');
const router = express.Router();
const bookingController = require('../../controllers/hostelownercontroller/bookingController');
const authenticateToken = require('../../middlewares/AuthToken');  // Ensure the user is authenticated

// const authMiddleware = require('../../middlewares/AuthToken');


// Route to get room details
// router.get("/room/:roomId",authenticateToken, bookingController.getRoomDetails);

// Add this new route
router.get('/booked-rooms', authenticateToken, bookingController.getBookedRooms);

router.get('/HostelOwnerBookedBeds', authenticateToken, bookingController.getHostelOwnerBookedBeds);

// Route to book a specific bed in a room
router.post('/book/:hostelId/:roomId/:bedId',authenticateToken, bookingController.bookBed);

// Route to unbook a room
router.delete('/unbookBed/:bookingId', authenticateToken, bookingController.unbookRoom);

module.exports = router;
