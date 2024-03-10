const express = require('express');
const {
  create, get, approveReject, getMyCharityPools, getSingle,deletePool
} = require('../../controllers/charityPool.controller');
const { authorize, ADMIN } = require('../../middlewares/auth');

const router = express.Router();

router.route('/admin').get(authorize(ADMIN), get);

router.route('/my').get( authorize('user'),getMyCharityPools);
router.route('/delete/:id').delete(authorize('user'), deletePool);
router.route('/:id').get(getSingle);
router
  .route('/')
  .get(get)
  .post(authorize(), create);
router.route('/admin/approve-and-reject').post(authorize(ADMIN), approveReject);

module.exports = router;
