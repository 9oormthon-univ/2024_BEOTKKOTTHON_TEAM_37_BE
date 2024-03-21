const crawlControll = require("../crawling_kakao");

const crawlApi = async (req, res) => {
    // JSON 파일을 읽어서 클라이언트에게 응답
    // fs.readFile('results.json', 'utf8', (err, data) => {
    //     if (err) {
    //         console.error(err);
    //         res.status(500).send('Internal Server Error');
    //         return;
    //     }
    //     // JSON 형식으로 데이터 전송
    //     res.json(JSON.parse(data));
    // });
    const url = req.body.url;
    const crawlJson = await crawlControll.crawlAndSave(url);
    console.log(crawlJson);
    return res.json({mes : crawlJson});
}

module.exports = {crawlApi};