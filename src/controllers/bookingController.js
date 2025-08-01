import * as bookingModel from '../models/bookingModel.js';
import * as theaterModel from '../models/theaterModel.js';
import * as movieModel from '../models/MovieModel.js';

export const getManageBookingsPage = async (req, res) => {
    try {
        const filters = {
            movieName: req.query.movieName || '',
            theaterName: req.query.theaterName || '',
            date: req.query.date || '',
            time: req.query.time || '',
            feature: req.query.feature || '',
            hallName: req.query.hallName || '',
            username: req.query.username || ''
        };

        const allBookings = await bookingModel.getAllBookings();
        const theaters = await theaterModel.getAllTheaters();
        const movies = await movieModel.default.findAll();
        const dates = [...new Set(allBookings.map(b => {
            const date = new Date(b.show_date);
            const year = date.getUTCFullYear();
            const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
            const day = date.getUTCDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        }))];
        const times = [...new Set(allBookings.map(b => b.show_start_time))];
        const features = [...new Set(allBookings.map(b => b.feature))];
        const halls = [...new Set(allBookings.map(b => b.hall_name))];

        const bookings = await bookingModel.getFilteredBookings(filters);
        bookings.forEach(booking => {
            booking.total_price = parseFloat(booking.total_price);
            // Format the date and time for display
            const showDate = new Date(booking.show_date);
            const year = showDate.getUTCFullYear();
            const month = (showDate.getUTCMonth() + 1).toString().padStart(2, '0');
            const day = showDate.getUTCDate().toString().padStart(2, '0');
            booking.formatted_show_date = `${year}-${month}-${day}`;

            const time = booking.show_start_time;
            const date = new Date(`1970-01-01T${time}`);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            booking.formatted_show_time = `${hours}:${minutes}`;
        });
        res.render('pages/manage-bookings', { bookings, filters, theaters, movies, dates, times, features, halls });
    } catch (error) {
        console.error('Error getting bookings:', error);
        res.status(500).send('Error getting bookings');
    }
};

export const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        await bookingModel.deleteBookingById(id);
        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ error: 'Error deleting booking' });
    }
};

export const createBooking = async (req, res) => {
    try {
        const { showId, seats } = req.body;
        if (!req.session.user || !req.session.user.id) {
            return res.status(401).json({ message: 'You must be logged in to make a booking.' });
        }
        const userId = req.session.user.id;
        const booking = await bookingModel.createBooking(userId, showId, seats);
        res.status(201).json(booking);
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Error creating booking' });
    }
};

export const getMyBookingsPage = async (req, res) => {
    try {
        if (!req.session.user || !req.session.user.id) {
            return res.redirect('/sign-in');
        }
        const userId = req.session.user.id;
        const bookings = await bookingModel.getBookingsByUserId(userId);
        bookings.forEach(booking => {
            booking.total_price = parseFloat(booking.total_price);
            const showDate = new Date(booking.show_date);
            const year = showDate.getUTCFullYear();
            const month = (showDate.getUTCMonth() + 1).toString().padStart(2, '0');
            const day = showDate.getUTCDate().toString().padStart(2, '0');
            booking.formatted_show_date = `${year}-${month}-${day}`;

            const time = booking.show_start_time;
            const date = new Date(`1970-01-01T${time}`);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            booking.formatted_show_time = `${hours}:${minutes}`;
        });
        res.render('pages/mybookings', { bookings, user: req.session.user });
    } catch (error) {
        console.error('Error loading my bookings page:', error);
        res.status(500).send('Failed to load my bookings page');
    }
};
