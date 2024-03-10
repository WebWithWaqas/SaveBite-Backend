const ShareAbleItem = require('../models/shareableItem.model');
const Location = require('../models/location.model');
const { validateCoordinates } = require('../utils/helpers');

exports.createPost = async (req, res, next) => {
  try {
    const {
      itemType, itemDescription, isPrivate, location, pictures,
    } = req.body;

    if (!itemType || !itemDescription || !location) {
      throw new Error('itemType, itemDescription, and location are required');
    }

    const {
      latitude, longitude, city, country, postalCode,
    } = location;

    if (!latitude || !longitude || !city || !country || !postalCode) {
      throw new Error('latitude, longitude, city, country, and postalCode are required in location');
    }

    validateCoordinates({ latitude, longitude });

    const newLocation = new Location({
      coordinates: { type: 'Point', coordinates: [longitude, latitude] },
      city,
      country,
      postalCode,
      category: 'posts',
    });

    await newLocation.save();

    const post = new ShareAbleItem({
      itemType,
      itemDescription,
      isPrivate: Boolean(isPrivate),
      location: newLocation._id,
      pictures,
      user: req.user._id,
    });

    await post.save();

    res.status(201).json({
      message: 'Post created successfully',
      post,
    });
  } catch (err) {
    next(err);
  }
};

exports.getNearestPosts = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      throw new Error('latitude and longitude are required');
    }

    validateCoordinates({ latitude, longitude });

    const location = await Location.find({
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [Number(longitude), Number(latitude)],
          },
          $maxDistance: 10613.47, // Adjust maxDistance as needed
        },
      },
    });

    if (!location || !location.length) {
      throw new Error('No items found nearby');
    }

    const posts = await ShareAbleItem.find({
      location: { $in: location.map(l => l._id) },
      isDeleted: false,
    }).populate('user').populate('location');

    res.status(200).json({
      message: 'Posts found successfully',
      posts,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllPost = async (req, res, next) => {
  try {
    const posts = await ShareAbleItem.find().populate('user').populate('location');
    res.json({ posts });
  } catch (err) {
    next(err);
  }
};

exports.getAllPostmy = async (req, res, next) => {
  try {
    const posts = await ShareAbleItem.find({ user: req.user._id }).populate('user').populate('location');
    res.json({ posts });
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const deletedPost = await ShareAbleItem.findByIdAndRemove(postId);
    if (!deletedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    next(err);
  }
};
