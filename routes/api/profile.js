// Creating router
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { body, validationResult } = require('express-validator');

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

// @route  POST api/profile/me
// @desc   Create or update user profile
// @access Private
router.post(
	'/',
	[
		auth,
		[body('status', 'Status is required').not().isEmpty(), body('skills', 'Skills is required').not().isEmpty()]
	],
	async (req, res) => {
		const errors = validationResult(req);
		// If there are errors
		if (!errors.isEmpty()) {
			// return this response
			return res.status(400).json({ errors: errors.array() });
		}

		const {
			company,
			website,
			location,
			bio,
			status,
			githubusername,
			skills,
			youtube,
			facebook,
			twitter,
			instagram,
			linkedin
		} = req.body;

		// Build Profile Object
		const profileFields = {};
		profileFields.user = req.user.id;
		if (company) profileFields.company = company;
		if (website) profileFields.website = website;
		if (location) profileFields.location = location;
		if (bio) profileFields.bio = bio;
		if (status) profileFields.status = status;
		if (githubusername) profileFields.githubusername = githubusername;
		if (skills) {
			profileFields.skills = skills.split(',').map((skill) => skill.trim());
		}

		//Build social object
		profileFields.social = {};
		if (youtube) profileFields.social.youtube = youtube;
		if (twitter) profileFields.social.youtube = twitter;
		if (facebook) profileFields.social.youtube = facebook;
		if (linkedin) profileFields.social.youtube = linkedin;
		if (instagram) profileFields.social.youtube = instagram;

		try {
			// Look for a profile by the user id
			let profile = await Profile.findOne({ user: req.user.id });
			// If Profile is found then
			if (profile) {
				// Update
				profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true });
				return res.json(profile);
			}
			// If Not Found Create a Profile
			profile = new Profile(profileFields);
			// Then save it
			await profile.save();
			// Send Back the profile
			res.json(profile);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

module.exports = router;
