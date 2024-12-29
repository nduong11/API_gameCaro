const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const modelRooms = new mongoose.Schema({
    roomId: {
        type: String,
        required: true
    },
    roomName: {
        type: String,
        required: true
    },
    roomType: {
        type: String,
        required: true
    },
    playerLeft: {
        type: String,
        required: true
    },
    playerRight: {
        type: String
    },
    game: {
        type: [Number],
        default: Array(225).fill(0),
    },
    turnGame: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Rooms', modelRooms);
