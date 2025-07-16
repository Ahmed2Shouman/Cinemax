CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    genre VARCHAR(255),
    release_date DATE,
    duration VARCHAR(255),
    rating DECIMAL(3, 1),
    description TEXT,
    poster_url VARCHAR(255),
    banner_url VARCHAR(255),
    trailer VARCHAR(255),
    status VARCHAR(50) DEFAULT 'upcoming'
);
