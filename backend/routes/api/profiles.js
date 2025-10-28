const express = require('express');
const router = express.Router();
const db = require('../../config/db');

// @route   GET api/profiles/featured
// @desc    Get featured profiles
// @access  Public
router.get('/featured', async (req, res) => {
    try {
        const [profiles] = await db.query('SELECT * FROM profiles ORDER BY RAND() LIMIT 4');
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
