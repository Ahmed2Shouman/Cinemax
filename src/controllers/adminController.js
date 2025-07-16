import pool from '../config/db.js';

export const getAdminDashboard = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM movies');
    res.render('pages/dashboard', { movies: result.rows });
  } catch (err) {
    console.error('Error loading movies for dashboard:', err);
    res.status(500).send('Failed to load dashboard');
  }
};

export const getManageMoviesPage = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM movies');
    res.render('pages/manageMovies', { movies: result.rows });
  } catch (err) {
    console.error('Error loading movies for management:', err);
    res.status(500).send('Failed to load movie management page');
  }
};

export const getAddMoviePage = (req, res) => {
  res.render('pages/add-movie');
};

export const getEditMoviePage = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM movies WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Movie not found');
    }
    res.render('pages/edit-movie', { movie: result.rows[0] });
  } catch (err) {
    console.error('Error loading movie for editing:', err);
    res.status(500).send('Failed to load edit page');
  }
};
