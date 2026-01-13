const express = require('express');
const router = express.Router();
const { getClubs, getClubById, createClub, getSuperClubView, toggleRecruitment } = require('../controllers/clubController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

router.get('/', getClubs);
router.get('/super-view', protect, adminOnly, getSuperClubView);
router.get('/:id', getClubById);
router.post('/', protect, adminOnly, createClub);
router.patch('/:id/toggle-recruitment', protect, toggleRecruitment);

module.exports = router;
