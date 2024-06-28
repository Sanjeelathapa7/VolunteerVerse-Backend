const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    donationName: {
        type: String,
        required: true,
        trim: true,
    },
    donor: {
        type: String,
        required: true,
        trim: true,
    },
    totalDonor: {
        type: Number,
        required: true,
        trim: true,
    },
    time: {
        type: Date,
        required: true,
        trim: true,
    },
    target: {
        type: Number,
        required: true,
        trim:true,
    },
    percentage: {
        type: Number,
        required: true,
        trim:true,

    },
    donationDetails: {
        type: String,
        required: true,
        trim:true,
    },
    donationImageUrl: {
        type: String,
        required:true,
    }


})

const Donations = mongoose.model('donations', donationSchema);
module.exports = Donations;