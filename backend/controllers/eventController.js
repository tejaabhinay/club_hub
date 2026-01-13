const Event = require('../models/Event');
const Club = require('../models/Club');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
    try {
        const events = await Event.find().populate('clubId', 'name');
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get events for a specific club
// @route   GET /api/events/club/:clubId
// @access  Public
const getClubEvents = async (req, res) => {
    try {
        const events = await Event.find({ clubId: req.params.clubId });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create an event
// @route   POST /api/events
// @access  Private (SuperAdmin or Club Head)
const createEvent = async (req, res) => {
    const { title, description, clubId, date, venue } = req.body;

    try {
        const club = await Club.findById(clubId);
        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }

        // Permission check: SuperAdmin or Club Head
        const isSuperAdmin = req.user.role === 'superadmin';
        const isHead = club.head && club.head.toString() === req.user._id.toString();

        if (!isSuperAdmin && !isHead) {
            return res.status(403).json({ message: 'Not authorized to create events for this club' });
        }

        const event = new Event({
            title,
            description,
            clubId,
            date,
            venue,
            registeredStudents: [],
            attendedStudents: []
        });

        const createdEvent = await event.save();
        res.status(201).json(createdEvent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Register user for an event
// @route   POST /api/events/:id/register
// @access  Private
const registerForEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if already registered
        if (event.registeredStudents.includes(req.user._id)) {
            return res.status(400).json({ message: 'Already registered' });
        }

        event.registeredStudents.push(req.user._id);
        await event.save();

        res.json({ message: 'Registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify attendance via QR Scan
// @route   POST /api/events/verify-attendance
// @access  Private
const verifyAttendance = async (req, res) => {
    const { eventId, userId } = req.body;

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if already marked present
        if (event.attendedStudents.includes(userId)) {
            return res.status(400).json({ message: 'Attendance already marked' });
        }

        event.attendedStudents.push(userId);
        await event.save();

        res.json({ message: 'Attendance verified successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getEvents,
    getClubEvents,
    createEvent,
    registerForEvent,
    verifyAttendance
};
