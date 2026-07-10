const express = require('express');
const router = express.Router();
const { getAllCoupons, createCoupon, deleteCoupon, validateCoupon } = require('../controllers/couponController');

router.get('/', getAllCoupons);
router.post('/', createCoupon);
router.post('/validate', validateCoupon);
router.delete('/:id', deleteCoupon);

module.exports = router;
