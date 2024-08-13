const { isValidObjectId } = require("mongoose");
const bookingModel = require("../models/bookingModel");
const userModel = require("../models/userModel");
const { adminSecretKey } = require("../config/config");

// CREATE BOOKING
const createBooking = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).send({ status: false, message: "User Id is required" });
        }

        let user = await userModel.findOne({ userId });

        if (!user) {
            return res.status(404).send({ status: false, message: "User Not Found" });
        }

        let {
            f_name,
            l_name,
            email,
            mobile,
            address,
            apartment,
            city,
            state,
            state_code,
            countryCode,
            countryName,
            post_code,
            productList,
            CGST,
            SGST,
            grand_total,
            BookingDate,
            TimeSlot,
            booking_status,
            totalProduct,
            total,
        } = req.body;

        let products = [];

        for (let productData of productList) {
            let { 
                name, 
                subTitle, 
                bookingQty, 
                category, 
                description, 
                discount, 
                imgUrl, 
                price, 
                status, 
                stock_items, 
                subTotal 
            } = productData;

            products.push({
                name,
                subTitle,
                bookingQty,
                category,
                description,
                discount,
                imgUrl,
                price,
                status,
                stock_items,
                subTotal,
            });
        }

        let str = "AP";
        let randomId;
        let bookingId;
        let isBookingAlreadyExist

        do {
            randomId = Math.floor(100000 + Math.random() * 899999);
            bookingId = str + randomId;
            isBookingAlreadyExist = await bookingModel.findOne({ bookingId: bookingId });
        } while (isBookingAlreadyExist);
        
        let bookingObj = {
            userId,
            bookingId: bookingId,
            f_name,
            l_name,
            email,
            mobile,
            address,
            apartment,
            city,
            state,
            state_code,
            countryCode,
            countryName,
            post_code,
            productList,
            CGST,
            SGST,
            grand_total,
            BookingDate,
            TimeSlot,
            booking_status,
            totalProduct,
            total,
        };

        let newBooking = await bookingModel.create(bookingObj);

        return res.status(200).send({
            status: true,
            message: "Booking created successfully",
            data: newBooking,
        });
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
};

// GET ALL BOOKINGS OF A USER BY USER ID
const getUserAllBookings = async (req, res) => {
    try {
        let { userId } = req.params;
        if (!userId) {
            return res.status(400).send({ status: false, message: "userId is required" });
        }

        let user = await userModel.findOne({ userId });

        if (!user) {
            return res.status(404).send({ status: false, message: "User Not Found" });
        }

        let allBookingsOfAUser = await bookingModel.find({ userId: user.userId });

        return res.status(200).send({
            status: true,
            message: "Success",
            data: allBookingsOfAUser,
        });
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
};

// GET ALL BOOKINGS
const getAllBookings = async (req, res) => {
    try {
        let { key } = req.params;

        if (!key) {
            return res.status(400).send({ status: false, message: "Key is required" });
        }

        if (key === adminSecretKey) {
            let allBookings = await bookingModel.find({});

            return res.status(200).send({
                status: true,
                message: "Success",
                data: allBookings,
            });
        } else {
            return res.status(403).send({ status: false, message: "NOT AUTHORIZED!!!"});
        }
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
};

// GET ALL SLOTS OF A PERTICULAR DATE
const getAllSlotsOfADate = async (req, res) => {
    try {
        let { date } = req.params;
        if (!date) {
            return res.status(400).send({ status: false, message: "Date is required" });
        }

        let allBookings = await bookingModel.find({ BookingDate: date });

        let timeSlotArr = [];
        if (allBookings.length) {
            for (let booking of allBookings) {
                timeSlotArr.push(booking.TimeSlot);
            }
        }

        return res.status(200).send({
            status: true,
            message: "Success",
            date: date,
            bookedSlots: timeSlotArr,
        });
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
};

// GET SPECIFIC BOOKING OF AN USER
const getSpecificBooking = async (req, res) => {
    try {
        let { bookingId } = req.params;
        if (!bookingId) {
            return res.status(400).send({ status: false, message: "bookingId is required" });
        }

        let booking = await bookingModel.findById(bookingId);
        if (!booking) {
            return res.status(404).send({
                status: false,
                message: "No booking found with this booking id",
            });
        }

        return res.status(200).send({
            status: true,
            message: "Success",
            data: booking,
        });
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
};

// UPDATE BOOKING STATUS
const updateBookingStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;

        if (!bookingId) {
            return res.status(400).send({ status: false, message: "Booking Id is required" });
        }

        const { status, question, feedback } = req.body;

        if (!status) {
            return res.status(400).send({ status: false, message: "status is required" });
        }

        if (!isValidObjectId(bookingId)) {
            return res.status(400).send({ status: false, message: "Invalid Booking Id" });
        }

        let booking = await bookingModel.findById(bookingId);

        if (!booking) {
            return res.status(200).send({ status: true, message: "Booking Not Found" });
        }

        booking.booking_status = status;
        booking.question = question? question : "";
        booking.feedback = feedback? feedback : "";

        await booking.save();

        return res.status(200).send({
            status: true,
            message: "Booking status updated successfully",
            data: booking,
        });
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
};

module.exports = {
    createBooking,
    getAllSlotsOfADate,
    getUserAllBookings,
    getAllBookings,
    getSpecificBooking,
    updateBookingStatus,
};
