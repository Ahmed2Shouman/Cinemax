import pool from '../config/db.js';
import * as theaterModel from '../models/theaterModel.js';

export const getAdminDashboard = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM movies');
    res.render('pages/dashboard', { movies: result.rows });
  } catch (err) {
    console.error('Error loading movies for dashboard:', err);
    res.status(500).send('Failed to load dashboard');
  }
};

export const getManageTheatersPage = async (req, res) => {
  try {
    const theaters = await theaterModel.getAllTheaters();
    res.render('pages/manageTheaters', { theaters });
  } catch (err) {
    console.error('Error loading theaters for management:', err);
    res.status(500).send('Failed to load theater management page');
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

export const getAddTheaterPage = (req, res) => {
  res.render('pages/add-theater');
};

export const getEditTheaterPage = async (req, res) => {
  try {
    const { id } = req.params;
    const theater = await theaterModel.getTheaterById(id);
    if (!theater) {
      return res.status(404).send('Theater not found');
    }
    res.render('pages/edit-theater', { theater });
  } catch (err) {
    console.error('Error loading theater for editing:', err);
    res.status(500).send('Failed to load edit theater page');
  }
};

export const editTheater = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, contact_number, features, image } = req.body;
    const featuresArray = Array.isArray(features) ? features : [features].filter(Boolean);
    await theaterModel.updateTheater(id, name, location, contact_number, featuresArray, image);
    res.redirect('/admin/theaters');
  } catch (err) {
    console.error('Error updating theater:', err);
    res.status(500).send('Failed to update theater');
  }
};

export const addTheater = async (req, res) => {
  try {
    const { name, location, contact_number, features, image } = req.body;
    const featuresArray = Array.isArray(features) ? features : [features].filter(Boolean);
    await theaterModel.createTheater(name, location, contact_number, featuresArray, image);
    res.redirect('/admin/theaters');
  } catch (err) {
    console.error('Error adding theater:', err);
    res.status(500).send('Failed to add theater');
  }
};
