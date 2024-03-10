const mongoose = require('mongoose');

/**
 * Location Schema
 * @private
 */
const locationSchema = new mongoose.Schema(
  {
    coordinates: new mongoose.Schema({
      type: { type: String },
      coordinates: [],
    }),
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    postalCode: {
      type: Number,
      required: true,
    },
    category: { type: String, enum: ['posts'] },
    isAvailabe: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);
locationSchema.index({ coordinates: '2dsphere' });
// locationSchema.index({ 'coordinates.coordinates': '2dsphere' });
/**
 * @typedef Location
 */
module.exports = mongoose.model('Location', locationSchema);
