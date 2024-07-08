const pool = require('../config/db');

const createUser = async (user) => {
    const { first_name, last_name, email, phone, password } = user;
    const result = await pool.query(
        'INSERT INTO users (first_name, last_name, email, phone, password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [first_name, last_name, email, phone, password]
    );
    return result.rows[0];
};

const getUserByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
};

module.exports = { createUser, getUserByEmail };

const getUserById = async (id) => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
};

module.exports = { createUser, getUserByEmail, getUserById };

const updateUser = async (id, updates) => {
    const { first_name, last_name, email, phone } = updates;
    const result = await pool.query(
        'UPDATE users SET first_name = $1, last_name = $2, email = $3, phone = $4 WHERE id = $5 RETURNING *',
        [first_name, last_name, email, phone, id]
    );
    return result.rows[0];
};

module.exports = { createUser, getUserByEmail, getUserById, updateUser };
