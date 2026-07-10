const express = require('express');
const router = express.Router();
const { getAllTransactions, processCheckout, refundTransaction } = require('../controllers/posController');

router.get('/', getAllTransactions);
router.post('/checkout', processCheckout);
router.patch('/:id/refund', refundTransaction);

module.exports = router;
