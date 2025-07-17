import pool from '../config/db.js';

export const createHall = async (theater_id, name, features, seat_rows, seat_columns, chairs_in_section) => {
  const result = await pool.query(
    'INSERT INTO halls (theater_id, name, features, seat_rows, seat_columns, chairs_in_section) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [theater_id, name, features, seat_rows, seat_columns, chairs_in_section]
  );
  return result.rows[0];
};

export const getHallsByTheaterId = async (theater_id) => {
  const result = await pool.query('SELECT * FROM halls WHERE theater_id = $1', [theater_id]);
  return result.rows;
};

export const getHallById = async (id) => {
  const result = await pool.query('SELECT * FROM halls WHERE id = $1', [id]);
  return result.rows[0];
};

export const updateHall = async (id, name, features, seat_rows, seat_columns, chairs_in_section) => {
  const result = await pool.query(
    'UPDATE halls SET name = $1, features = $2, seat_rows = $3, seat_columns = $4, chairs_in_section = $5 WHERE id = $6 RETURNING *',
    [name, features, seat_rows, seat_columns, chairs_in_section, id]
  );
  return result.rows[0];
};

export const deleteHall = async (id) => {
  await pool.query('DELETE FROM halls WHERE id = $1', [id]);
  return { message: 'Hall deleted successfully' };
};
