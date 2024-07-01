const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: true,
        trim: true,
    },
    organizer: {
        type: String,
        required: true,
        trim: true,
    },
    volunteer: {
        type: Number,
        required: true,
        trim: true,
    },
    location: {
        type:String ,
        required: true,
        trim: true,
    },
    eventTime: {
        type: Date,
        required: true,
        trim:true,
    },

    eventDetails: {
        type: String,
        required: true,
        trim:true,
    },
    eventImageUrl: {
        type: String,
        required:true,
    }


})

const Events = mongoose.model('events', eventSchema);
module.exports = Events;