const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Kiosk = require('../../models/Kiosk');
const Event = require('../../models/Event');

// @route   POST api/kiosks
// @desc    Create a kiosk for an event
// @access  Private
router.post('/', [auth, [
    check('location', 'Location is required').not().isEmpty(),
    check('event', 'Event is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { location, event } = req.body;

    try {
        const newKiosk = new Kiosk({
            location,
            event
        });

        const kiosk = await newKiosk.save();

        res.json(kiosk);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/kiosks/:eventId
// @desc    Get all kiosks for an event
// @access  Private
router.get('/:eventId', auth, async (req, res) => {
    try {
        const kiosks = await Kiosk.find({ event: req.params.eventId });
        res.json(kiosks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/kiosks/:id
// @desc    Update the status of a kiosk
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { status } = req.body;

    try {
        const kiosk = await Kiosk.findById(req.params.id);

        if (!kiosk) {
            return res.status(404).json({ msg: 'Kiosk not found' });
        }

        kiosk.status = status;

        await kiosk.save();

        res.json(kiosk);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
