const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');

dotenv.config();
const db = require('./models');
// Rest API를 위한 router 불러오기
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const buyRouter = require('./routes/buy')
const passportConfig = require('./passport');

// express 사용을 위해 객체 생성
const app = express();
passportConfig();
app.set('port', process.env.PORT || 8000);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});

// static, cookie-parser, josn 미들웨어 사용
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.urlencoded({ extended: false }));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));

// passport 초기화 및 세션 설정
app.use(passport.initialize());
app.use(passport.session());

// 모듈화된 라우팅 설정
app.use('/', pageRouter); // 페이지 렌더링 라우터
app.use('/auth', authRouter); // 로그인 라우터
app.use('/post', postRouter); // 상품 등록 라우터
app.use('/buy',buyRouter); // 상품 구매 라우터

app.use((req, res, next) => {
    const err = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    err.status = 404;
    next(err);
});

3

app.listen(app.get('port'), () => {
    console.log(`${app.get('port')}번 포트에서 대기 중`);
});