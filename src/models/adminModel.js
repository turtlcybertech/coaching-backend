const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


const adminSchema = new mongoose.Schema({
    adminId: {
        type: String,
    },

    sessionToken: {
        type: String,
    },

    name: {
        type: String,
    },

    email: {
        type: String,
    },

    password: {
        type: String,
    },

    mobile: {
        type: String,
    },

    profilePic: {
        picName: {
            type: String,
        },
        picPath: {
            type: String,
        }
    },
}, {timestamps: true});

module.exports = mongoose.model("Admin", adminSchema);