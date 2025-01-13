const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const routeUsers = require('./routes/routeUsers.js');
const routeRooms = require('./routes/routeRooms.js');
const routeRanks = require('./routes/routeRanks.js');
const app = express();
require('dotenv').config();

// Middleware để kiểm tra API token
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    const API_TOKEN = process.env.API_TOKEN;

    if (!token || token !== `${API_TOKEN}`) { 
        return res.sendStatus(403);  
    }
    next(); 
};

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Đặt middleware xác thực token trước khi kết nối với DB
app.use(authenticateToken);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Could not connect to MongoDB:', err));

// Routes
app.get('/', (req, res) => {res.send('Hello, World!');});
app.use('/api', routeUsers);
app.use('/api', routeRooms);
app.use('/api', routeRanks);

// Start Server
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
