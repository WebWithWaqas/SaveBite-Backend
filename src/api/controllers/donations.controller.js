const Donations = require('../models/donation.model');
const CharityPool = require('../models/charityPool.model');

exports.giveDonation = async (req, res, next) => {
  try {
    const {
      moneyDonated, paymentMethod, prove, charityPool,
    } = req.body;
    if (!moneyDonated || !paymentMethod || !prove || !charityPool) {
      return res.status(400).json({
        message: 'Please fill all the fields',
      });
    }
    const charityPoolDoc = await CharityPool.findById(charityPool);
    if (!charityPoolDoc) { return res.status(400).json({ message: 'Charity Pool not found' }); }
    const donation = await Donations.create({
      moneyDonated,
      paymentMethod,
      prove,
      charityPool,
      donationFor: charityPoolDoc.user,
      user: req.user._id,
    });
    return res.status(201).json({
      message: 'Donation created successfully',
      donation,
    });
  } catch (err) {
    return next(err);
  }
};

exports.getMyDonations = async (req, res, next) => {
  try {
    const donations = await Donations.find({ user: req.user._id });
    return res.status(200).json({
      message: 'Donations retrieved successfully',
      donations,
    });
  } catch (err) {
    return next(err);
  }
};

exports.verifyDonation = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: 'Please provide the id' });
    }
    const donation = await Donations.findById(id);
    if (!donation) {
      return res.status(400).json({ message: 'Donation not found' });
    }
    const charityPool = await CharityPool.findById(donation.charityPool);
    if (!charityPool) {
      return res.status(400).json({ message: 'Charity Pool not found' });
    }
    if (donation.isVerified) {
      return res.status(400).json({ message: 'Donation already verified' });
    }
    if (charityPool.user.toString() !== req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: 'You are not the owner of the charity pool' });
    }
    donation.isVerified = true;
    await donation.save();
    res.status(200).json({ message: 'Donation verified successfully' });
    const donationSum = await Donations.aggregate([
      { $match: { charityPool: charityPool._id } },
      { $group: { _id: '$charityPool', sum: { $sum: '$moneyDonated' } } },
    ]);
    const charityPoolSum = (donationSum[0] && donationSum[0].sum) || 0;
    if (charityPoolSum >= Number(charityPool.moneyRequired)) {
      charityPool.isCompleted = true;
      await charityPool.save();
    }
    return null;
  } catch (err) {
    return next(err);
  }
};

// Admin Route for getting all donations
exports.getDonations = async (req, res, next) => {
  try {
    const { perPage, page } = req.query;
    const donations = await Donations.paginate(
      {},
      { page: page || 1, limit: perPage || 10 },
    );
    return res.status(200).json({
      message: 'Donations retrieved successfully',
      donations,
    });
  } catch (err) {
    return next(err);
  }
};
