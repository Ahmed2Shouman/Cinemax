import pool from '../config/db.js';
import Show from '../models/showModel.js';
import * as hallModel from '../models/hallModel.js';
import * as theaterModel from '../models/theaterModel.js';

export const getAddShowPage = async (req, res) => {
    try {
        const movies = await pool.query("SELECT * FROM movies WHERE status = 'NOW SHOWING'");
        const theaters = await theaterModel.getAllTheaters();
        res.render('pages/add-show', { movies: movies.rows, theaters, error: null });
    } catch (err) {
        console.error('Error loading add show page:', err);
        res.status(500).send('Failed to load the page');
    }
};

export const addShows = async (req, res) => {
    try {
        const { movie_id, hall_id, show_date, start_times } = req.body;
        const times = Array.isArray(start_times) ? start_times : [start_times];

        const movieResult = await pool.query('SELECT duration FROM movies WHERE id = $1', [movie_id]);
        if (movieResult.rows.length === 0) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        const durationInMinutes = parseInt(movieResult.rows[0].duration.split(' ')[0]);

        const hall = await hallModel.getHallById(hall_id);
        if (!hall) {
            return res.status(404).json({ message: 'Hall not found' });
        }
        const hallFeatures = hall.features;

        for (const time of times) {
            const startTime = new Date(`${show_date}T${time}`);
            if (isNaN(startTime)) {
                return res.status(400).json({ message: `Invalid time value: ${time}` });
            }
            const endTime = new Date(startTime.getTime() + durationInMinutes * 60000);
            const formattedEndTime = endTime.toTimeString().split(' ')[0];
            await Show.create(hall_id, movie_id, show_date, time, formattedEndTime, hallFeatures);
        }
        res.status(201).json({ message: 'Shows added successfully' });
    } catch (err) {
        console.error('Error adding shows:', err);
        res.status(500).json({ message: 'Failed to add shows' });
    }
};

export const getManageShowsPage = async (req, res) => {
    try {
        const shows = await Show.findAll();
        res.render('pages/manageShows', { shows });
    } catch (err) {
        console.error('Error loading manage shows page:', err);
        res.status(500).send('Failed to load the page');
    }
};

export const getEditShowPage = async (req, res) => {
    try {
        const { id } = req.params;
        const show = await Show.findById(id);
        const movies = await pool.query("SELECT * FROM movies WHERE status = 'NOW SHOWING'");
        const theaters = await theaterModel.getAllTheaters();
        const hall = await hallModel.getHallById(show.hall_id);
        const halls = await hallModel.getHallsByTheaterId(hall.theater_id);
        res.render('pages/edit-show', { show, movies: movies.rows, theaters, halls, hall, error: null });
    } catch (err) {
        console.error('Error loading edit show page:', err);
        res.status(500).send('Failed to load the page');
    }
};

export const updateShow = async (req, res) => {
    try {
        const { id } = req.params;
        const { hall_id, movie_id, show_date, start_time } = req.body;

        const movieResult = await pool.query('SELECT duration FROM movies WHERE id = $1', [movie_id]);
        if (movieResult.rows.length === 0) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        const durationInMinutes = parseInt(movieResult.rows[0].duration.split(' ')[0]);

        const hall = await hallModel.getHallById(hall_id);
        if (!hall) {
            return res.status(404).json({ message: 'Hall not found' });
        }
        const hallFeatures = hall.features;

        const startTime = new Date(`${show_date}T${start_time}`);
        const endTime = new Date(startTime.getTime() + durationInMinutes * 60000);

        const formattedEndTime = endTime.toTimeString().split(' ')[0];

        await Show.update(id, hall_id, movie_id, show_date, start_time, formattedEndTime, hallFeatures);
        res.status(200).json({ message: 'Show updated successfully' });
    } catch (err) {
        console.error('Error updating show:', err);
        res.status(500).json({ message: 'Failed to update show' });
    }
};

export const deleteShow = async (req, res) => {
    try {
        const { id } = req.params;
        await Show.delete(id);
        res.status(200).json({ message: 'Show deleted successfully' });
    } catch (err) {
        console.error('Error deleting show:', err);
        res.status(500).json({ message: 'Failed to delete show' });
    }
};

export const getHallsByTheater = async (req, res) => {
    try {
        const { theaterId } = req.params;
        const halls = await hallModel.getHallsByTheaterId(theaterId);
        res.json(halls);
    } catch (err) {
        console.error('Error fetching halls:', err);
        res.status(500).send('Failed to fetch halls');
    }
};

export const getShowFeatures = async (req, res) => {
    const { theaterId } = req.query;
    try {
        const result = await pool.query(
            'SELECT array_to_string(features, \',\') AS features FROM theaters WHERE id = $1',
            [theaterId]
        );
        // The result will be a single row with a features string like "IMAX,4DX"
        const features = result.rows.flatMap(row => {
            const featureString = String(row.features || '').trim(); // Ensure it's a string and trim whitespace
            if (featureString) {
                return featureString.split(',').map(f => ({ feature: f.trim() }));
            }
            return [];
        });
        res.json(features);
    } catch (err) {
        console.error('Error fetching show features:', err);
        res.status(500).send('Failed to fetch show features');
    }
};

export const getShowDates = async (req, res) => {
    const { movieId, theaterId, feature } = req.query;
    try {
        const result = await pool.query(
            'SELECT DISTINCT CAST(s.show_date AS DATE) FROM shows s JOIN halls h ON s.hall_id = h.id WHERE s.movie_id = $1 AND h.theater_id = $2 AND s.feature ILIKE \'%\' || $3 || \'%\' ORDER BY CAST(s.show_date AS DATE)',
            [movieId, theaterId, feature]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching show dates:', err);
        res.status(500).send('Failed to fetch show dates');
    }
};

export const getShowTimes = async (req, res) => {
    const { movieId, theaterId, feature, date } = req.query;
    try {
        const result = await pool.query(
            `SELECT s.id, s.start_time, s.end_time, s.show_date, s.movie_id, s.hall_id
             FROM shows s 
             JOIN halls h ON s.hall_id = h.id
             WHERE s.movie_id = $1 
             AND h.theater_id = $2 
             AND s.feature ILIKE '%' || $3 || '%' 
             AND s.show_date = $4
             ORDER BY s.start_time`,
            [movieId, theaterId, feature, date]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching show times:', err);
        res.status(500).send('Failed to fetch show times');
    }
};

export const getShowSeats = async (req, res) => {
    const { showId } = req.query;
    try {
        const seats = await Show.getBookedSeats(showId);
        res.json(seats);
    } catch (err) {
        console.error('Error fetching show seats:', err);
        res.status(500).send('Failed to fetch show seats');
    }
};

export const getHallDetails = async (req, res) => {
    const { showId } = req.params;
    try {
        const result = await pool.query(
            `SELECT h.seat_rows, h.seat_columns, h.chairs_in_section, h.price_per_seat
             FROM halls h
             JOIN shows s ON s.hall_id = h.id
             WHERE s.id = $1`,
            [showId]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('Hall not found for this show');
        }
    } catch (err) {
        console.error('Error fetching hall details:', err);
        res.status(500).send('Failed to fetch hall details');
    }
};

export const getShows = async (req, res) => {
    const { movieId, theaterId } = req.query;
    try {
        const shows = await Show.getShowsByMovieAndTheater(movieId, theaterId);
        res.json(shows);
    } catch (err) {
        console.error('Error fetching shows:', err);
        res.status(500).send('Failed to fetch shows');
    }
};
