const mongoose = require('mongoose');
const paginate = require('mongoose-paginate-v2');

/**
 * User Schema
 * @private
 */
const charityPoolSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    moneyRequired: {
      type: Number,
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isRejected: {
      type: Boolean,
      default: false,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    bankAccount: {
      type: mongoose.Schema.Types.ObjectId, ref: 'BankAccountDetail', required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    publicPictures: [String],
    privatePictures: [String],
  },
  {
    timestamps: true,
  },
);
charityPoolSchema.index({
  user: 1, isApproved: 1, isRejected: 0, isCompleted: 1,
});
charityPoolSchema.plugin(paginate);
/**
 * @typedef ShareAbleItem
 */
module.exports = mongoose.model('CharityPool', charityPoolSchema);
