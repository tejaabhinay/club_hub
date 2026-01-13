const express = require('express');
const router = express.Router();
const { getEvents, createEvent, registerForEvent, verifyAttendance, getClubEvents } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
// const { adminOnly } = require('../middleware/roleMiddleware'); // Not strictly needed for createEvent as logic is now in controller, but protect is needed.

router.get('/', getEvents);
router.get('/club/:clubId', getClubEvents);
router.post('/', protect, createEvent); // Removed adminOnly middleware from route as controller handles fine-grained permission
router.post('/:id/register', protect, registerForEvent);
router.post('/verify-attendance', protect, verifyAttendance);

module.exports = router;
