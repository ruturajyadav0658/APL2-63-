const express = require('express');
const { list, getById, create, update, remove, listMine } = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', list);
router.get('/:id', getById);
router.post('/', protect, authorize('provider', 'admin'), create);
router.put('/:id', protect, authorize('provider', 'admin'), update);
router.delete('/:id', protect, authorize('provider', 'admin'), remove);
router.get('/me/mine', protect, authorize('provider', 'admin'), listMine);

module.exports = router;


