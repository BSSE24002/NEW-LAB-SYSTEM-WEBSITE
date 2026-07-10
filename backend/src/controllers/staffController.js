// File: backend/src/controllers/staffController.js
const db = require('../config/db');

const getAllStaff = async (req, res) => {
    try {
        const result = await db.query(
            'SELECT id, username, email, role, is_main_admin, created_at FROM Users ORDER BY created_at ASC;'
        );
        // Map to match frontend field names
        const staff = result.rows.map(u => ({
            id: u.id,
            name: u.username,
            email: u.email,
            role: u.role,
            is_main_admin: u.is_main_admin,
        }));
        res.status(200).json(staff);
    } catch (error) {
        console.error('Error fetching staff:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const createStaff = async (req, res) => {
    try {
        const { name, email, pin, role } = req.body;
        if (!name || !email || !pin) return res.status(400).json({ error: 'name, email, and pin are required.' });
        // In production: hash pin. For this project, store as-is for simplicity.
        const result = await db.query(
            `INSERT INTO Users (username, email, password_hash, pin, role)
             VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, role;`,
            [name, email, pin, pin, role || 'staff']
        );
        const u = result.rows[0];
        res.status(201).json({ id: u.id, name: u.username, email: u.email, role: u.role });
    } catch (error) {
        console.error('Error creating staff:', error);
        if (error.code === '23505') return res.status(409).json({ error: 'Email already exists.' });
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteStaff = async (req, res) => {
    try {
        // Prevent deleting main admin
        const check = await db.query('SELECT is_main_admin FROM Users WHERE id=$1', [req.params.id]);
        if (check.rows.length === 0) return res.status(404).json({ error: 'Staff not found.' });
        if (check.rows[0].is_main_admin) return res.status(403).json({ error: 'Cannot delete the main admin.' });

        await db.query('DELETE FROM Users WHERE id=$1;', [req.params.id]);
        res.status(200).json({ message: 'Staff removed.' });
    } catch (error) {
        console.error('Error deleting staff:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// POST /api/staff/login - simple PIN-based login
const loginStaff = async (req, res) => {
    try {
        const { email, pin } = req.body;
        if (!email || !pin) return res.status(400).json({ error: 'email and pin are required.' });
        const result = await db.query(
            'SELECT id, username, email, pin, role FROM Users WHERE email=$1;',
            [email]
        );
        if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials.' });
        const user = result.rows[0];
        if (user.pin !== pin && user.password_hash !== pin) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }
        res.status(200).json({ id: user.id, name: user.username, email: user.email, role: user.role });
    } catch (error) {
        console.error('Error logging in staff:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { getAllStaff, createStaff, deleteStaff, loginStaff };
