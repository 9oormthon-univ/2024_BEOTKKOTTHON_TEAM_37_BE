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

const feedbackListApi = async (req, res) => {
    try {
        const userId = req.id; // 요청에서 사용자 ID 가져오기

        // webtoon TB에서 가져오기
        const userWebtoons = await models.webtoon.findAll({
            where: { 
                user_id: userId
            },
            attributes: ['id', 'webtoon_title'] // 'webtoon_title'을 'title'로 변경, 데이터베이스 스키마에 맞게 조정 필요
        });

        const feedbacks_array = [];

        for (const userWebtoon of userWebtoons) {
            const webtoonId = userWebtoon.id;

            // feedback TB에서 가져오기
            const webtoonFeedbacks = await models.feedback.findAll({
                where: {
                    webtoon_id: webtoonId
                },
                attributes: ['number', 'subtitle'] // 필요한 속성만 지정
            });

            // 각 웹툰의 feedbacks를 조정하여 원하는 형식으로 만들기
            const feedbacksFormatted = webtoonFeedbacks.map(feedback => ({
                title: userWebtoon.webtoon_title, // 각 feedback에 웹툰 제목 추가
                number: feedback.number,
                subtitle: feedback.subtitle
            }));

            feedbacks_array.push(...feedbacksFormatted); // 수정된 feedbacks를 최종 배열에 추가
        }

        // 최종 결과 객체 생성
        const result = {
            id: req.id,
            name: req.name,
            email: req.email,
            webtoons: feedbacks_array 
        };

        // JSON 형태로 반환
        return res.json(result);
    } catch (error) {
        console.error("Error fetching user webtoons:", error);
        return res.status(500).send("Internal Server Error");
    }
}

const feedbackSingleApi = async (req, res) => {
    const { webtoon_title, feedback_number } = req.body;
    try {
        const webtoon = await models.webtoon.findOne({
            where: { webtoon_title: webtoon_title }
        });

        if (!webtoon) {
            return res.status(404).json({ error: "웹툰을 찾을 수 없습니다." });
        }

        const feedback = await models.feedback.findOne({
            where: {
                webtoon_id: webtoon.id,
                number: feedback_number
            }
        });

        if (!feedback) {
            return res.status(404).json({ error: "해당 회차의 피드백을 찾을 수 없습니다." });
        }

        res.json({ feedback: feedback.feedback }); // 수정된 응답 방식
    } catch (error) {
        console.error("피드백 조회 중 오류 발생:", error);
        res.status(500).json({ error: "서버 내부 오류가 발생했습니다." });
    }
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

module.exports = {hiApi, loginApi, signupApi, testApi, feedbackListApi, feedbackSingleApi};