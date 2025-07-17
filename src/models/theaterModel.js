import pool from '../config/db.js';

export const getAllTheaters = async () => {
  const result = await pool.query('SELECT * FROM theaters');
  return result.rows;
};

export const getTheaterById = async (id) => {
  const result = await pool.query('SELECT * FROM theaters WHERE id = $1', [id]);
  return result.rows[0];
};

export const createTheater = async (name, location, contact_number, features, image) => {
  const result = await pool.query(
    'INSERT INTO theaters (name, location, contact_number, features, image) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [name, location, contact_number, features, image]
  );
  return result.rows[0];
};

export const updateTheater = async (id, name, location, contact_number, features, image) => {
  const result = await pool.query(
    'UPDATE theaters SET name = $1, location = $2, contact_number = $3, features = $4, image = $5 WHERE id = $6 RETURNING *',
    [name, location, contact_number, features, image, id]
  );
  return result.rows[0];
};

export const deleteTheater = async (id) => {
  await pool.query('DELETE FROM theaters WHERE id = $1', [id]);
  return { message: 'Theater deleted successfully' };
};
