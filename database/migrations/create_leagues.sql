CREATE TABLE leagues (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(255),
    country VARCHAR(100),
    folder_name VARCHAR(100)
); 