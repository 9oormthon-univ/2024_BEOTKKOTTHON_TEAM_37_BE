require('dotenv').config();

const apiKey = process.env.OPENAI_API_KEY;  

const chatGpiApi = async (req, res) => {
    try {
        // 이미 생성된 results.json 파일의 경로
        const resultsFilePath = './results.json';

        // 결과 파일 읽기
        const jsonData = await fs.readFile(resultsFilePath, 'utf8');
        const result = JSON.parse(jsonData);
        
        // 결과에서 comments 필드를 추출하여 message에 할당
        const message = result.comments;
        // console.log(message);

        // ChatGPT API에 요청을 보내기 위한 데이터 준비
        const data = {
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: message },
            ],
        };

        // ChatGPT API에 POST 요청 보내기
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json(); // 응답 데이터 가져오기
        res.json(responseData); // 클라이언트에 응답 반환

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' }); // 오류가 발생한 경우 500 상태 코드 반환
    }
}
module.exports = {chatGpiApi};