
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const sendEmail = require('../../utils/email');
const { v4: uuidv4 } = require('uuid');

// @route   GET api/auth
// @desc    Get user by token with profile
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, email FROM users WHERE id = ?', [req.user.id]);
        if (users.length === 0) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Get profile data
        const [profiles] = await db.query('SELECT * FROM profiles WHERE id = ?', [req.user.id]);

        if (profiles.length > 0) {
            res.json({ ...users[0], ...profiles[0] });
        } else {
            res.json(users[0]);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/health
// @desc    Health check endpoint
// @access  Public
router.get('/health', (req, res) => {
    res.status(200).send('OK');
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
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

        const isMatch = await bcrypt.compare(password, users[0].password);

        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

        const payload = {
            user: {
                id: users[0].id
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

// @route   POST api/auth/send-otp
// @desc    Send OTP to user's email
// @access  Public
router.post('/send-otp', [check('email', 'Please include a valid email').isEmail()], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(400).json({ errors: [{ msg: "Email not registered. Please sign up first." }] });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expires_at = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await db.query('REPLACE INTO otps (email, otp, expires_at) VALUES (?, ?, ?)', [email, otp, expires_at]);

        const message = `Your OTP for MyShagun login is: ${otp}`;

        await sendEmail({
            email: email,
            subject: 'MyShagun - One-Time Password',
            message: message
        });

        res.json({ msg: 'OTP sent to your email.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth/verify-otp
// @desc    Verify OTP and login user
// @access  Public
router.post('/verify-otp', [
    check('email', 'Please include a valid email').isEmail(),
    check('otp', 'OTP is required').isLength({ min: 6, max: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, otp } = req.body;

    try {
        const [otps] = await db.query('SELECT * FROM otps WHERE email = ? AND otp = ?', [email, otp]);

        if (otps.length === 0) {
            return res.status(400).json({ errors: [{ msg: 'Invalid OTP.' }] });
        }

        const otpData = otps[0];

        if (new Date() > new Date(otpData.expires_at)) {
            return res.status(400).json({ errors: [{ msg: 'OTP has expired.' }] });
        }

        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            // This should not happen if send-otp is used correctly
            return res.status(400).json({ errors: [{ msg: 'User not found.' }] });
        }

        const payload = {
            user: {
                id: users[0].id
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

        // Delete the OTP after successful verification
        await db.query('DELETE FROM otps WHERE email = ?', [email]);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   DELETE api/auth/delete-account
// @desc    Delete user account and all associated data
// @access  Private
router.delete('/delete-account', auth, async (req, res) => {
    try {
        const userId = req.user.id;

        // Get user email for OTP cleanup
        const [users] = await db.query('SELECT email FROM users WHERE id = ?', [userId]);
        const userEmail = users.length > 0 ? users[0].email : null;

        // Delete related data in order (to handle foreign key constraints)
        // Delete profile likes where user is liker or liked
        await db.query('DELETE FROM profile_likes WHERE liker_id = ? OR liked_id = ?', [userId, userId]);
        
        // Delete profile connections
        await db.query('DELETE FROM profile_connections WHERE requester_id = ? OR receiver_id = ?', [userId, userId]);
        
        // Delete profile
        await db.query('DELETE FROM profiles WHERE id = ?', [userId]);
        
        // Delete OTPs if email exists
        if (userEmail) {
            await db.query('DELETE FROM otps WHERE email = ?', [userEmail]);
        }
        
        // Finally delete the user
        await db.query('DELETE FROM users WHERE id = ?', [userId]);

        res.json({ msg: 'Account deleted successfully' });
    } catch (err) {
        console.error('Delete account error:', err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth/forgot-password
// @desc    Send password reset OTP to user's email
// @access  Public
router.post('/forgot-password', [check('email', 'Please include a valid email').isEmail()], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(400).json({ errors: [{ msg: "Email not registered." }] });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expires_at = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await db.query('REPLACE INTO otps (email, otp, expires_at) VALUES (?, ?, ?)', [email, otp, expires_at]);

        const message = `Your OTP for MyShagun password reset is: ${otp}\n\nThis OTP is valid for 10 minutes.\n\nIf you did not request this, please ignore this email.`;

        await sendEmail({
            email: email,
            subject: 'MyShagun - Password Reset OTP',
            message: message
        });

        res.json({ msg: 'Password reset OTP sent to your email.' });

    } catch (err) {
        console.error('Forgot password error:', err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth/reset-password
// @desc    Reset password using OTP
// @access  Public
router.post('/reset-password', [
    check('email', 'Please include a valid email').isEmail(),
    check('otp', 'OTP is required').isLength({ min: 6, max: 6 }),
    check('newPassword', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, otp, newPassword } = req.body;

    try {
        // Verify OTP
        const [otps] = await db.query('SELECT * FROM otps WHERE email = ? AND otp = ?', [email, otp]);

        if (otps.length === 0) {
            return res.status(400).json({ errors: [{ msg: 'Invalid OTP.' }] });
        }

        const otpData = otps[0];

        if (new Date() > new Date(otpData.expires_at)) {
            return res.status(400).json({ errors: [{ msg: 'OTP has expired.' }] });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update user password
        await db.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);

        // Delete the OTP after successful password reset
        await db.query('DELETE FROM otps WHERE email = ?', [email]);

        res.json({ msg: 'Password reset successfully. You can now login with your new password.' });

    } catch (err) {
        console.error('Reset password error:', err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;