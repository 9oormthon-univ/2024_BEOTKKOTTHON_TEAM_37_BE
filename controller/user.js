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

const loginApi = (req, res) => {
    models.user.findOne({
        where: {
            email: req.body.email
        }
    })
    .then((foundData) => {
        if (!foundData) {
            return res.status(404).json({ error: "해당 이메일이 없습니다." });
        } else {
            bcrypt.compare(req.body.password, foundData.password, function(err, result) {
                if (err) throw err;
                if (result) {
                    console.log("로그인 성공!");
                    try {
                        const accessToken = jwt.sign({ // jwt생성
                            id: foundData.id,
                            email: foundData.email,
                            name: foundData.name, 
                        }, "accesstoken", {
                            expiresIn: '1h',
                            issuer: "About Tech",
                        });
    
                        res.cookie("accessToken", accessToken, { // 클라이언트에게 쿠키 전달
                            secure: false, // https면 true
                            httpOnly: true,
                        });
                        return res.status(200).json({ message: "success login!" });
                    } catch (error) {
                        console.log(error);
                        return res.status(500).send(error);
                    }
                } else {
                    return res.status(401).json({ error: "비밀번호가 일치하지 않습니다." });
                }
            });
        }
    })
}

// const myPageApi = (req, res) => {
//     const userInfo = { name: req.name, email: req.email };
//     // 추가로 필터링된 댓글도 포함하기
//     return res.json(userInfo);
// }

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

module.exports = {hiApi, loginApi, signupApi, testApi };