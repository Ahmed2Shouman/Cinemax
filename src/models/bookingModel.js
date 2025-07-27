import pool from '../config/db.js';

export const createBooking = async (userId, showId, seats) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const bookingResult = await client.query(
            'INSERT INTO bookings (user_id, show_id) VALUES ($1, $2) RETURNING id',
            [userId, showId]
        );
        const bookingId = bookingResult.rows[0].id;

        for (const seatNumber of seats) {
            await client.query(
                'INSERT INTO booked_seats (booking_id, seat_number) VALUES ($1, $2)',
                [bookingId, seatNumber]
            );
        }

        await client.query('COMMIT');
        return { id: bookingId, userId, showId, seats };
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};
