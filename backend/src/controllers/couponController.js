// File: backend/src/controllers/couponController.js
const db = require('../config/db');

const getAllCoupons = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM Coupons ORDER BY created_at DESC;');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching coupons:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const createCoupon = async (req, res) => {
    try {
        const { code, type, value } = req.body;
        if (!code || !value) return res.status(400).json({ error: 'code and value are required.' });
        const result = await db.query(
            `INSERT INTO Coupons (code, type, value) VALUES ($1, $2, $3) RETURNING *;`,
            [code.toUpperCase(), type || 'percentage', value]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating coupon:', error);
        if (error.code === '23505') return res.status(409).json({ error: 'Coupon code already exists.' });
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteCoupon = async (req, res) => {
    try {
        const result = await db.query('DELETE FROM Coupons WHERE id=$1 RETURNING id;', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Coupon not found.' });
        res.status(200).json({ message: 'Coupon deleted.' });
    } catch (error) {
        console.error('Error deleting coupon:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// POST /api/coupons/validate - validate a coupon code
const validateCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) return res.status(400).json({ error: 'code is required.' });
        const result = await db.query(
            'SELECT * FROM Coupons WHERE code=$1 AND active=TRUE;',
            [code.toUpperCase()]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Invalid or expired coupon code.' });
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error validating coupon:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { getAllCoupons, createCoupon, deleteCoupon, validateCoupon };
