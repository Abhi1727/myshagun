const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');
const { check, validationResult } = require('express-validator');

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post('/', [
    check('firstName', 'First name is required').not().isEmpty(),
    check('lastName', 'Last name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password, dateOfBirth, mobileNumber, interestedFor } = req.body;

    try {
        // See if user exists
        let user = await db.query('SELECT * FROM users WHERE email = $1', [email]);

        if (user.rows.length > 0) {
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user
        const newUser = await db.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id',
            [email, hashedPassword]
        );
        const userId = newUser.rows[0].id;

        // Insert profile
        await db.query(
            'INSERT INTO profiles (id, first_name, last_name, email, date_of_birth, mobile_number, interested_for) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [userId, firstName, lastName, email, dateOfBirth, mobileNumber, interestedFor]
        );

        // Return jsonwebtoken
        const payload = {
            user: {
                id: userId
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