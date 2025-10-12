const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth.middleware');
const { analyzeCrop, getReports } = require('../controllers/crop.controller');

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

router.post('/analyze', [auth, upload.single('cropImage')], analyzeCrop);
router.get('/reports', auth, getReports);

module.exports = router;