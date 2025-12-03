const express = require('express');
const router = express.Router();
const db = require('../../config/db');
const auth = require('../../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// @route   GET api/chat/conversations
// @desc    Get all conversations for logged-in user
// @access  Private
router.get('/conversations', auth, async (req, res) => {
    try {
        const userId = req.user.id;

        const [conversations] = await db.query(`
            SELECT
                c.id,
                c.user1_id,
                c.user2_id,
                c.last_message_at,
                CASE
                    WHEN c.user1_id = ? THEN p2.first_name
                    ELSE p1.first_name
                END as other_first_name,
                CASE
                    WHEN c.user1_id = ? THEN p2.last_name
                    ELSE p1.last_name
                END as other_last_name,
                CASE
                    WHEN c.user1_id = ? THEN c.user2_id
                    ELSE c.user1_id
                END as other_user_id,
                CASE
                    WHEN c.user1_id = ? THEN p2.profile_photo_url
                    ELSE p1.profile_photo_url
                END as other_photo,
                (SELECT message FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message
            FROM conversations c
            LEFT JOIN profiles p1 ON c.user1_id = p1.id
            LEFT JOIN profiles p2 ON c.user2_id = p2.id
            WHERE c.user1_id = ? OR c.user2_id = ?
            ORDER BY c.last_message_at DESC
        `, [userId, userId, userId, userId, userId, userId]);

        res.json(conversations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/chat/messages/:conversationId
// @desc    Get all messages in a conversation
// @access  Private
router.get('/messages/:conversationId', auth, async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user.id;

        // Verify user is part of conversation
        const [conversation] = await db.query(
            'SELECT * FROM conversations WHERE id = ? AND (user1_id = ? OR user2_id = ?)',
            [conversationId, userId, userId]
        );

        if (conversation.length === 0) {
            return res.status(403).json({ msg: 'Access denied' });
        }

        const [messages] = await db.query(`
            SELECT
                m.*,
                p.first_name as sender_first_name,
                p.last_name as sender_last_name
            FROM messages m
            LEFT JOIN profiles p ON m.sender_id = p.id
            WHERE m.conversation_id = ?
            ORDER BY m.created_at ASC
        `, [conversationId]);

        // Mark messages as read
        await db.query(
            'UPDATE messages SET is_read = TRUE WHERE conversation_id = ? AND receiver_id = ?',
            [conversationId, userId]
        );

        res.json(messages);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/chat/send
// @desc    Send a message
// @access  Private
router.post('/send', auth, async (req, res) => {
    try {
        const { receiverId, message } = req.body;
        const senderId = req.user.id;

        if (!receiverId || !message) {
            return res.status(400).json({ msg: 'Receiver and message are required' });
        }

        // Find or create conversation
        let [conversation] = await db.query(`
            SELECT id FROM conversations
            WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)
        `, [senderId, receiverId, receiverId, senderId]);

        let conversationId;

        if (conversation.length === 0) {
            // Create new conversation
            conversationId = uuidv4();
            await db.query(
                'INSERT INTO conversations (id, user1_id, user2_id) VALUES (?, ?, ?)',
                [conversationId, senderId, receiverId]
            );
        } else {
            conversationId = conversation[0].id;
        }

        // Insert message
        const messageId = uuidv4();
        await db.query(
            'INSERT INTO messages (id, conversation_id, sender_id, receiver_id, message) VALUES (?, ?, ?, ?, ?)',
            [messageId, conversationId, senderId, receiverId, message]
        );

        // Update conversation last_message_at
        await db.query(
            'UPDATE conversations SET last_message_at = NOW() WHERE id = ?',
            [conversationId]
        );

        res.json({
            msg: 'Message sent',
            conversationId,
            messageId
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/chat/like
// @desc    Like a profile
// @access  Private
router.post('/like', auth, async (req, res) => {
    try {
        const { likedUserId } = req.body;
        const userId = req.user.id;

        if (!likedUserId) {
            return res.status(400).json({ msg: 'Liked user ID is required' });
        }

        // Check if already liked
        const [existing] = await db.query(
            'SELECT id FROM likes WHERE user_id = ? AND liked_user_id = ?',
            [userId, likedUserId]
        );

        if (existing.length > 0) {
            return res.json({ msg: 'Already liked', match: false });
        }

        // Add like
        const likeId = uuidv4();
        await db.query(
            'INSERT INTO likes (id, user_id, liked_user_id) VALUES (?, ?, ?)',
            [likeId, userId, likedUserId]
        );

        // Check if it's a match (both users liked each other)
        const [mutualLike] = await db.query(
            'SELECT id FROM likes WHERE user_id = ? AND liked_user_id = ?',
            [likedUserId, userId]
        );

        let match = false;
        let conversationId = null;

        if (mutualLike.length > 0) {
            // It's a match! Check if conversation already exists
            match = true;
            
            const [existingConvo] = await db.query(`
                SELECT id FROM conversations
                WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)
            `, [userId, likedUserId, likedUserId, userId]);

            if (existingConvo.length > 0) {
                conversationId = existingConvo[0].id;
            } else {
                // Create new conversation
                conversationId = uuidv4();
                await db.query(
                    'INSERT INTO conversations (id, user1_id, user2_id) VALUES (?, ?, ?)',
                    [conversationId, userId, likedUserId]
                );
            }
        }

        res.json({
            msg: match ? "It's a match!" : 'Like added',
            match,
            conversationId
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
