const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const bookingSchema = new mongoose.Schema({
    userId: {
        type: String,
    },

    bookingId: {
        type: String,
    },

    f_name: {
        type: String,
        default: ""
    },

    l_name: {
        type: String,
        default: ""
    },

    email: {
        type: String,
    },

    mobile: {
        type: String,
    },

    address: {
        type: String,
    },

    apartment: {
        type: String,
    },

    city: {
        type: String,
    },

    state: {
        type: String,
    },

    state_code: {
        type: Number,
    },

    countryCode: {
        type: String,
    },

    countryName: {
        type: String,
    },

    post_code: {
        type: String,
    },

    productList: [
        {
            name: { type: String },
            subTitle: { type: String },
            bookingQty: { type: Number},
            category: { type: String },
            description: { type: String },
            discount: { type: String },
            imgUrl: { type: String },
            price: { type: Number },
            status: { type: String },
            stock_items: { type: Number },
            subTotal: { type: Number }
        }
    ],

    totalProduct: {
        type: Number,
    },

    CGST: {
        type: Number,
    },

    SGST: {
        type: Number,
    },

    total: {
        type: Number,
    },

    grand_total: {
        type: Number,
        default: 0,
    },

    BookingDate: {
        type: String,
        default: "",
    },

    TimeSlot: {
        type: String,
        default: "",
    },

    booking_status: {
        type: String,
        enum: ["ONGOING", "COMPLETED", "CANCELED"],
        default: "ONGOING"
    },

    question: {
        type: String,
    },

    feedback: {
        type: String,
    }

}, {timestamps: true});

module.exports = mongoose.model("Booking", bookingSchema);