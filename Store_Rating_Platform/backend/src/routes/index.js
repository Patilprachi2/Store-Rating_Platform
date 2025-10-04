const express = require('express');
const router = express.Router();
const auth = require('./auth');
const users = require('./users');
const stores = require('./stores');
const ratings = require('./ratings');

router.use('/auth', auth);
router.use('/users', users);
router.use('/stores', stores);
router.use('/ratings', ratings);

module.exports = router;
