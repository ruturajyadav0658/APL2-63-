const express = require('express');
const { listForService, create } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router({ mergeParams: true });

router.get('/:serviceId', listForService);
router.post('/:serviceId', protect, create);

module.exports = router;


