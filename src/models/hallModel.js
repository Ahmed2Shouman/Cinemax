import pool from '../config/db.js';

export const createHall = async (theater_id, name, features, seat_rows, seat_columns, chairs_in_section, price_per_seat) => {
    const result = await pool.query(
        'INSERT INTO halls (theater_id, name, features, seat_rows, seat_columns, chairs_in_section, price_per_seat) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [theater_id, name, features, seat_rows, seat_columns, chairs_in_section, price_per_seat]
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

export const updateHall = async (id, name, features, seat_rows, seat_columns, chairs_in_section, price_per_seat) => {
    const result = await pool.query(
        'UPDATE halls SET name = $1, features = $2, seat_rows = $3, seat_columns = $4, chairs_in_section = $5, price_per_seat = $6 WHERE id = $7 RETURNING *',
        [name, features, seat_rows, seat_columns, chairs_in_section, price_per_seat, id]
    );
    return result.rows[0];
};

export const deleteHall = async (id) => {
  await pool.query('DELETE FROM halls WHERE id = $1', [id]);
  return { message: 'Hall deleted successfully' };
};

export const getAllHalls = async () => {
  const result = await pool.query('SELECT * FROM halls');
  return result.rows;
};
