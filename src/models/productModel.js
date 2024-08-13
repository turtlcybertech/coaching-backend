const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        default: ""
    },

    subTitle: {
        type: String,
    },

    description: {
        type: String,
        default: "",
    },

    service_image: {
        imageName: {
            type: String,
        },
        imagePath: {
            type: String,
        }
    },

    category: {
        type: ObjectId,
        ref: "Category"
    },

    price: {
        type: Number,
        default: 0
    },

    stock_items: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        enum: ["AVAILABLE", "NOT_AVAILABLE"]
    },

    discount: {
        type: String,
    }
},{ timestamps: true });


module.exports = mongoose.model("Product", productSchema);