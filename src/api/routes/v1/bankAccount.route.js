const express = require('express');
const { createBankAccount, getMyBankAccount, getAll } = require('../../controllers/bankAccount.controller');
const { authorize, ADMIN } = require('../../middlewares/auth');

const router = express.Router();

router.route('/').get(authorize(), getMyBankAccount).post(authorize(), createBankAccount);
router.route('/all').get(authorize(ADMIN), getAll);

module.exports = router;
