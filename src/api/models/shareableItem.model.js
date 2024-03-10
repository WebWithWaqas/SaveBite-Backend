const mongoose = require('mongoose');

/**
 * itemType enum
 */
const itemType = ['food', 'cloths', 'others'];

/**
 * User Schema
 * @private
 */
const shareAbleItemSchema = new mongoose.Schema(
  {
    itemType: {
      type: String,
      enum: itemType,
      required: true,
    },
    itemDescription: {
      type: String,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isPrivate: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
    pictures: [String],
  },
  {
    timestamps: true,
  },
);

/**
 * @typedef ShareAbleItem
 */
module.exports = mongoose.model('ShareAbleItem', shareAbleItemSchema);
