const express = require('express');
const router = express.Router();

// @route   GET api/auth/test
// @desc    Tests Auth route
// @access  Public
router.get('/test', (req, res) => res.json({ message: 'Auth route works' }));

module.exports = router;
