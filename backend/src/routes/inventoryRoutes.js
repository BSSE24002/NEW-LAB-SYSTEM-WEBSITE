const express = require('express');
const router = express.Router();
const { getAllInventory, updateInventory, setStock } = require('../controllers/inventoryController');

router.get('/', getAllInventory);
router.post('/', updateInventory);
router.patch('/:productId', setStock);

module.exports = router;