const express = require('express');
const router = express.Router();
const db = require('../../config/db');
const auth = require('../../middleware/auth');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
});

// @route   POST api/profiles/upload-photo
// @desc    Upload profile photo
// @access  Private
router.post('/upload-photo', auth, upload.single('photo'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        // Construct the full URL for the uploaded image
        const photoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        // Update profile with photo URL
        await db.query(
            'UPDATE profiles SET profile_photo_url = ? WHERE id = ?',
            [photoUrl, req.user.id]
        );

        res.json({
            msg: 'Photo uploaded successfully',
            photoUrl: photoUrl
        });

    } catch (err) {
        console.error('Upload photo error:', err.message);
        res.status(500).send('Server error');
    }
});

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

// @route   GET api/profiles/discover
// @desc    Get profiles for swiping (excludes current user, already liked, and connected)
// @access  Private
router.get('/discover', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Get profiles excluding:
        // 1. Current user's own profile
        // 2. Profiles already liked by current user
        // 3. Profiles already connected with current user
        const [profiles] = await db.query(`
            SELECT p.* FROM profiles p
            WHERE p.id != ?
            AND p.id NOT IN (
                SELECT liked_user_id FROM likes WHERE user_id = ?
            )
            AND p.id NOT IN (
                SELECT user1_id FROM conversations WHERE user2_id = ?
                UNION
                SELECT user2_id FROM conversations WHERE user1_id = ?
            )
            ORDER BY RAND()
        `, [userId, userId, userId, userId]);
        
        res.json(profiles);
    } catch (err) {
        console.error('Get discover profiles error:', err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/profiles/browse
// @desc    Get all profiles for browsing (excludes current user)
// @access  Private
router.get('/browse', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const [profiles] = await db.query(
            'SELECT * FROM profiles WHERE id != ? ORDER BY created_at DESC',
            [userId]
        );
        res.json(profiles);
    } catch (err) {
        console.error('Get browse profiles error:', err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/profiles/likes-received
// @desc    Get profiles who liked current user
// @access  Private
router.get('/likes-received', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Get profiles who liked current user (but current user hasn't liked back yet)
        const [likes] = await db.query(`
            SELECT p.*, l.created_at as liked_at
            FROM likes l
            JOIN profiles p ON l.user_id = p.id
            WHERE l.liked_user_id = ?
            AND l.user_id NOT IN (
                SELECT liked_user_id FROM likes WHERE user_id = ?
            )
            ORDER BY l.created_at DESC
        `, [userId, userId]);
        
        res.json(likes);
    } catch (err) {
        console.error('Get likes received error:', err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/profiles/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const [profiles] = await db.query('SELECT * FROM profiles WHERE id = ?', [req.user.id]);

        if (profiles.length === 0) {
            return res.status(404).json({ msg: 'Profile not found' });
        }

        res.json(profiles[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/profiles/likes/received
// @desc    Get profiles who liked current user
// @access  Private
router.get('/likes/received', auth, async (req, res) => {
    try {
        const [likes] = await db.query(
            `SELECT p.*, pl.created_at as liked_at
             FROM profile_likes pl
             JOIN profiles p ON pl.from_profile_id = p.id
             WHERE pl.to_profile_id = ?
             ORDER BY pl.created_at DESC`,
            [req.user.id]
        );

        res.json(likes);
    } catch (err) {
        console.error('Get likes error:', err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/profiles/connections
// @desc    Get all connections of current user
// @access  Private
router.get('/connections', auth, async (req, res) => {
    try {
        // Get connections where user is profile_id_1
        const [connections1] = await db.query(
            `SELECT p.*, pc.status, pc.created_at as connected_at
             FROM profile_connections pc
             JOIN profiles p ON pc.profile_id_2 = p.id
             WHERE pc.profile_id_1 = ? AND pc.status = 'accepted'`,
            [req.user.id]
        );

        // Get connections where user is profile_id_2
        const [connections2] = await db.query(
            `SELECT p.*, pc.status, pc.created_at as connected_at
             FROM profile_connections pc
             JOIN profiles p ON pc.profile_id_1 = p.id
             WHERE pc.profile_id_2 = ? AND pc.status = 'accepted'`,
            [req.user.id]
        );

        // Combine and sort by connected_at
        const allConnections = [...connections1, ...connections2].sort(
            (a, b) => new Date(b.connected_at) - new Date(a.connected_at)
        );

        res.json(allConnections);
    } catch (err) {
        console.error('Get connections error:', err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/profiles/:id
// @desc    Get profile by ID
// @access  Private (MUST be after all specific routes like /me, /connections, /likes/received)
router.get('/:id', auth, async (req, res) => {
    try {
        const [profiles] = await db.query('SELECT * FROM profiles WHERE id = ?', [req.params.id]);

        if (profiles.length === 0) {
            return res.status(404).json({ msg: 'Profile not found' });
        }

        res.json(profiles[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/profiles/me
// @desc    Update current user's profile
// @access  Private
router.put('/me', auth, async (req, res) => {
    try {
        const {
            firstName,
            lastName,
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
            profession,
            bio
        } = req.body;

        // Build update query dynamically based on provided fields
        const updates = [];
        const values = [];

        if (firstName !== undefined) {
            updates.push('first_name = ?');
            values.push(firstName);
        }
        if (lastName !== undefined) {
            updates.push('last_name = ?');
            values.push(lastName);
        }
        if (dateOfBirth !== undefined) {
            updates.push('date_of_birth = ?');
            values.push(dateOfBirth);
        }
        if (mobileNumber !== undefined) {
            updates.push('mobile_number = ?');
            values.push(mobileNumber);
        }
        if (interestedFor !== undefined) {
            updates.push('interested_for = ?');
            values.push(interestedFor);
        }
        if (interestedIn !== undefined) {
            updates.push('interested_in = ?');
            values.push(interestedIn);
        }
        if (religion !== undefined) {
            updates.push('religion = ?');
            values.push(religion);
        }
        if (city !== undefined) {
            updates.push('city = ?');
            values.push(city);
        }
        if (state !== undefined) {
            updates.push('state = ?');
            values.push(state);
        }
        if (livesWithFamily !== undefined) {
            updates.push('lives_with_family = ?');
            values.push(livesWithFamily === 'yes' ? 1 : livesWithFamily === 'no' ? 0 : null);
        }
        if (maritalStatus !== undefined) {
            updates.push('marital_status = ?');
            values.push(maritalStatus);
        }
        if (height !== undefined) {
            updates.push('height = ?');
            values.push(height);
        }
        if (diet !== undefined) {
            updates.push('diet = ?');
            values.push(diet);
        }
        if (smoking !== undefined) {
            updates.push('smoking = ?');
            values.push(smoking);
        }
        if (drinking !== undefined) {
            updates.push('drinking = ?');
            values.push(drinking);
        }
        if (highestQualification !== undefined) {
            updates.push('highest_qualification = ?');
            values.push(highestQualification);
        }
        if (profession !== undefined) {
            updates.push('profession = ?');
            values.push(profession);
        }
        if (bio !== undefined) {
            updates.push('bio = ?');
            values.push(bio);
        }

        if (updates.length === 0) {
            return res.status(400).json({ msg: 'No fields to update' });
        }

        // Add user ID to values array
        values.push(req.user.id);

        const query = `UPDATE profiles SET ${updates.join(', ')} WHERE id = ?`;
        await db.query(query, values);

        // Get updated profile
        const [profiles] = await db.query('SELECT * FROM profiles WHERE id = ?', [req.user.id]);
        res.json(profiles[0]);

    } catch (err) {
        console.error('Update profile error:', err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/profiles
// @desc    Get all profiles (for logged-in users)
// @access  Private
router.get('/', async (req, res) => {
    try {
        const [profiles] = await db.query('SELECT * FROM profiles ORDER BY created_at DESC');
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/profiles/like/:id
// @desc    Like a profile
// @route   POST api/profiles/like/:id
// @desc    Like a profile
// @access  Private
router.post('/like/:id', auth, async (req, res) => {
    try {
        const toProfileId = req.params.id;
        const fromProfileId = req.user.id;

        if (fromProfileId === toProfileId) {
            return res.status(400).json({ msg: 'Cannot like your own profile' });
        }

        // Check if already liked
        const [existingLike] = await db.query(
            'SELECT * FROM profile_likes WHERE from_profile_id = ? AND to_profile_id = ?',
            [fromProfileId, toProfileId]
        );

        if (existingLike.length > 0) {
            return res.status(400).json({ msg: 'Profile already liked' });
        }

        // Add like
        await db.query(
            'INSERT INTO profile_likes (from_profile_id, to_profile_id) VALUES (?, ?)',
            [fromProfileId, toProfileId]
        );

        res.json({ msg: 'Profile liked successfully' });
    } catch (err) {
        console.error('Like error:', err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/profiles/connect/:id
// @desc    Send connection request to a profile
// @access  Private
router.post('/connect/:id', auth, async (req, res) => {
    try {
        const profileId2 = req.params.id;
        const profileId1 = req.user.id;

        if (profileId1 === profileId2) {
            return res.status(400).json({ msg: 'Cannot connect with your own profile' });
        }

        // Ensure consistent ordering (smaller id first)
        const [pid1, pid2] = profileId1 < profileId2 ? [profileId1, profileId2] : [profileId2, profileId1];

        // Check if connection already exists
        const [existing] = await db.query(
            'SELECT * FROM profile_connections WHERE profile_id_1 = ? AND profile_id_2 = ?',
            [pid1, pid2]
        );

        if (existing.length > 0) {
            return res.status(400).json({ msg: 'Connection already exists', status: existing[0].status });
        }

        // Create connection request
        await db.query(
            'INSERT INTO profile_connections (profile_id_1, profile_id_2, status) VALUES (?, ?, ?)',
            [pid1, pid2, 'accepted']
        );

        res.json({ msg: 'Connected successfully' });
    } catch (err) {
        console.error('Connect error:', err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
