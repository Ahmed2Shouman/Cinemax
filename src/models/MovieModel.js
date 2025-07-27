import db from '../config/db.js';

const Movie = {
    findAll: async () => {
        const query = 'SELECT * FROM movies ORDER BY release_date DESC';
        const { rows } = await db.query(query);
        return rows;
    },

    findById: async (id) => {
        const query = 'SELECT * FROM movies WHERE id = $1';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    },

    create: async (movie) => {
        const { title, genre, release_date, duration, rating, description, poster_url, banner_url, trailer, status } = movie;
        const query = `
            INSERT INTO movies (title, genre, release_date, duration, rating, description, poster_url, banner_url, trailer, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *;
        `;
        const { rows } = await db.query(query, [title, genre, release_date, duration, rating, description, poster_url, banner_url, trailer, status]);
        return rows[0];
    },

    update: async (id, movie) => {
        const { title, genre, release_date, duration, rating, description, poster_url, banner_url, trailer, status } = movie;
        const query = `
            UPDATE movies
            SET title = $1, genre = $2, release_date = $3, duration = $4, rating = $5, description = $6, poster_url = $7, banner_url = $8, trailer = $9, status = $10
            WHERE id = $11
            RETURNING *;
        `;
        const { rows } = await db.query(query, [title, genre, release_date, duration, rating, description, poster_url, banner_url, trailer, status, id]);
        return rows[0];
    },

    delete: async (id) => {
        const query = 'DELETE FROM movies WHERE id = $1 RETURNING *;';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    }
};

export default Movie;
