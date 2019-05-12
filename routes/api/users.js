const express = require('express');
const router = express.Router();

/************************************************************************/

// @route   GET api/users/all
// @desc    Get all users
// @access  Public
router.get('/all', (req, res) => {
  // const errors = {};
  // Profile.find()
  //   .populate('user', ['name', 'avatar'])
  //   .then(profiles => {
  //     if (!profiles) {
  //       errors.noprofile = 'There are no profiles';
  //       return res.status(404).json(errors);
  //     }
  //     return res.json(profiles);
  //   })
  //   .catch(err => res.json(err));
});

/************************************************************************/
module.exports = router;
