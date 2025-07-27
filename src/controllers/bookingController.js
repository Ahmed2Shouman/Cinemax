import * as bookingModel from '../models/bookingModel.js';

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
