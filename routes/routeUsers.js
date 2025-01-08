const express = require('express');
const User = require('../models/modelUser');
const router = express.Router();

//Lấy thông tin người dùng
router.get('/users/:username', async (req, res) => {
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

// Trả về thông tin avatar theo username
router.get('/users/avatar/:username', async (req, res) =>{
  const { username } = req.params;
  try {
    // Tìm người dùng theo Email
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'No user found' });
    }
    // Trả về thông tin người dùng
    res.status(200).json(user.avatar);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Đăng ký
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Kiểm tra xem username có tồn tại không
    const existingUser1 = await User.findOne({ username });
    if (existingUser1) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const existingUser2 = await User.findOne({ email: { $ne: 'null' } });
    if (existingUser2) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    // Nếu username không tồn tại 
    const user = new User({ username, password });
    await user.save();
    res.status(200).json({ message: 'User registered successfully!',user});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Đăng nhập
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    res.status(200).json({ message: 'User has logged in successfully!'});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update avatar
router.put('/users/avatar', async (req, res) => {
  const { username, avatar } = req.body;

  try {
    const updatedAvatar = await User.findOneAndUpdate(
      { username: username },
      { avatar: avatar },
      { new: true } // Trả về dữ liệu sau khi cập nhật
    );
    if (!updatedAvatar) {
      return res.status(404).json({ error: 'Username not found' });
    }

    res.status(200).json({
        message: 'Avatar updated successfully!',
        updatedAvatar,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
