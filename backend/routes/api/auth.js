const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

// @route   GET api/auth
// @desc    Get user by token
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const user = await db.query('SELECT id, email, created_at, updated_at FROM users WHERE id = $1', [req.user.id]);
        res.json(user.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post('/', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await db.query('SELECT * FROM users WHERE email = $1', [email]);

        if (user.rows.length === 0) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

        const isMatch = await bcrypt.compare(password, user.rows[0].password);

        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

        const payload = {
            user: {
                id: user.rows[0].id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'mysecrettoken',
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;