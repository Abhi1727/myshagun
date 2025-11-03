
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');
const { check, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');

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

    const {
        firstName,
        lastName,
        email,
        password,
        dateOfBirth,
        mobileNumber,
        interestedFor,
        interestedIn,
        religion,
        city,
        state,
        livesWithFamily,
        maritalStatus,
        height,
        diet,
        smoking,
        drinking,
        highestQualification,
        profession
    } = req.body;

    try {
        // See if user exists
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length > 0) {
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const userId = uuidv4();

        // Insert user
        await db.query(
            'INSERT INTO users (id, email, password) VALUES (?, ?, ?)',
            [userId, email, hashedPassword]
        );

        // Insert profile with all fields (optional fields can be null)
        await db.query(
            `INSERT INTO profiles (
                id, first_name, last_name, email, date_of_birth, mobile_number,
                interested_for, interested_in, religion, city, state, lives_with_family,
                marital_status, height, diet, smoking, drinking,
                highest_qualification, profession
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userId,
                firstName,
                lastName,
                email,
                dateOfBirth || null,
                mobileNumber || null,
                interestedFor || null,
                interestedIn || null,
                religion || null,
                city || null,
                state || null,
                livesWithFamily === 'yes' ? 1 : livesWithFamily === 'no' ? 0 : null,
                maritalStatus || null,
                height || null,
                diet || null,
                smoking || null,
                drinking || null,
                highestQualification || null,
                profession || null
            ]
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
        console.error('Registration error:', err.message);
        console.error('Full error:', err);
        res.status(500).json({
            errors: [{ msg: 'Server error during registration. Please try again.' }],
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

module.exports = router;