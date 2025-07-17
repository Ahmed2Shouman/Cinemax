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

CREATE TABLE theaters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    contact_number VARCHAR(20),
    features VARCHAR(255),
    image VARCHAR(255)
);

CREATE TABLE halls (
    id SERIAL PRIMARY KEY,
    theater_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    features VARCHAR(255),
    seat_rows INT NOT NULL,
    seat_columns INT NOT NULL,
    chairs_in_section INT,
    FOREIGN KEY (theater_id) REFERENCES theaters(id) ON DELETE CASCADE
);
