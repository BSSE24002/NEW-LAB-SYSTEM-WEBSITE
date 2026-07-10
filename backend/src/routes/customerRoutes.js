const express = require('express');
const router = express.Router();
const { getAllCustomers, getCustomerByEmail, getCustomerOrders, registerCustomer } = require('../controllers/customerController');

router.get('/', getAllCustomers);
router.get('/:email', getCustomerByEmail);
router.get('/:email/orders', getCustomerOrders);
router.post('/register', registerCustomer);

module.exports = router;
