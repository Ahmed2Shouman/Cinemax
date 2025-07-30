import pool from '../config/db.js';
import * as theaterModel from '../models/theaterModel.js';
import * as hallModel from '../models/hallModel.js';

export const getAdminDashboard = async (req, res) => {
  try {
    const moviesResult = await pool.query('SELECT * FROM movies');
    const bookingsResult = await pool.query('SELECT COUNT(*) FROM bookings');
    const usersResult = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'regular'");

    res.render('pages/dashboard', {
      movies: moviesResult.rows,
      totalBookings: bookingsResult.rows[0].count,
      totalUsers: usersResult.rows[0].count
    });
  } catch (err) {
    console.error('Error loading data for dashboard:', err);
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
    let featuresArray;
    if (typeof features === 'string') {
      featuresArray = features.replace(/[{}"']/g, '').split(',').map(f => f.trim()).filter(Boolean);
    } else if (Array.isArray(features)) {
      featuresArray = features;
    } else {
      featuresArray = [];
    }
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
    let featuresArray;
    if (typeof features === 'string') {
      featuresArray = features.replace(/[{}"']/g, '').split(',').map(f => f.trim()).filter(Boolean);
    } else if (Array.isArray(features)) {
      featuresArray = features;
    } else {
      featuresArray = [];
    }
    await theaterModel.createTheater(name, location, contact_number, featuresArray, image);
    res.redirect('/admin/theaters');
  } catch (err) {
    console.error('Error adding theater:', err);
    res.status(500).send('Failed to add theater');
  }
};

export const getAddHallPage = async (req, res) => {
  try {
    const { id } = req.params;
    const theater = await theaterModel.getTheaterById(id);
    if (!theater) {
      return res.status(404).send('Theater not found');
    }
    res.render('pages/add-hall', { theater });
  } catch (err) {
    console.error('Error loading add hall page:', err);
    res.status(500).send('Failed to load add hall page');
  }
};

export const addHall = async (req, res) => {
  try {
    const { id } = req.params; // theater_id
    const { name, features, seat_rows, seat_columns, chairs_in_section, price_per_seat } = req.body;

    if (parseInt(seat_rows) <= 0 || parseInt(seat_columns) <= 0) {
      return res.status(400).send('Seat rows and columns must be positive numbers.');
    }

    if (parseInt(seat_columns) <= parseInt(chairs_in_section)) {
      return res.status(400).send('Seats in column must be greater than chairs in section.');
    }

    await hallModel.createHall(id, name, features, seat_rows, seat_columns, chairs_in_section, price_per_seat);
    res.redirect(`/admin/theaters/${id}/halls`); // Redirect to a page showing halls for this theater
  } catch (err) {
    console.error('Error adding hall:', err);
    res.status(500).send('Failed to add hall');
  }
};

export const getManageHallsPage = async (req, res) => {
  try {
    const { id } = req.params; // theater_id
    const theater = await theaterModel.getTheaterById(id);
    if (!theater) {
      return res.status(404).send('Theater not found');
    }
    const halls = await hallModel.getHallsByTheaterId(id);
    res.render('pages/manageHalls', { theater, halls });
  } catch (err) {
    console.error('Error loading manage halls page:', err);
    res.status(500).send('Failed to load manage halls page');
  }
};

export const getEditHallPage = async (req, res) => {
  try {
    const { id } = req.params; // hall_id
    const hall = await hallModel.getHallById(id);
    if (!hall) {
      return res.status(404).send('Hall not found');
    }
    const theater = await theaterModel.getTheaterById(hall.theater_id); // Fetch parent theater for context
    res.render('pages/edit-hall', { hall, theater });
  } catch (err) {
    console.error('Error loading edit hall page:', err);
    res.status(500).send('Failed to load edit hall page');
  }
};

export const editHall = async (req, res) => {
  try {
    const { id } = req.params; // hall_id
    const { name, features, seat_rows, seat_columns, chairs_in_section, price_per_seat } = req.body;

    if (parseInt(seat_rows) <= 0 || parseInt(seat_columns) <= 0) {
      return res.status(400).send('Seat rows and columns must be positive numbers.');
    }

    if (parseInt(seat_columns) <= parseInt(chairs_in_section)) {
      return res.status(400).send('Seats in column must be greater than chairs in section.');
    }

    await hallModel.updateHall(id, name, features, seat_rows, seat_columns, chairs_in_section, price_per_seat);
    const hall = await hallModel.getHallById(id); // Get hall to redirect to its theater's halls page
    res.redirect(`/admin/theaters/${hall.theater_id}/halls`);
  } catch (err) {
    console.error('Error updating hall:', err);
    res.status(500).send('Failed to update hall');
  }
};

export const deleteHall = async (req, res) => {
  try {
    const { id } = req.params; // hall_id
    const hall = await hallModel.getHallById(id);
    if (!hall) {
      return res.status(404).json({ message: 'Hall not found' });
    }
    await hallModel.deleteHall(id);
    res.status(200).json({ message: 'Hall deleted successfully' });
  } catch (err) {
    console.error('Error deleting hall:', err);
    // Send a more specific error message back to the client
    res.status(500).json({ message: `Failed to delete hall: ${err.message || 'Unknown error'}` });
  }
};
