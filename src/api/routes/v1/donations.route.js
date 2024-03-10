const express = require('express');
const {
  getDonations, getMyDonations, giveDonation,
} = require('../../controllers/donations.controller');
const { authorize, ADMIN } = require('../../middlewares/auth');

const router = express.Router();

router.route('/').get(authorize(), getMyDonations).post(authorize(), giveDonation);
router.route('/all').get(authorize(ADMIN), getDonations);
module.exports = router;
