const router = require('express').Router();
const mongoose = require('mongoose');
const Profile = require('../models/Profile.model');
const Match = require('../models/Match.model');
const User = require('../models/User.model');

// POST - Create a new profile
router.post('/profiles', async (req, res, next) => {
  const {
    age,
    gender,
    location,
    therapySetup,
    psyApproach,
    price,
    description,
    addressStreet,
    addressCode,
    calendarLink,
    picture,
    user,
  } = req.body;

  try {
    // first check if there's a profile for the user in the DB
    const doesProfileExist = await Profile.find({ user });

    if (doesProfileExist.length === 0) {
      // create a new profile in the DB
      const newProfile = await Profile.create({
        age,
        gender,
        location,
        therapySetup,
        psyApproach,
        price,
        description,
        addressStreet,
        addressCode,
        calendarLink,
        picture,
        user,
      });

      // update the user with the profile
      await User.findByIdAndUpdate(
        user,
        { profile: newProfile._id },
        { new: true }
      );

      res.status(201).json(newProfile);
    } else {
      res
        .status(501)
        .json({ message: 'Already exists a profile for this user' });
    }
  } catch (error) {
    console.log('An error occurred creating the profile', error);
    next(error);
  }
});

// GET - Get all profiles
/* router.get('/profiles', async (req, res, next) => {
  try {
    const profiles = await Profile.find({}).populate('user');

    console.log('All profiles:', profiles);
    res.status(201).json(profiles);
  } catch (error) {
    console.log('An error occurred retrieving the profiles', error);
    next(error);
  }
}); */

// GET - Get one Profile per User & Match
router.get('/profiles/:userId/:matchId', async (req, res, next) => {
  const { matchId, userId } = req.params;

  try {
    const match = await Match.findById(matchId);
    let matchedProfile = {};

    // if user is client, I want to get the therapist profile
    if (userId === match.client.toString()) {
      matchedProfile = await Profile.findOne({
        user: match.therapist,
      }).populate('user');
    } else {
      // if user is therapist, I want to get the client profile
      matchedProfile = await Profile.findOne({ user: match.client }).populate(
        'user'
      );
    }

    res.status(201).json(matchedProfile);
  } catch (error) {
    console.log('An error occurred retrieving the profile', error);
    next(error);
  }
});

// GET - Get a single profile
router.get('/profiles/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    // throw an error if the id is not valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Id is not valid' });
    }

    const profile = await Profile.findById(id).populate('user');

    // to check if the id exists in the DB:
    if (!profile) {
      return res.status(404).json({ message: 'No profile found' });
    }

    res.json(profile);
  } catch (error) {
    console.log('An error occurred retrieving the profile', error);
    next(error);
  }
});

// PUT - Edit a single profile
router.put('/profiles/:id', async (req, res, next) => {
  const { id } = req.params;

  const {
    age,
    gender,
    location,
    therapySetup,
    psyApproach,
    price,
    description,
    addressStreet,
    addressCode,
    calendarLink,
    picture,
  } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Id is not valid' });
    }

    const updatedProfile = await Profile.findByIdAndUpdate(
      id,
      {
        age,
        gender,
        location,
        therapySetup,
        psyApproach,
        price,
        description,
        addressStreet,
        addressCode,
        calendarLink,
        picture,
      },
      { new: true }
    ).populate('user');

    if (!updatedProfile) {
      return res.status(404).json({ message: 'No profile found' });
    }

    res.json(updatedProfile);
  } catch (error) {
    console.log('An error occurred updating the profile', error);
    next(error);
  }
});

// GET User by ID
router.get('/users/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    // throw an error if the id is not valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Id is not valid' });
    }

    const user = await User.findById(id);

    // to check if the id exists in the DB:
    if (!user) {
      return res.status(404).json({ message: 'No user found' });
    }

    res.json(user);
  } catch (error) {
    console.log('An error occurred retrieving the user', error);
    next(error);
  }
});

module.exports = router;
