CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    school VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    mother_name VARCHAR(100),
    mother_phone VARCHAR(15),
    father_name VARCHAR(100),
    father_phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

