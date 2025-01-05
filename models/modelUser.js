const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const currentDate = new Date();

const modelUsers = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        default: 'null'
    },
    password: {
        type: String,
        required: true
    },
    time: {
        type: String,
        default: `${currentDate.getDay()}/${currentDate.getMonth()}/${currentDate.getFullYear()}`,
    }
});

modelUsers.pre('save', async function (next) {
    if (!this.isModified('password')) return next();  // Nếu mật khẩu chưa thay đổi, không mã hóa lại
    
    const salt = await bcrypt.genSalt(10);  // Tạo salt với mức độ bảo mật 10
    this.password = await bcrypt.hash(this.password, salt);  // Mã hóa mật khẩu với salt
    next();  // Tiến hành lưu người dùng
  });
  
  // Hàm so sánh mật khẩu trong khi đăng nhập
  modelUsers.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);  // So sánh mật khẩu đã mã hóa
  };
  

module.exports = mongoose.model('Users', modelUsers);
