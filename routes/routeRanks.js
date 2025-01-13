const express = require('express');
const Rank = require('../models/modelRank');
const router = express.Router();

// Trả về danh sách Rank
router.get('/rank/game/:game', async (req, res) => {
    const { game } = req.params;

    try {
        const rank = await Rank.find({ game });

        if (rank) {
            res.status(200).json(rank);
        } else {
            res.status(404).json({ message: 'Không tìm thấy dữ liệu' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi khi tìm kiếm' });
    }
});

// Trả về danh sách Rank theo Username
router.get('/rank/:game/:username', async (req, res) => {
    const { game, username } = req.params;

    try {
        const rank = await Rank.find({ game, username });

        if (rank) {
            res.status(200).json(rank);
        } else {
            res.status(404).json({ message: 'Không tìm thấy dữ liệu' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi khi tìm kiếm' });
    }
});

router.put('/rank', async (req, res) => {
    const { username, game, score} = req.body;
    try {
        const rank = await Rank.findOne({ username, game });
        if (!rank) {
            const newRank = new Rank({ username, game });
            await newRank.save();
            newRank.score += score
            res.status(200).json({ message: 'Rank updated successfully!!', newRank });
        }
        rank.score += score;
        
        res.status(200).json({ message: 'Rank updated successfully!!', rank });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


module.exports = router;
