// 네이버 웹툰 크롤링
const puppeteer = require('puppeteer');

async function crawlAndSave(url) {
    // Puppeteer를 headless 모드로 실행. 리눅스 환경에서도 문제없이 작동합니다.
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // 리눅스 환경에서의 추가적인 설정
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    await page.waitForSelector('#cbox_module_wai_u_cbox_content_wrap_tabpanel'); 

    let crawlingResults = {};

    const title = await page.$eval('#titleName_toolbar > strong', el => el.innerText);
    const subtitle = await page.$eval('#subTitle_toolbar', el => el.innerText);
    crawlingResults['title'] = title;
    crawlingResults['subtitle'] = subtitle;

    let comments = await page.$$eval("#cbox_module_wai_u_cbox_content_wrap_tabpanel > ul > li > div > div > div:nth-child(2) > span:nth-child(2)", elements => elements.map(element => element.innerText));
    crawlingResults['comments'] = comments;

    console.log(JSON.stringify(crawlingResults, null, 4));
    
    await browser.close();
    return JSON.stringify(crawlingResults, null, 4);
}

module.exports = {crawlAndSave};