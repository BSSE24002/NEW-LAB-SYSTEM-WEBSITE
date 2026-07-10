const express = require('express');
const router = express.Router();
const { getAllStaff, createStaff, deleteStaff, loginStaff } = require('../controllers/staffController');

router.get('/', getAllStaff);
router.post('/', createStaff);
router.post('/login', loginStaff);
router.delete('/:id', deleteStaff);

module.exports = router;
