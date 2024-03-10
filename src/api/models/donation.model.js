const mongoose = require('mongoose');
const paginate = require('mongoose-paginate-v2');

/**
 * User Schema
 * @private
 */

const donationType = ['USER', 'DONATION_POOL'];
const donationSchema = new mongoose.Schema(
  {
    moneyDonated: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    // donationType: {
    //   type: String,
    //   enuum: donationType,
    //   required: true,
    // },
    prove: [String], // array of url(strings) of prove  of donation
    verified: { type: Boolean, default: false }, // if the donation is verified by the reciver
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    charityPool: { type: mongoose.Schema.Types.ObjectId, ref: 'CharityPool' },
    donationFor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
donationSchema.plugin(paginate);

/**
 * @typedef ShareAbleItem
 */
module.exports = mongoose.model('Donation', donationSchema);
