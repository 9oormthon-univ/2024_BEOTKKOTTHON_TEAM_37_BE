const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const models = require('../models');

const hiApi = (req, res) => {
    const data = {
        message: `hi ${req.email}`
    }
    return res.json(data);
}

const signupApi = (req, res) => {
    const saltRounds = 10;
    // 동일한 이메일이 있는지 확인
    models.user.findOne({
        where: {
            email: req.body.email
        }
    }).then(user => {
        // 이미 존재하는 이메일이라면, 에러와 함께 리턴
        if (user) {
            return res.status(400).json({error: "이미 존재하는 이메일입니다."});
        }
        // 존재하지 않는 경우, 비밀번호를 해시하고 새로운 사용자 등록
        else {
            bcrypt.hash(req.body.password, saltRounds, function(err, hashed_password) {
                if (err) throw err;
                models.user.create({
                    name: req.body.name,
                    password: hashed_password,
                    email: req.body.email
                }).then(() => {
                    console.log("회원가입 성공!")
                    return res.json({message: "success signup!"});
                }).catch(err => {
                    return res.status(500).json({error: "데이터베이스 저장 중 오류가 발생했습니다."});
                });
            });
        }
    });
}

const loginApi = async (req, res) => {
    try {
        const foundData = await models.user.findOne({
            where: {
                email: req.body.email
            }
        });

        if (!foundData) {
            return res.status(404).json({ error: "해당 이메일이 없습니다." });
        }

        const passwordMatch = await bcrypt.compare(req.body.password, foundData.password);

        if (passwordMatch) {
            const accessToken = jwt.sign({
                id: foundData.id,
                email: foundData.email,
                name: foundData.name,
            }, "accesstoken", {
                expiresIn: '1d', // 여기에서 토큰 만료 시간을 1일로 설정
                issuer: "About Tech",
            });

            // 액세스 토큰을 응답 본문에 포함시킴
            return res.status(200).json({ message: "success login!", accessToken });
        } else {
            return res.status(401).json({ error: "비밀번호가 일치하지 않습니다." });
        }
    } catch (error) {
        console.error('로그인 중 에러 발생:', error);
        return res.status(500).send(error);
    }
}

const feedbackListApi = (req, res) => {
    const userInfo = { id: req.id, name: req.name, email: req.email };
    // 유저의 인포에 따라 리스트 반환
    // 리스트에는 웹툰 제목, 회차, 부제목이 들어가야 함.
    return res.json();
}

const feedbackSingleApi = (req, res) => {
    const feedbackInfo = { webtoon_title: req.webtoon_title, feedback_number: req.feedback_number };
    // 웹툰 제목, 회차 번호를 받아 피드백 내용을 반환
    return res.json(userInfo);
}

const testApi = (req, res) => {
    const name = req.body.name;
    console.log(name); // 확인용 출력
    if (name) {
        res.json({ message: `hi ${name}!` });
    }
    else {
        res.status(400).json({ error: 'Name is None.' });
    }
}

module.exports = {hiApi, loginApi, signupApi, testApi, feedbackListApi, feedbackSingleApi };