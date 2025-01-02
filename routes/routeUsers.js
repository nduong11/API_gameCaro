const express = require('express');
const User = require('../models/modelUser');
const router = express.Router();

//Lấy thông tin người dùng
router.get('/user/:username', async (req, res) => {
  const { username } = req.params;
  try {
    // Tìm người dùng theo Username
    const user = await User.findOne({ username }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Trả về thông tin người dùng
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// Đăng ký
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Kiểm tra xem email có tồn tại không
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    // Nếu email không tồn tại 
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully!',user});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Đăng nhập
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    res.json({ message: 'User has logged in successfully!'});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
