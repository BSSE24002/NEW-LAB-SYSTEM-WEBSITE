// File: backend/src/controllers/productController.js
const db = require('../config/db');

// GET /api/products  — includes stock_quantity via LEFT JOIN with Inventory
const getAllProducts = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT p.*, c.name AS category_name,
                   COALESCE(i.stock_quantity, 0) AS stock_quantity
            FROM Products p
            LEFT JOIN Product_Categories c ON p.category_id = c.id
            LEFT JOIN Inventory i ON i.product_id = p.id
            ORDER BY p.created_at DESC;
        `);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// GET /api/products/:id — includes stock_quantity
const getProductById = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT p.*, c.name AS category_name,
                    COALESCE(i.stock_quantity, 0) AS stock_quantity
             FROM Products p
             LEFT JOIN Product_Categories c ON p.category_id = c.id
             LEFT JOIN Inventory i ON i.product_id = p.id
             WHERE p.id = $1`,
            [req.params.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// POST /api/products — creates product AND inventory row in a single transaction
const createProduct = async (req, res) => {
    const client = await db.getClient();
    try {
        const {
            category_id,
            name,
            description,
            sku,
            price,
            attributes,
            thumbnail_url,
            gallery_urls,
            initial_stock,
        } = req.body;

        if (!name || !sku || !price) {
            return res.status(400).json({ error: 'name, sku, and price are required.' });
        }

        await client.query('BEGIN');

        // 1. Insert the product
        const productResult = await client.query(
            `INSERT INTO Products (category_id, name, description, sku, price, attributes, thumbnail_url, gallery_urls)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *;`,
            [
                category_id || null,
                name,
                description || null,
                sku,
                price,
                attributes ? JSON.stringify(attributes) : '{}',
                thumbnail_url || null,
                gallery_urls ? JSON.stringify(gallery_urls) : '[]',
            ]
        );
        const newProduct = productResult.rows[0];

        // 2. Insert initial inventory record
        const stockValue = parseInt(initial_stock, 10) >= 0 ? parseInt(initial_stock, 10) : 0;
        await client.query(
            `INSERT INTO Inventory (product_id, stock_quantity)
             VALUES ($1, $2)
             ON CONFLICT (product_id) DO UPDATE SET stock_quantity = EXCLUDED.stock_quantity, last_updated = CURRENT_TIMESTAMP;`,
            [newProduct.id, stockValue]
        );

        await client.query('COMMIT');

        // Return product with stock attached
        res.status(201).json({ ...newProduct, stock_quantity: stockValue });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error creating product:', error);
        if (error.code === '23505') return res.status(409).json({ error: 'SKU already exists.' });
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.release();
    }
};

// PUT /api/products/:id
const updateProduct = async (req, res) => {
    try {
        const {
            category_id,
            name,
            description,
            sku,
            price,
            attributes,
            thumbnail_url,
            gallery_urls,
        } = req.body;

        const result = await db.query(
            `UPDATE Products
             SET category_id=$1, name=$2, description=$3, sku=$4, price=$5,
                 attributes=$6, thumbnail_url=$7, gallery_urls=$8
             WHERE id=$9 RETURNING *;`,
            [
                category_id || null,
                name,
                description || null,
                sku,
                price,
                attributes ? JSON.stringify(attributes) : '{}',
                thumbnail_url || null,
                gallery_urls ? JSON.stringify(gallery_urls) : '[]',
                req.params.id,
            ]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
    try {
        const result = await db.query('DELETE FROM Products WHERE id=$1 RETURNING id;', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
        res.status(200).json({ message: 'Product deleted successfully.' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };