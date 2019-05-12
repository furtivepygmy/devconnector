const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const auth = require('../../middleware/auth');

// Load User model
const User = require('../../models/User');

/************************************************************************/

// @route   GET api/auth
// @desc    Test
// @access  Protected
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    return res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

/************************************************************************/

// @route   POST api/auth/login
// @desc    Login user / Returning JWT
// @access  Public
// router.post('/login', (req, res) => {
//   //
//   // Validation
//   //
//   const { errors, isValid } = validateLoginInput(req.body);

//   if (!isValid) {
//     return res.status(400).json(errors);
//   }

//   const email = req.body.email;
//   const password = req.body.password;

//   // Find the user by email
//   User.findOne({ email }).then(user => {
//     // Check for user
//     if (!user) {
//       errors.email = 'User not found';
//       return res.status(404).json(errors);
//     }

//     // Check password
//     bcrypt.compare(password, user.password).then(isMatch => {
//       if (isMatch) {
//         // User matched
//         // Create JWT payload
//         const payload = {
//           id: user.id,
//           name: user.name,
//           avatar: user.avatar
//         };
//         // Sign the token
//         jwt.sign(
//           payload,
//           keys.secretOrKey,
//           { expiresIn: 3600 },
//           (err, token) => {
//             return res.json({
//               success: true,
//               token: `Bearer ${token}`
//             });
//           }
//         );
//       } else {
//         errors.password = 'Password incorrect';
//         return res.status(400).json(errors);
//       }
//     });
//   });
// });

/************************************************************************/

// @route   GET api/auth/current
// @desc    Return current user
// @access  Private
// router.get(
//   '/current',
//   passport.authenticate('jwt', { session: false }),
//   (req, res) => {
//     return res.json({
//       id: req.user.id,
//       name: req.user.name,
//       email: req.user.email
//     });
//   }
// );

/************************************************************************/

module.exports = router;
