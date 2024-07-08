const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail } = require('../models/userModel');
const config = require('../config/config');

const registerUser = async (req, res) => {
    const { first_name, last_name, email, phone, password } = req.body;

    try {
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await createUser({ first_name, last_name, email, phone, password: hashedPassword });

        const token = jwt.sign({ id: newUser.id }, config.jwtSecret, { expiresIn: '1h' });

        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { registerUser };

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user.id }, config.jwtSecret, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { registerUser, loginUser };

const getUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { registerUser, loginUser, getUser };

const io = require('../index').io;

const updateUserDetails = async (req, res) => {
    const userId = req.params.id;
    const { first_name, last_name, email, phone } = req.body;

    try {
        const user = await updateUser(userId, { first_name, last_name, email, phone });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        io.emit('userUpdated', user);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { registerUser, loginUser, getUser, updateUserDetails };
