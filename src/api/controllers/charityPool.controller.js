const CharityPool = require('../models/charityPool.model');
const Donation = require('../models/donation.model');

exports.get = async (req, res, next) => {
  try {
    const query = {};
    const {
      isApproved,
      isRejected,
      isCompleted,
      search,
      toDate,
      fromDate,
      page,
      perPage,
    } = req.query;
    if (req.user && req.user.role === 'admin') {
      if (isApproved) {
        query.isApproved = isApproved === 'true';
      }
      if (isRejected) {
        query.isRejected = isRejected === 'true'
      };
    } else {
      query.isApproved = true;
    }

    if (isCompleted && isCompleted !== 'all') { query.isCompleted = isCompleted === 'true'; }

    if (search) query.description = { $regex: search, $options: 'i' };

    if (toDate) query.createdAt = { $lte: new Date(toDate) };
    if (fromDate) query.createdAt = { $gte: new Date(fromDate) };
    const data2 = await CharityPool.find().populate('user').populate('bankAccount');
    // const data = await CharityPool.paginate(query, {
    //   page: page || 1,
    //   limit: perPage || 10,
    //   sort: { createdAt: -1 },
    //   populate: ['user', 'bankAccount'],
    // });
    const data={
      docs:[...data2]
    }
    // console.log(data2)
    res.json({ data, message: 'success' });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getSingle = async (req, res, next) => {
  const _id = req.params.id;
  const charityPool = await CharityPool.findById(_id)
    .lean()
    .populate('user', 'name')
  if (!charityPool) {
    return next(new Error('charityPool not found'));
  }
  const donations = await Donation.find({
    charityPool: _id,
    verified: true,
  }).populate('user', 'name');
  charityPool.donations = donations;
  return res.json({ data: charityPool });
};
exports.create = async (req, res, next) => {
  try {
    const { description, moneyRequired, bankAccount } = req.body;
    if (!description || !moneyRequired) {
      throw new Error('description and money needed are required');
    }
    if (!bankAccount) throw new Error('Bank Account is Required');
    const charityPool = new CharityPool({
      description,
      moneyRequired,
      user: req.user._id,
      bankAccount,
    });
    await charityPool.save();
    return res.json({ message: 'success', charityPool });
  } catch (err) {
    return next(err);
  }
};

exports.getMyCharityPools = async (req, res, next) => {
  try {
    const { perPage, page } = req.query;
    // console.log('waqas with query data 2',req.query,req.user)
    
    const charityPools = await CharityPool.find({user: req.user._id}).populate('user');
    // const newcharityPools = charityPools.filter((item)=>{
    //   console.log('waqas ids',item.user._id,req.user._id)
    //   if(item.user._id===req.user._id){
    //     return true
    //   }else{
    //     return false
    //   }
    // })
    // console.log('waqas filtre',newcharityPools)
    return res.json({ charityPools });
  } catch (err) {
    return next(err);
  }
};

// ADMIN CONTROLLER;
exports.approveReject = async (req, res, next) => {
  try {
    const { id, isApproved } = req.body;
    if (!id || isApproved === null || isApproved === undefined) {
      throw new Error('id and isApproved are required');
    }
    const charityPool = await CharityPool.findById(id);
    if (!charityPool) {
      throw new Error('charityPool not found');
    }
    if (charityPool.isApproved || charityPool.isRejected) {
      throw new Error('charityPool already approved or rejected');
    }
    if (isApproved) {
      charityPool.isApproved = true;
      charityPool.approvedBy = req.user._id;
    } else {
      charityPool.isRejected = true;
      charityPool.rejectedBy = req.user._id;
    }
    await charityPool.save();
    return res.json({ message: 'success', charityPool });
  } catch (err) {
    return next(err);
  }
};

exports.deletePool = async (req, res, next) => {
  try {
    const poolId = req.params.id;
    const deletedPool = await CharityPool.findByIdAndRemove(poolId);
    if (!deletedPool) {
      return res.status(404).json({ error: 'Pool not found' });
    }
    res.json({ message: 'Pool deleted successfully' });
  } catch (err) {
    next(err);
  }
};