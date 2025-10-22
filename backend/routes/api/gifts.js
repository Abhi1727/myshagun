const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Gift = require('../../models/Gift');
const Event = require('../../models/Event');

// @route   POST api/gifts
// @desc    Send a gift to an event
// @access  Private
router.post('/', [auth, [
    check('amount', 'Amount is required').not().isEmpty(),
    check('event', 'Event is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { amount, message, event } = req.body;

    try {
        const newGift = new Gift({
            amount,
            message,
            event,
            sender: req.user.id
        });

        const gift = await newGift.save();

        const eventToUpdate = await Event.findById(event);
        eventToUpdate.gifts.push(gift.id);
        await eventToUpdate.save();

        res.json(gift);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/gifts/:eventId
// @desc    Get all gifts for an event
// @access  Private
router.get('/:eventId', auth, async (req, res) => {
    try {
        const gifts = await Gift.find({ event: req.params.eventId }).populate('sender', ['name', 'avatar']);
        res.json(gifts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
