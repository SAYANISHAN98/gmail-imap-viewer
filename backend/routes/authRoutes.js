const express = require('express');
const { login, callback } = require('../controllers/authController');

const router = express.Router();

router.get('/google', login);
router.get('/google/callback', callback);

module.exports = router;
