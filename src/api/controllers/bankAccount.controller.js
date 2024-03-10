const BankAccount = require('../models/bankAccountDetails.model');

exports.getMyBankAccount = async (req, res, next) => {
  try {
    const bankAccount = await BankAccount.find({ user: req.user._id });
    return res.json({ bankAccount });
  } catch (err) {
    return next(err);
  }
};

exports.createBankAccount = async (req, res, next) => {
  try {
    if (req.user.role === 'admin') throw new Error('Admin cannot create bank account');
    const { bankName, accountTitle, accountNumber } = req.body;
    if (!bankName || !accountTitle || !accountNumber) {
      throw new Error('bankName, accountTitle and accountNumber are required');
    }
    const bankAccount = new BankAccount({
      bankName,
      accountTitle,
      accountNumber,
      user: req.user._id,
    });
    req.user.bankAccount.push(bankAccount._id);
    req.user.save();
    await bankAccount.save();
    return res.json({ message: 'success', bankAccount });
  } catch (err) {
    return next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const { perPage, page } = req.query;
    const options = { page: page || 1, limit: perPage || 10 };
    const bankAccounts = await BankAccount.paginate({}, options);
    return res.json({ bankAccounts });
  } catch (err) {
    return next(err);
  }
};
