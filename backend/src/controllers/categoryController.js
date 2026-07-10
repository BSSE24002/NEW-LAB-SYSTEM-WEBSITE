// File: backend/src/controllers/categoryController.js
const db = require('../config/db');

const getAllCategories = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM Product_Categories ORDER BY name ASC;');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) return res.status(400).json({ error: 'Category name is required.' });
        const result = await db.query(
            'INSERT INTO Product_Categories (name, description) VALUES ($1, $2) RETURNING *;',
            [name, description || null]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const result = await db.query(
            'UPDATE Product_Categories SET name=$1, description=$2 WHERE id=$3 RETURNING *;',
            [name, description || null, req.params.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Category not found.' });
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const result = await db.query('DELETE FROM Product_Categories WHERE id=$1 RETURNING id;', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Category not found.' });
        res.status(200).json({ message: 'Category deleted.' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { getAllCategories, createCategory, updateCategory, deleteCategory };
