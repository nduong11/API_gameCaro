const express = require('express');
const Room = require('../models/modelRoom');
const router = express.Router();

// Trả về danh sách phòng
router.get('/rooms', async (req, res) =>{
  try {
    // Truy vấn tất cả các phòng từ cơ sở dữ liệu
    const rooms = await Room.find(); // Sử dụng phương thức `find()` để lấy tất cả các phòng

    // Nếu không có phòng nào
    if (rooms.length === 0) {
      return res.status(404).json({ message: 'No rooms found' });
    }

    // Trả về danh sách phòng
    res.status(200).json({ message: 'Rooms retrieved successfully', rooms });
  } catch (error) {
    // Nếu có lỗi trong quá trình truy vấn
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Trả về thông tin phòng theo ID
router.get('/rooms/:roomId', async (req, res) =>{
  const { roomId } = req.params;
  try {
    // Tìm người dùng theo Email
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: 'No room found' });
    }
    // Trả về thông tin người dùng
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Tạo phòng
router.post('/createRoom', async (req, res) => {
  const { roomName, roomType, playerLeft, turnGame } = req.body;
  try {
    // Sinh ID ngẫu nhiên và đảm bảo không bị trùng
    const roomId = await generateUniqueIdWithCheck();
    console.log(typeof roomId); // 
    // Tạo Room
    const room = new Room({ roomId, roomName, roomType, playerLeft, turnGame });
    room.playerRight = 'null';
    console.log(room)
    await room.save();
    res.status(200).json({ message: 'Room created successfully!!', room });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Xóa phòng theo ID
router.delete('/rooms/:roomId', async (req, res) => {
  const { roomId } = req.params;

  try {
    // Tìm và xóa phòng dựa trên roomId
    const deletedRoom = await Room.findOneAndDelete({ roomId });

    if (!deletedRoom) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.status(200).json({ message: 'Room deleted successfully', deletedRoom });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// Check ID đã tồn tại chưa
const generateUniqueIdWithCheck = async () => {
  let id;
  let exists = true;

  do {
    id = generateUniqueId();
    // Kiểm tra xem ID đã tồn tại trong cơ sở dữ liệu hay chưa
    exists = await Room.findOne({ roomId: id });
  } while (exists);

  return id;
};

// Hàm sinh ID duy nhất
const generateUniqueId = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';

    // Sinh 2 chữ cái ngẫu nhiên
    const randomLetters = Array.from({ length: 2 }, () => 
      letters[Math.floor(Math.random() * letters.length)]
    ).join('');

    // Sinh 4 số ngẫu nhiên
    const randomNumbers = Array.from({ length: 4 }, () => 
      numbers[Math.floor(Math.random() * numbers.length)]
    ).join('');

    return `${randomLetters}${randomNumbers}`;
};

module.exports = router;
