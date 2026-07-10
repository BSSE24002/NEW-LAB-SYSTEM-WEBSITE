const express = require('express');
const router = express.Router();
const { getAllOrders, getOrderById, createOrder, updateOrderStatus, updateTracking, deleteOrder, trackOrder } = require('../controllers/orderController');

router.get('/', getAllOrders);
router.get('/track/:orderId', trackOrder);    // public - must be before /:id
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.patch('/:id/status', updateOrderStatus);
router.patch('/:id/tracking', updateTracking);
router.delete('/:id', deleteOrder);

module.exports = router;
