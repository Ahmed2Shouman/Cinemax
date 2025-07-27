import pool from '../config/db.js';

export const createUser = async (first_name, last_name, username, email, password, role) => {
    const result = await pool.query(
        'INSERT INTO users (first_name, last_name, username, email, password, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [first_name, last_name, username, email, password, role]
    );
    return result.rows[0];
};

export const findUserByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
};

export const findUserByUsername = async (username) => {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
};

export const findUserById = async (id) => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
};
