const express = require('express');
const router = express.Router();
const { analyzeCrop, getReports } = require('../controllers/crop.controller');
const auth = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// POST /api/crop/analyze - Submits a new crop analysis
router.post('/analyze', auth, upload.single('image'), analyzeCrop);

// GET /api/crop - Gets all reports for the logged-in user
router.get('/', auth, getReports);

module.exports = router;