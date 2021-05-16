// Creating router
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
// @route  GET api/profile/me
// @desc   GET current users profile
// @access Private
router.get('/me', auth, async (req, res) => {
	try {
		// Find the user by its id --> find One User by id, Populate the user with thier name and avatar from user model
		const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);
		// If the profile doesn't exist then return --> res.status
		if (!profile) {
			return res.status(400).json({ msg: 'There is no profile for this user' });
		}
		// If there is a profile
		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

module.exports = router;
