const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { renderJoin, renderMain, renderUpload,renderLogin } = require('../controllers/page');

const router = express.Router();

// /join
router.get('/join', isNotLoggedIn, renderJoin);
// /post
router.get('/post', renderUpload);
// /auth
router.get('/auth',renderLogin);
// /
router.get('/', renderMain);

module.exports = router;