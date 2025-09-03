const express = require('express');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { join, login, logout } = require('../controllers/auth');

const router = express.Router();

// /auth/join
router.post('/join', isNotLoggedIn, join);
// /auth/login
router.post('/login', isNotLoggedIn, login);
// /auth/logout
router.get('/logout', isLoggedIn, logout);

module.exports = router;