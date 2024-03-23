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
        // 'Authorization' 헤더에서 토큰을 추출
        const authHeader = req.headers['authorization'];

        // 'Authorization' 헤더 값이 Bearer 토큰 형식인지 확인
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(403).json({ error: '토큰이 제공되지 않았거나, Bearer 타입이 아닙니다.' });
        }

        // 'Bearer '를 제거하고 실제 토큰 값만 추출
        const token = authHeader.substring(7, authHeader.length);

        // jwt를 사용하여 토큰 유효성 검증
        jwt.verify(token, 'accesstoken', (err, decoded) => {
            if (err) {
                // 토큰이 유효하지 않으면
                return res.status(401).json({message: 'TokenFail'}); 
            } else {
                // 검증된 토큰에서 사용자 정보를 추출하여 요청 객체에 저장
                req.id = decoded.id;
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
app.post('/chat', verifyToken, chatController.chatGpiApi);

// hi API
app.get('/hi', verifyToken, userController.hiApi);

// 회원가입 API
app.post('/signup', userController.signupApi);

// 로그인 API
app.post('/login', userController.loginApi);

// 마이페이지 리스트 API
app.get('/feedback/list', verifyToken, userController.feedbackListApi);

// 마이페이지 싱글 코멘트 API
app.post('feedback/single', userController.feedbackSingleApi);

app.listen(port, () => {
    console.log(`Server is running at ${port}!`);
});