const express = require('express');
const Image = require('../models/modelImages');
const router = express.Router();

// Trả về thông tin phòng theo ID
router.get('/images/:imageId', async (req, res) =>{
  const { imageId } = req.params;
  try {
    // Tìm người dùng theo Email
    const image = await Image.findOne({ imageId });
    if (!image) {
      return res.status(404).json({ message: 'No image found' });
    }
    // Trả về thông tin người dùng
    res.status(200).json(image);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Tạo phòng
router.post('/createImage', async (req, res) => {
  const { imageName, imageUrl } = req.body;
  try {
    // Sinh ID ngẫu nhiên và đảm bảo không bị trùng
    const imageId = await generateUniqueIdWithCheck();
    // Tạo Image
    const image = new Image({ imageId, imageName, imageUrl});
    await image.save();
    res.status(200).json({ message: 'Image created successfully!!', image });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Xóa phòng theo ID
router.delete('/images/:imageId', async (req, res) => {
  const { imageId } = req.params;

  try {
    // Tìm và xóa phòng dựa trên roomId
    const deletedImage = await Image.findOneAndDelete({ imageId });

    if (!deletedImage) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.status(200).json({ message: 'Room deleted successfully', deletedImage });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

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
