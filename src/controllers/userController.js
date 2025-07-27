import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

export const getManageUsersPage = async (req, res) => {
    try {
        const user = req.session.user;
        const { role, search } = req.query;
        let usersQuery = 'SELECT * FROM users';
        const queryParams = [];
        let conditions = [];

        if (user.role === 'admin') {
            conditions.push("role = 'regular'");
        } else if (user.role === 'supervisor') {
            conditions.push("role IN ('admin', 'regular')");
        }

        if (role) {
            conditions.push(`role = $${queryParams.length + 1}`);
            queryParams.push(role);
        }

        if (search) {
            conditions.push(`username ILIKE $${queryParams.length + 1}`);
            queryParams.push(`%${search}%`);
        }

        if (conditions.length > 0) {
            usersQuery += ' WHERE ' + conditions.join(' AND ');
        }

        usersQuery += ' ORDER BY role';

        const result = await pool.query(usersQuery, queryParams);
        res.render('pages/manage-users', {
            users: result.rows,
            user,
            currentRole: role,
            currentSearch: search
        });
    } catch (err) {
        console.error('Error loading manage users page:', err);
        res.status(500).send('Failed to load the page');
    }
};

export const getAddUserPage = (req, res) => {
    res.render('pages/add-user', { user: req.session.user });
};

export const addUser = async (req, res) => {
    try {
        const { first_name, last_name, username, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            'INSERT INTO users (first_name, last_name, username, email, password, role) VALUES ($1, $2, $3, $4, $5, $6)',
            [first_name, last_name, username, email, hashedPassword, role]
        );
        res.redirect('/admin/users');
    } catch (err) {
        console.error('Error adding user:', err);
        res.status(500).send('Failed to add user');
    }
};

export const getEditUserPage = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        res.render('pages/edit-user', { userToEdit: result.rows[0], user: req.session.user });
    } catch (err) {
        console.error('Error loading edit user page:', err);
        res.status(500).send('Failed to load the page');
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, username, email, role } = req.body;
        await pool.query(
            'UPDATE users SET first_name = $1, last_name = $2, username = $3, email = $4, role = $5 WHERE id = $6',
            [first_name, last_name, username, email, role, id]
        );
        res.redirect('/admin/users');
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).send('Failed to update user');
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM users WHERE id = $1', [id]);
        res.redirect('/admin/users');
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).send('Failed to delete user');
    }
};
