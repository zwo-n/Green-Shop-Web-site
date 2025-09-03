const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares'); // 로그인 체크 미들웨어
const { buyProduct , getPurchases} = require('../controllers/buy'); 

// POST /buy 
// 상품 구매 라우터
router.post('/',buyProduct);
// GET / buy/ purchased
// 로그인한 유저에 한해 구매 내역을 보여주는 라우터
router.get('/purchased', isLoggedIn ,getPurchases)
module.exports = router;
