require('dotenv').config();
const fs = require('fs').promises;
const crawlControl = require("../crawling_kakao");
const apiKey = process.env.OPENAI_API_KEY;  

const chatGpiApi = async (req, res) => {
    
    try {
        const url = req.body.url; // 클라이언트에서 받은 URL
        const crawlResult = await crawlControl.crawlAndSave(url); // 크롤링 모듈 호출    
        
        const prompt =
        "[YOUR TASK]\n"+
        "You are an assistant tasked with reading comments on a webtoon and organizing them in a way that benefits the webtoon author."+
        "About 20 comments will be sent to you, related to a specific episode of a webtoon. You need to read the comments to grasp the audience's reactions.\n"+
        "Two key points to consider when organizing comments:\n" +
        "Protect the webtoon authors from psychological harm by filtering out personal attacks and extreme expressions.\n" +
        "Use the comments to understand reader reactions and incorporate this feedback into the work, as it can be a source of inspiration and improvement for the author."+
        "REMEMBER, FEEDBACK SHOULD BE WRITTEN IN KOREAN, AND NO OTHER WORDS ARE PEMITTED.\n\n"+
        "Here is an example:\n"+
        "[COMMENTS]\n"+
        "comment 1: 와 저당시 월급으로 92만원을 후임들위해 쓰는건 진짜 레전드긴하다 ㄷㄷ\n"+
        "comment 2: 후임들 꿈을 위해 92만원 쓸 시간에 아직도 본인 꿈은 못 정한 정수아가 레전드"+
        "comment 3: 쟤 설정이 아빠없고 여행도 못가고 금토일 알바뛰고오빠들이랑 겨우 벌어쓰는 어려운 형편 아녔냐....\n"+
        "comment 4: 92만원 쓴거보다 책표지 보여준다고 분량 반이상 잡아먹은게 더 충격적이다... 전화에도 꿈 물어본다고 분량 다 태웠는데 2주 연속으로 이러고 있으면 나국희 랩한다고 분량 순삭시킨 그때랑 뭐가 다르냐\n"+
        "comment 5: 참 좋은뜻에 내용인데 가난부터 돈이야기까지 현실이 갑박한지 알겠다...........\n"+
        "comment 6: 수아는 지금 92만원 써서 100명한테 은인이 됐고 평생 기억에 남을 사람이 된거임 투자 대비 수익 엄청 나지 않나? 이런것도 못보고 돈 개념이 없네 어쩌네 하니 니네가 주식은 다 말아먹고 코인은 고점에 사서 저점에 손절 당하는거임\n"+
        "comment 7: 수아 지돈 지가쓴다는데 뭐이리 시어머니들이 많냐 ㅋㅋㅋㅋ 집안형편 안좋은건 사실이지만 엄마랑 오빠는 오히려 수아행동 자랑스러워 할것 같은데ㅋㅋ 진짜 가난한건 지갑이 텅텅빈게 아니라 마음이 텅텅빈게 가난한거다 쫌생이들아 ㅋㅋㅋ 대가 없이 선행을 베푸는 수아는 언젠가 어떻게든 보상을 받게 되어있다. 과거에 수아 천사짓 한다고 ㅈㄴ답답해하던 댓글도 많았는데 그 답답함을 빌드업으로 결국 최고의 결실을 맺을거 같다. 나도 딱 저때 군생활 했었는데 저때가 선진병영으로 바뀌는 중요한 시점이었고 그럼에도 부조리는 여전히 많았으며 수아처럼 멋있는 사람은 ㄹㅇ 1%정도 있었다. 착하고 일잘하고 위아래로 신뢰받고 가슴도 ㅈㄴ큰 수아가 최고다ㄹㅇ\n"+
        "comment 8: 수아야 제대후에 대학등록금은 어쩔려고 그러니... 너네 엄마랑 오빠들 힘든건 좀 덜어줘야하지 않겠니?\n"+
        "comment 9: 저건 사람 마다 다른거지 못사는대 오지랖이냐 하고 있냐 가끔 뉴스나 기사 보면 폐지 주워서 돈모아서 기부하시는 분들도 있자나 사람 마다 다른거지 그만큼 수아라는 캐릭터가 부대 바꿔보려고 노력하는 과정들 보면서 그만큳 후임들 생각하고 좋게 만들려고 노력했던 시간들이 있는대 마지막에 저정도 할수있지 현실에서 기부하는 사람들이 진짜 부자들 빼고 다 잘사는 사람들만 기부하고 도움주려고 하는줄 아나 본인이 할수 있는 선에서 남에게 도움을주고 배풀어주는거지 그냥 봉사활동도 대충 시간 떼우기로만 다녔던 사람들은 이해 못하겠지\n"+
        "comment 10: 딱 이 분들이 남겨주신 책을 제가 관리 했었습니다.제가 말년에 120명 정도 되는 중대의 작은 도서관이 있었는데, 타 중대의 관리되지 않는 책들을 모아 대대 도서관을 만들어 그 곳의 도서관리병으로 있었습니다. 정수아처럼 한 고참이 거금들여 많은 책을 산 건 아니고, 선임들이 돈을 모아서 후임들에게 책을 주었고 그 후임들이 전역하며 중대에 물려주고 간 책들이엇습니다. 저는 그 도서관에 있는 책을 90퍼센트는 다 읽었습니다. 말년에는 할 짓이 없거든요. 구 막사라 환경이 좋지 않아 습을 먹고 음료나 커피등을 흘린 자국이 있는 책과 훈련하면서 여기저기 치이고 던져지는 바람에 외관이 망가진 책들이 많았죠. 하지만 내부는 모두 멀쩡한 상태였습니다. 책은 모두 누군가에게 물려주고, 누군가가 물려받은 것들이었거든요. 저는 말년에 도서관리병이 되어서, 그 곳의 책들을 모두 읽고서야 이 곳도 살만 한 곳이구나 라는걸 깨달았습니다.\n"+
        "comment 11: 열등감, 과몰입, 부러움 3개가 만나면 현실을 받아들이지 못하고 만화가 자기세상이라 착각하지. 그리고 ㅈ문가적인 발언을 일삼으며 훈계하려하고 더 나아가 승리자인척 욕을 싸지르는데 너무너무 보기좋다~ 에휴..\n"+
        "comment 12: 오늘은 진짜 판타지네 ㅋㅋ\n\n"+
        "[FEEDBACK]\n"+
        "Positive response:"+
        "Readers are very positive about the character growth and development, especially the protagonist's cool actions and meaningful decisions. The part where the main character spent a large amount of money on his successors was particularly impressive, and it left a deep impression on the reader."+
        "There appears to be a high degree of immersion and empathy in the story. People with military experience reminisce about their experiences through webtoons and find it interesting to look at stories from a different perspective."+
        "Some comments demonstrate a deep understanding of detailed elements of the work, such as references to the symbolism of the book's title or the setting within the work.\n"+
        "Constructive Criticism:"+
        "Some readers commented on the pacing of the story or the placement of content in certain episodes. For example, there were suggestions that too much time was spent on certain scenes, or that the focus should be focused on more important aspects of the story."+
        "There are various opinions about the protagonist spending large amounts of money despite financial difficulties. There was discussion about whether these actions reflected the protagonist's personality and situation well, or whether it was a decision that did not take into account the actual difficulties.\n\n"+
        "NOW, HERE ARE THE COMMENTS YOU SHOULD ORGANIZE. GIVE FEEDBACK ONLY BASED ON THESE COMMENTS. NO YAPPING. \n[COMMENTS]\n";

        // 결과에서 comments 필드를 추출하여 message에 할당
        const query_comments = crawlResult.comments.map((comment, index) => `comment ${index + 1}: ${comment}`).join('\n');
        console.log(query_comments);

        const message = prompt + query_comments;

        // ChatGPT API에 요청을 보내기 위한 데이터 준비
        const data = {
            model: 'gpt-4',
            messages: [
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
        const contentOnly = responseData.choices[0].message.content;
        const gptFeedback = {
            title: crawlResult.title,
            contentNum: crawlResult.number,
            subtitle: crawlResult.subtitle,
            feedback: contentOnly
        };
        res.json(gptFeedback); // 클라이언트에 응답 반환

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' }); // 오류가 발생한 경우 500 상태 코드 반환
    }
}
module.exports = {chatGpiApi};