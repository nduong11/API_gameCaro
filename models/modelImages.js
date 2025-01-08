const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const modelImages = new mongoose.Schema({
    imageId: {
        type: String,
        required: true
    },
    imageName: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Images', modelImages);