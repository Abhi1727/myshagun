const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Event = require('../../models/Event');
const User = require('../../models/User');

// @route   POST api/events
// @desc    Create an event
// @access  Private
router.post('/', [auth, [
    check('name', 'Name is required').not().isEmpty(),
    check('date', 'Date is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, date } = req.body;

    try {
        const newEvent = new Event({
            name,
            description,
            date,
            user: req.user.id
        });

        const event = await newEvent.save();

        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/events
// @desc    Get all events for a user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const events = await Event.find({ user: req.user.id }).sort({ date: -1 });
        res.json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/events/:id
// @desc    Get event by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        res.json(event);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Event not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/events/:id
// @desc    Delete an event
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        // Check user
        if (event.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await event.remove();

        res.json({ msg: 'Event removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Event not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
