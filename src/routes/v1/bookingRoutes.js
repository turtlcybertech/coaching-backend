const express = require('express');
const router = express.Router();

const { createBooking, getSpecificBooking, getUserAllBookings, getAllBookings, getAllSlotsOfADate, updateBookingStatus } = require('../../controllers/bookingController');

// CREATE BOOKING
router.post("/api/v1/createBooking/:userId", createBooking);

// GET AN SPECIFIC BOOKING OF A USER
router.get("/api/v1/getSpecificBooking/:bookingId", getSpecificBooking);

// GET ALL BOOKINGS OF AN USER
router.get("/api/v1/getUserAllBookings/:userId", getUserAllBookings);

// GET ALL BOOKINGS
router.get("/api/v1/getAllBookings/:key", getAllBookings);

// GET ALL BOOKED SLOTS OF A DATE
router.get("/api/v1/getAllSlots/:date", getAllSlotsOfADate);

// UPDATE BOOKING STATUS
router.put("/api/v1/updateBookingStatus/:bookingId", updateBookingStatus);


module.exports = router;