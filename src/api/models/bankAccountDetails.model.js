const mongoose = require('mongoose');
const paginate = require('mongoose-paginate-v2');
/**
 * User Schema
 * @private
 */
const bankAccountDetailsSchema = new mongoose.Schema(
  {
    bankName: {
      type: String,
      required: true,
    },
    accountTitle: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: Number,
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  },
);

bankAccountDetailsSchema.plugin(paginate);

/**
 * @typedef ShareAbleItem
 */
module.exports = mongoose.model('BankAccountDetail', bankAccountDetailsSchema);
