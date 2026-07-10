// File: backend/src/controllers/discountController.js
const db = require('../config/db');

const getAllDiscounts = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM Discounts ORDER BY created_at DESC;');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching discounts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const createDiscount = async (req, res) => {
    try {
        const { name, target, target_value, type, value } = req.body;
        if (!name || !value) return res.status(400).json({ error: 'name and value are required.' });
        const result = await db.query(
            `INSERT INTO Discounts (name, target, target_value, type, value)
             VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
            [name, target || 'all', target_value || null, type || 'percentage', value]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating discount:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteDiscount = async (req, res) => {
    try {
        const result = await db.query('DELETE FROM Discounts WHERE id=$1 RETURNING id;', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Discount not found.' });
        res.status(200).json({ message: 'Discount deleted.' });
    } catch (error) {
        console.error('Error deleting discount:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { getAllDiscounts, createDiscount, deleteDiscount };
