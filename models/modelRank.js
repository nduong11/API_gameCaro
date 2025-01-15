const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const modelsRanks = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    game: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        default: 0
    },
});

module.exports = mongoose.model('Ranks', modelsRanks);
