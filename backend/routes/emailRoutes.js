const express = require('express');
const { syncEmails, getEmails, searchEmails } = require('../controllers/emailController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/sync', syncEmails);
router.get('/', getEmails);
router.get('/search', searchEmails);

module.exports = router;
