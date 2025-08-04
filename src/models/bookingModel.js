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

export const getAllBookings = async () => {
    const query = `
        SELECT
            b.id,
            t.name AS theater_name,
            m.title AS movie_title,
            s.show_date,
            s.start_time AS show_start_time,
            u.username,
            ARRAY_AGG(bs.seat_number) AS seats,
            h.name AS hall_name,
            s.feature,
            (h.price_per_seat * array_length(ARRAY_AGG(bs.seat_number), 1)) AS total_price
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        JOIN shows s ON b.show_id = s.id
        JOIN movies m ON s.movie_id = m.id
        JOIN halls h ON s.hall_id = h.id
        JOIN theaters t ON h.theater_id = t.id
        JOIN booked_seats bs ON b.id = bs.booking_id
        GROUP BY b.id, t.name, m.title, s.show_date, s.start_time, u.username, h.name, s.feature, h.price_per_seat
        ORDER BY b.id;
    `;
    const { rows } = await pool.query(query);
    return rows;
};

export const getFilteredBookings = async (filters) => {
    let query = `
        SELECT
            b.id,
            t.name AS theater_name,
            m.title AS movie_title,
            s.show_date,
            s.start_time AS show_start_time,
            u.username,
            ARRAY_AGG(bs.seat_number) AS seats,
            h.name AS hall_name,
            s.feature,
            (h.price_per_seat * array_length(ARRAY_AGG(bs.seat_number), 1)) AS total_price
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        JOIN shows s ON b.show_id = s.id
        JOIN movies m ON s.movie_id = m.id
        JOIN halls h ON s.hall_id = h.id
        JOIN theaters t ON h.theater_id = t.id
        JOIN booked_seats bs ON b.id = bs.booking_id
    `;

    const values = [];
    const conditions = [];

    if (filters.movieName) {
        values.push(filters.movieName);
        conditions.push(`m.title = $${values.length}`);
    }
    if (filters.theaterName) {
        values.push(filters.theaterName);
        conditions.push(`t.name = $${values.length}`);
    }
    if (filters.date) {
        values.push(filters.date);
        conditions.push(`s.show_date = $${values.length}`);
    }
    if (filters.time) {
        values.push(filters.time);
        conditions.push(`s.start_time::time = $${values.length}`);
    }
    if (filters.feature) {
        values.push(filters.feature);
        conditions.push(`s.feature = $${values.length}`);
    }
    if (filters.hallName) {
        values.push(filters.hallName);
        conditions.push(`h.name = $${values.length}`);
    }
    if (filters.username) {
        values.push(`%${filters.username}%`);
        conditions.push(`u.username ILIKE $${values.length}`);
    }

    if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += `
        GROUP BY b.id, t.name, m.title, s.show_date, s.start_time, u.username, h.name, s.feature, h.price_per_seat
        ORDER BY b.id;
    `;

    const { rows } = await pool.query(query, values);
    return rows;
};

export const deleteBookingById = async (id) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query('DELETE FROM booked_seats WHERE booking_id = $1', [id]);
        await client.query('DELETE FROM bookings WHERE id = $1', [id]);
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

export const getBookingsByUserId = async (userId) => {
    const query = `
        SELECT
            b.id,
            t.name AS theater_name,
            m.title AS movie_title,
            s.show_date,
            s.start_time AS show_start_time,
            u.username,
            ARRAY_AGG(bs.seat_number) AS seats,
            h.name AS hall_name,
            s.feature,
            (h.price_per_seat * array_length(ARRAY_AGG(bs.seat_number), 1)) AS total_price
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        JOIN shows s ON b.show_id = s.id
        JOIN movies m ON s.movie_id = m.id
        JOIN halls h ON s.hall_id = h.id
        JOIN theaters t ON h.theater_id = t.id
        JOIN booked_seats bs ON b.id = bs.booking_id
        WHERE b.user_id = $1
        GROUP BY b.id, t.name, m.title, s.show_date, s.start_time, u.username, h.name, s.feature, h.price_per_seat
        ORDER BY b.id DESC;
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
};
