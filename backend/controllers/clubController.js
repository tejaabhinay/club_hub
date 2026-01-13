const Club = require('../models/Club');
const mongoose = require('mongoose');

// @desc    Get all clubs
// @route   GET /api/clubs
// @access  Public
const getClubs = async (req, res) => {
    try {
        const clubs = await Club.find().populate('head', 'name email profilePic').populate('coordinators', 'name email profilePic');
        res.json(clubs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single club by ID
// @route   GET /api/clubs/:id
// @access  Public
const getClubById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Club not found (Invalid ID)' });
    }

    try {
        const club = await Club.findById(id)
            .populate('head', 'name profilePic')
            .populate('hierarchy.userRef', 'name profilePic email')
            .populate('coordinators', 'name email profilePic'); // Keep coordinators for backward compatibility if needed

        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }

        res.json(club);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a club
// @route   POST /api/clubs
// @access  Private/Admin
const createClub = async (req, res) => {
    const { name, description, head, coordinators } = req.body;

    try {
        const club = new Club({
            name,
            description,
            head,
            coordinators,
            achievements: [],
            members: []
        });

        const createdClub = await club.save();
        res.status(201).json(createdClub);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get detailed club view for SuperAdmin
// @route   GET /api/clubs/super-view
// @access  Private/SuperAdmin
const getSuperClubView = async (req, res) => {
    try {
        const clubs = await Club.find()
            .populate('head', 'name email profilePic')
            .populate('coordinators', 'name email profilePic')
            .populate('members', 'name email profilePic'); 

        const detailedClubs = clubs.map(club => ({
            _id: club._id,
            name: club.name,
            description: club.description,
            head: club.head,
            coordinators: club.coordinators,
            members: club.members,
            memberCount: club.members.length,
            achievements: club.achievements,
            isRecruiting: club.isRecruiting,
            hierarchy: club.hierarchy
        }));

        res.json(detailedClubs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle recruitment status
// @route   PATCH /api/clubs/:id/toggle-recruitment
// @access  Private (SuperAdmin or Club Head)
const toggleRecruitment = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Club not found' });
    }

    try {
        const club = await Club.findById(id);
        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }

        // Check permissions: SuperAdmin or Club Head
        const isSuperAdmin = req.user.role === 'superadmin';
        const isHead = club.head && club.head.toString() === req.user._id.toString();

        if (!isSuperAdmin && !isHead) {
            return res.status(403).json({ message: 'Not authorized to update this club' });
        }

        club.isRecruiting = !club.isRecruiting;
        await club.save();

        res.json({ 
            message: `Recruitment status toggled to ${club.isRecruiting}`, 
            isRecruiting: club.isRecruiting 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getClubs,
    getClubById,
    createClub,
    getSuperClubView,
    toggleRecruitment
};
