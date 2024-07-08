const express = require('express');
const { registerUser } = require('../controllers/userController');

const router = express.Router();

router.post('/users', registerUser);

module.exports = router;

const { loginUser } = require('../controllers/userController');

router.post('/login', loginUser);

module.exports = router;

const { getUser } = require('../controllers/userController');

router.get('/users/:id', getUser);

module.exports = router;

const { updateUserDetails } = require('../controllers/userController');

router.put('/users/:id', updateUserDetails);

module.exports = router;
