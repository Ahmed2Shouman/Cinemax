export const getOffersPage = (req, res) => {
  res.render('pages/offers');
};

import * as theaterModel from '../models/theaterModel.js';
import pool from '../config/db.js';

export const getBookPage = async (req, res) => {
    try {
        const { id } = req.params;
        const movieResult = await pool.query('SELECT * FROM movies WHERE id = $1', [id]);
        if (movieResult.rows.length === 0) {
            return res.status(404).send('Movie not found');
        }
        const movie = movieResult.rows[0];
        const theaters = await theaterModel.getAllTheaters();
        res.render('pages/book', { movie, theaters });
    } catch (error) {
        console.error('Error loading booking page:', error);
        res.status(500).send('Error loading booking page');
    }
};

export const getTheatersPage = async (req, res) => {
  try {
    const theaters = await theaterModel.getAllTheaters();
    res.render('pages/theaters', { theaters });
  } catch (error) {
    res.status(500).send('Error loading theaters page');
  }
};

export const getContactUsPage = (req, res) => {
  res.render('pages/contact-us');
};

export const getFaqsPage = (req, res) => {
  res.render('pages/faqs');
};

export const getPrivacyPolicyPage = (req, res) => {
  res.render('pages/privacy');
};

export const getProfilePage = (req, res) => {
  res.render('pages/profile');
};

export const getSignInPage = (req, res) => {
  res.render('pages/login');
};

export const getSignUpPage = (req, res) => {
  res.render('pages/signup');
};

export const getCheckoutPage = async (req, res) => {
  const { showId, seats } = req.query;
  if (!showId || !seats) {
    return res.status(400).send('Show ID and seats are required');
  }

  try {
    const showResult = await pool.query(`
      SELECT s.id, s.show_date, s.start_time, m.title AS movie_title, t.name AS theater_name, h.price_per_seat
      FROM shows s
      JOIN movies m ON s.movie_id = m.id
      JOIN halls h ON s.hall_id = h.id
      JOIN theaters t ON h.theater_id = t.id
      WHERE s.id = $1
    `, [showId]);

    if (showResult.rows.length === 0) {
      return res.status(404).send('Show not found');
    }

    const show = showResult.rows[0];
    const seatNumbers = seats.split(',');
    const pricePerSeat = parseFloat(show.price_per_seat);
    const totalPrice = seatNumbers.length * pricePerSeat;

    const bookingDetails = {
      showId: show.id,
      movieTitle: show.movie_title,
      theaterName: show.theater_name,
      showDate: new Date(show.show_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' }),
      showTime: show.start_time.substring(0, 5),
      seats: seatNumbers.map(seatNumber => ({ seatNumber, price: pricePerSeat })),
      totalPrice: totalPrice,
    };

    res.render('pages/checkout', { bookingDetails });
  } catch (error) {
    console.error('Error loading checkout page:', error);
    res.status(500).send('Error loading checkout page');
  }
};

export const getBookingSuccessfulPage = (req, res) => {
  res.render('pages/booking-successful');
};
