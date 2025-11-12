const express = require('express');
const { listMy, create, cancel, listForProvider, setStatus } = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.get('/me', listMy);
router.post('/', create);
router.patch('/:id/cancel', cancel);
router.get('/provider', authorize('provider', 'admin'), listForProvider);
router.patch('/:id/status', authorize('provider', 'admin'), setStatus);

module.exports = router;


