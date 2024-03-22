const express = require('express');
const app = express();
const port = process.env.PORT || 8000; 
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');        // 미들 웨어
const cookieparser = require('cookie-parser');    // 미들 웨어
const cors = require('cors');                     // 미들 웨어

app.use(bodyParser.json());                       // body에 있는 것들을 json으로 파싱 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieparser());                          // cookie값 파싱
app.use(cors());                                  // cors 보안 

const userController = require('./controller/user.js');
const chatController = require('./controller/chatGpt.js');
const crawlController = require('./controller/crawl.js');

function verifyToken(req, res, next) {
    try {
        const authHeader = req.headers['accesstoken']; // 자동으로 accesstoken으로 저장됨

        console.log(authHeader);

        // 헤더에서 Authorization 값이 없으면
        if (!authHeader) {
            return res.status(403).json({ error: '토큰이 없습니다.' });
        }

        // jwt를 사용하여 토큰 유효성 검증
        jwt.verify(authHeader, 'accesstoken', (err, decoded) => {
            if (err) {
                // 토큰이 유효하지 않으면
                return res.status(401).json({message:'TokenFail'}); // 프론트가 이 메세지를 받았을 경우 해당 토큰을 로컬스토리지에서 지우고 로그인 페이지로 이동.
            } else {
                // 검증된 토큰에서 사용자 정보를 추출하여 요청 객체에 저장
                req.email = decoded.email;
                req.name = decoded.name;
                next(); // 다음 미들웨어로 제어를 넘깁니다.
            }
        });
    } catch (error) {
        console.error('토큰 검증 중 에러 발생:', error);
        return res.status(500).json({ error: '서버 에러' });
    }
}

// 크롤링 API
app.post('/crawl', crawlController.crawlApi);

// Chat GPT API
app.post('/chat', chatController.chatGpiApi);

// hi API
app.get('/hi', verifyToken, userController.hiApi);

// 회원가입 API
app.post('/signup', userController.signupApi);

// 로그인 API
app.post('/login', userController.loginApi);

// 마이페이지 API
//app.get('/mypage', verifyToken, userController.myPageApi);

// test API
//app.post('/test', userController.testApi);

app.listen(port, () => {
    console.log(`Server is running at ${port}!`);
});