import pool from '../config/db.js';

export const getAllTheaters = async () => {
  const result = await pool.query('SELECT * FROM theaters');
  return result.rows.map(theater => {
    const cleanedFeatures = theater.features ? theater.features.replace(/[{}"']/g, '') : '';
    return {
      ...theater,
      features: cleanedFeatures ? cleanedFeatures.split(',').map(f => f.trim()) : []
    };
  });
};

export const getTheaterById = async (id) => {
  const result = await pool.query('SELECT * FROM theaters WHERE id = $1', [id]);
  const theater = result.rows[0];
  if (theater) {
    const cleanedFeatures = theater.features ? theater.features.replace(/[{}"']/g, '') : '';
    return {
      ...theater,
      features: cleanedFeatures ? cleanedFeatures.split(',').map(f => f.trim()) : []
    };
  }
  return null;
};

export const createTheater = async (name, location, contact_number, features, image) => {
  const featuresString = Array.isArray(features) ? features.join(',') : features;
  const result = await pool.query(
    'INSERT INTO theaters (name, location, contact_number, features, image) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [name, location, contact_number, featuresString, image]
  );
  return result.rows[0];
};

export const updateTheater = async (id, name, location, contact_number, features, image) => {
  const featuresString = Array.isArray(features) ? features.join(',') : features;
  const result = await pool.query(
    'UPDATE theaters SET name = $1, location = $2, contact_number = $3, features = $4, image = $5 WHERE id = $6 RETURNING *',
    [name, location, contact_number, featuresString, image, id]
  );
  return result.rows[0];
};

export const deleteTheater = async (id) => {
  await pool.query('DELETE FROM theaters WHERE id = $1', [id]);
  return { message: 'Theater deleted successfully' };
};
