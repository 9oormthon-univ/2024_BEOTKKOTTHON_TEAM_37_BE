const puppeteer = require('puppeteer');
const fs = require('fs');

async function crawlAndSave(url) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    // 제목과 부제목 크롤링
    const decodedURL = decodeURIComponent(url);
    console.log(decodedURL);

    const pathParts = decodedURL.split('/');
    const comicName = pathParts[4]; // URL 디코딩 추가
    const titleParts = comicName.split('-');
    const title = titleParts.slice(0, -1).join(' ');
    const number = titleParts.pop();
    console.log(title);
    console.log(number);

    const crawlingResults = {
        title: title,
        number: number
    };

    // 부제목 사용 예시 수정
    const subtitleElement = await page.waitForSelector('::-p-xpath(//*[@id="root"]/main/div/div/div[1]/div[2]/div[1]/p)');
    const subtitle = await page.evaluate(el => el.innerText, subtitleElement);
    crawlingResults['subtitle'] = subtitle;

    const element = await page.waitForSelector('::-p-xpath(/html/body/div[1]/div/main/div/div/div[3]/div[2]/div/div[3]/a/img)');
    if (element) {
        await element.evaluate(e => e.scrollIntoView({ block: 'center' }));
        await element.click();
    }

    // 댓글 크롤링 사용 예시 수정
    const commentsListSelector = '::-p-xpath(/html/body/div[3]/div/div/div/div[4]/div/ul)';
    const commentsListElement = await page.waitForSelector(commentsListSelector);
    const comments = await page.evaluate(element => {
        const commentsNodes = Array.from(element.querySelectorAll('li > div.flex.items-baseline.py-20.z-1 > div > div:nth-child(1) > div.relative.w-full.h-full.overflow-hidden.mt-8 > p'));
        return commentsNodes.map(node => node.innerText);
    }, commentsListElement);
    crawlingResults['comments'] = comments.slice(0, 20);

    // 결과를 JSON 파일로 저장
    fs.writeFileSync('./results.json', JSON.stringify(crawlingResults, null, 4), 'utf-8');
    
    await browser.close();
    return crawlingResults; // JSON 객체로 반환
}

module.exports = { crawlAndSave };
