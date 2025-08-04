import pool from '../config/db.js';
import { fileURLToPath } from 'url';

export const getHomePage = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM movies WHERE status = 'NOW SHOWING'");
    res.render('pages/index', { movies: result.rows });
  } catch (err) {
    console.error('Error loading movies:', err);
    res.status(500).send('Failed to load movies');
  }
};

export const getBookPage = async (req, res) => {
  const movieName = req.query.name;
  try {
    const movieResult = await pool.query('SELECT * FROM movies WHERE title ILIKE $1', [movieName]);
    const movie = movieResult.rows[0];

    if (!movie) {
      return res.status(404).send('Movie not found');
    }

    const theatersResult = await pool.query('SELECT * FROM theaters');
    const theaters = theatersResult.rows;

    res.render('pages/book', { movie, theaters });
  } catch (err) {
    console.error('Error loading movie for booking:', err);
    res.status(500).send('Failed to load movie data');
  }
};

export const getMoviesPage = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM movies');
    res.render('pages/movies', { movies: result.rows });
  } catch (err) {
    console.error('Error loading movies:', err);
    res.status(500).send('Failed to load movies');
  }
};

export const getMoviesApi = async (req, res) => {
  try {
    const { genre, status } = req.query;
    let query = 'SELECT * FROM movies';
    const params = [];
    let paramIndex = 1;

    if (genre && genre !== 'All Genres') {
      query += ` WHERE genre ILIKE $${paramIndex}`;
      params.push(genre);
      paramIndex++;
    }

    if (status && status !== 'ALL') {
      query += params.length > 0 ? ' AND ' : ' WHERE ';
      query += `status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error loading movies:', err);
    res.status(500).send('Failed to load movie data');
  }
};

export const addMovie = async (req, res) => {
  try {
    const { title, genre, rating, duration, trailer, description, poster, banner, release_date } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    const movieReleaseDate = new Date(release_date);
    movieReleaseDate.setHours(0, 0, 0, 0); // Normalize to start of day

    const status = movieReleaseDate > today ? 'UPCOMING' : 'NOW SHOWING';

    const query = `
      INSERT INTO movies (title, genre, rating, duration, trailer, description, poster_url, banner_url, release_date, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `;
    const values = [title, genre, rating, duration + ' min', trailer, description, poster, banner, release_date, status];

    await pool.query(query, values);

    res.redirect('/admin');
  } catch (err) {
    console.error('Failed to save movie:', err);
    res.status(500).send('Internal Server Error');
  }
};


export const deleteMovie = async (req, res) => {
  try {
    const movieId = req.params.id;

    // Delete the movie record from the database
    const deleteResult = await pool.query('DELETE FROM movies WHERE id = $1', [movieId]);
    if (deleteResult.rowCount === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (err) {
    console.error('Error deleting movie:', err);
    res.status(500).json({ error: 'Failed to delete movie' });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const movieId = req.params.id;
    const { title, genre, rating, duration, trailer, description, poster, banner, release_date } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    const movieReleaseDate = new Date(release_date);
    movieReleaseDate.setHours(0, 0, 0, 0); // Normalize to start of day

    const status = movieReleaseDate > today ? 'UPCOMING' : 'NOW SHOWING';

    // Update the movie record in the database
    const query = `
      UPDATE movies
      SET title = $1, genre = $2, rating = $3, duration = $4, trailer = $5,
          description = $6, poster_url = $7, banner_url = $8, release_date = $9, status = $10
      WHERE id = $11
    `;
    const values = [title, genre, rating, duration + ' min', trailer, description, poster, banner, release_date, status, movieId];

    const result = await pool.query(query, values);
    if (result.rowCount === 0) {
      return res.status(404).send('Movie not found');
    }

    res.redirect('/admin');
  } catch (err) {
    console.error('Failed to update movie:', err);
    res.status(500).send('Internal Server Error');
  }
};
