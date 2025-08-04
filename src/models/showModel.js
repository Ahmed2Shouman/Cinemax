import pool from '../config/db.js';

class Show {
    static async create(hall_id, movie_id, show_date, start_time, end_time, feature) {
        const result = await pool.query(
            'INSERT INTO shows (hall_id, movie_id, show_date, start_time, end_time, feature) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [hall_id, movie_id, show_date, start_time, end_time, feature]
        );
        return result.rows[0];
    }

    static async findAll() {
        const result = await pool.query(`
            SELECT s.id, m.title AS movie_title, t.name AS theater_name, h.name AS hall_name, s.show_date, s.start_time, s.end_time, s.feature
            FROM shows s
            JOIN movies m ON s.movie_id = m.id
            JOIN halls h ON s.hall_id = h.id
            JOIN theaters t ON h.theater_id = t.id
            ORDER BY s.show_date, s.start_time
        `);
        return result.rows;
    }

    static async findById(id) {
        const result = await pool.query('SELECT * FROM shows WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async update(id, hall_id, movie_id, show_date, start_time, end_time, feature) {
        const result = await pool.query(
            'UPDATE shows SET hall_id = $1, movie_id = $2, show_date = $3, start_time = $4, end_time = $5, feature = $6 WHERE id = $7 RETURNING *',
            [hall_id, movie_id, show_date, start_time, end_time, feature, id]
        );
        return result.rows[0];
    }

    static async delete(id) {
        await pool.query('DELETE FROM shows WHERE id = $1', [id]);
    }

    static async getShowsByMovieAndTheater(movieId, theaterId) {
        const result = await pool.query(
            `SELECT s.id, s.feature, s.show_date, s.start_time 
             FROM shows s
             JOIN halls h ON s.hall_id = h.id
             WHERE s.movie_id = $1 AND h.theater_id = $2`,
            [movieId, theaterId]
        );
        return result.rows;
    }

    static async getHallByShowId(showId) {
        const result = await pool.query(
            `SELECT h.seat_rows, h.seat_columns, h.chairs_in_section, h.price_per_seat
             FROM halls h
             JOIN shows s ON s.hall_id = h.id
             WHERE s.id = $1`,
            [showId]
        );
        return result.rows[0];
    }

    static async getBookedSeats(showId) {
        const result = await pool.query(
            'SELECT bs.seat_number FROM booked_seats bs JOIN bookings b ON bs.booking_id = b.id WHERE b.show_id = $1',
            [showId]
        );
        return result.rows;
    }
}

export default Show;
