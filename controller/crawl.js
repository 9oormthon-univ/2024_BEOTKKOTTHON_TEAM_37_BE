const crawlControll = require("../crawling_kakao");

const crawlApi = async (req, res) => {
    const url = req.body.url;
    const crawlJson = await crawlControll.crawlAndSave(url);
    // console.log(crawlJson);

    // 1번째와 2번째 댓글만 가져오기
    const crawlResult = JSON.parse(crawlJson);
    const Comments = crawlResult.comments.slice(0, 3);
    
    console.log("1번째 댓글:", Comments[0]);
    console.log("2번째 댓글:", Comments[1]);
    console.log("3번째 댓글:", Comments[2]);

    // 후에 opan API 받아서 호출
    
    // 필터링 댓글 반환

    return res.json({mes : crawlJson});
}

module.exports = {crawlApi};