const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const auth = require('../../middleware/auth');

// Load User model
const User = require('../../models/User');

// Load Profile model
const Profile = require('../../models/Profile');

/************************************************************************/

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }
    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

/************************************************************************/

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/all', (req, res) => {
  const errors = {};

  Profile.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = 'There are no profiles';
        return res.status(404).json(errors);
      }

      return res.json(profiles);
    })
    .catch(err => res.json(err));
});

/************************************************************************/

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get('/handle/:handle', (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }

      return res.json(profile);
    })
    .catch(err => res.json(err));
});

/************************************************************************/

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }

      return res.json(profile);
    })
    .catch(err => res.json({ message: 'There is no profile for this user' }));
});

/************************************************************************/

// @route   POST api/profile
// @desc    Create or edit user profile
// @access  Private
router.post('/', auth, (req, res) => {
  // Get fields
  const profileFields = {};
  profileFields.social = {};
  profileFields.user = req.user.id;

  const standardFields = [
    'handle',
    'company',
    'company',
    'location',
    'website',
    'bio',
    'status',
    'githubUsername'
  ];

  const socialFields = [
    'youtube',
    'twitter',
    'facebook',
    'linkedIn',
    'instagram'
  ];

  // Set the profile fields
  standardFields.forEach(field => {
    if (req.body[field]) profileFields[field] = req.body[field];
    else {
      // If the the req.body.field is blank
      // Set the profile field to an empty string except for the handle
      if (field !== 'handle') profileFields[field] = '';
    }
  });

  // Skills - Split into array
  if (typeof req.body.skills !== 'undefined') {
    profileFields.skills = req.body.skills.split(',');
  }

  // Set the social fields
  socialFields.forEach(field => {
    if (req.body[field]) profileFields.social[field] = req.body[field];
  });

  // Search for the User's Profile using logged in user's id
  Profile.findOne({ user: req.user.id }).then(profile => {
    //
    // If profile already exists
    //
    if (profile) {
      //
      // Check if handle exists
      //
      Profile.findOne({ handle: profileFields.handle }).then(profile => {
        if (profile) {
          errors.handle = 'Handle already exists';
          return res.status(400).json(errors);
        }
        // Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        )
          .then(profile => res.json(profile))
          .catch(errors => res.json(errors));
      });
    } else {
      //
      // Create new profile
      // Check if handle exists
      //
      Profile.findOne({ handle: profileFields.handle }).then(profile => {
        if (profile) {
          errors.handle = 'Profile handle already exists';
          return res.status(400).json(errors);
        }

        // Save Profile
        new Profile(profileFields).save().then(profile => res.json(profile));
      });
    }
  });
});

/************************************************************************/

// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post('/experience', auth, (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      const newExp = {};
      const expFields = [
        'title',
        'company',
        'location',
        'from',
        'to',
        'current',
        'description'
      ];

      expFields.forEach(field => {
        if (req.body[field]) newExp[field] = req.body[field];
      });

      // Add to front of experience array
      profile.experience.unshift(newExp);
      // Saves a new Experience object within the current Profile
      profile
        .save()
        .then(profile => res.json(profile))
        .catch(err => res.json(err));
    })
    .catch(err => res.json(err));
});

/************************************************************************/

// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private
router.post('/education', auth, (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      const newEdu = {};
      const eduFields = [
        'school',
        'degree',
        'fieldOfStudy',
        'from',
        'to',
        'current',
        'description'
      ];

      eduFields.forEach(field => {
        if (req.body[field]) newEdu[field] = req.body[field];
      });

      // Add to front of experience array
      profile.education.unshift(newEdu);
      // Saves a new Education object within the current Profile
      profile
        .save()
        .then(profile => res.json(profile))
        .catch(err => res.json(err));
    })
    .catch(err => res.json(err));
});

/************************************************************************/

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete('/experience/:exp_id', auth, (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      const filteredExperienceArray = profile.experience.filter(
        experience => experience.id != req.params.exp_id
      );

      if (filteredExperienceArray.length !== profile.experience.length) {
        profile.experience = filteredExperienceArray;
        profile
          .save()
          .then(profile => res.json(profile))
          .catch(err => res.json(err));
      }
    })
    .catch(err => res.json(err));
});

/************************************************************************/

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private
router.delete('/education/:edu_id', auth, (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      // Create a new array without the education to be deleted
      const filteredEducationArray = profile.education.filter(
        education => education.id !== req.params.edu_id
      );

      // If the two arrays are same length, no education was deleted
      if (filteredEducationArray.length !== profile.education.length) {
        profile.education = filteredEducationArray;
        profile
          .save()
          .then(profile => res.json(profile))
          .catch(err => res.json(err));
      }
    })
    .catch(err => res.json(err));
});

/************************************************************************/

// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete('/', auth, (req, res) => {
  Profile.findOneAndRemove({ user: req.user.id })
    .then(() => {
      User.findByIdAndRemove(req.user.id)
        .then(() => res.json({ success: true }))
        .catch(err => res.json(err));
    })
    .catch(err => res.json(err));
});

/************************************************************************/
module.exports = router;
