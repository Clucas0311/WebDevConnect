// Creating router
const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
// encrypt the password
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

// get user model
const User = require('../../models/User');
// @route  POST api/users
// @desc   Test route
// @access Public
router.post(
	'/',
	[
		body('name', 'Name is required').not().isEmpty(),
		body('email', 'Please include a valid email').isEmail(),
		body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { name, email, password } = req.body;

		try {
			// See if the user exists
			let user = await User.findOne({ email });
			if (user) {
				return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
			}
			// Get the users gravatar
			const avatar = gravatar.url(email, {
				//size
				s: '200',
				// rating
				r: 'pg',
				//default
				d: 'mm'
			});

			// Create an instance of a user
			user = new User({
				name,
				email,
				avatar,
				password
			});
			// Encrypt password
			const salt = await bcrypt.genSalt(10);
			// create a hash and puts it into password
			user.password = await bcrypt.hash(password, salt);
			// save the user to the database
			await user.save();
			//Return jsonwebtoken

			res.send('User registered');
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server error');
		}
	}
);

module.exports = router;
