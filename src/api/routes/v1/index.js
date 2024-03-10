const express = require('express');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const charityPoolRoutes = require('./charityPool.route');
const bankAccountRoutes = require('./bankAccount.route');
const donationRoutes = require('./donations.route');
const postRoutes = require('./post.route');
const chat = require('./chat');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (_req, res) => res.send('OK'));

/**
 * GET v1/docs
 */
router.use('/docs', express.static('docs'));

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/charity-pool', charityPoolRoutes);
router.use('/bank-account', bankAccountRoutes);
router.use('/donations', donationRoutes);
router.use('/posts', postRoutes);
router.use('/chat', chat);

module.exports = router;
