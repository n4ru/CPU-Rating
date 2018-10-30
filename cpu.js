const fluidb = require('fluidb'),
    request = require('request-promise-native'),
    cheerio = require('cheerio'),
    BigNumber = require('bignumber.js');
const db = new fluidb('db');

sleep = (ms) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, ms)
    });
}

getScores = async (cpu, id) => {
    try {
        return cheerio.load(await request("https://www.cpubenchmark.net/" + cpu))
    } catch (e) {
        console.log("Error. Sleeping 1s.")
        await sleep(1000);
        return getScores(cpu);
    }
}

(async () => {
    data = await request('https://www.cpubenchmark.net/singleThread.html');
    let $ = cheerio.load(data);
    let stack = null;
    await $('#mark .chart a:not([href*=price])')
        .each(async (id, el) => {
            await sleep(100 * id);
            let $$ = await getScores($(el).attr("href"), id)
            let launch = $$('.desc td').eq(2).text().match(/First Seen on Charts:(.*)/)[1].trim();
            db[id] = {
                "CPU": $(el).text().replace(/ ?@.*/, ''),
                "link": "https://www.cpubenchmark.net/" + $(el).attr("href"),
                "speed": parseFloat(($$('.desc em').first().html().match(/<strong>Turbo Speed:\<\/strong> (.*?)<br>/) || $$('.desc em').first().html().match(/<strong>Clockspeed:\<\/strong> (.*?)<br>/))[1]) * 1000,
                "single": parseInt($$('.desc td').eq(3).html().match(/Single Thread Rating: (.*)<br>/)[1]),
                "score": parseInt($$('.desc td').eq(3).find('span').first().text().replace(/\<sup\>2\<\/sup\>/, '')),
                "samples": parseInt($$('.desc td').eq(3).html().match(/Samples: (.*)<br>/)[1]),
                "cores": parseInt($$('.desc em').first().html().match(/<strong>No of Cores:\<\/strong> ([0-9]*) ?/)[1]) || 1,
                "socket": /<strong>Socket:\<\/strong> (.*?) ?<br>/.test($$('.desc em').first().html()) ? $$('.desc em').first().html().match(/<strong>Socket:\<\/strong> (.*?) ?<br>/)[1] : null,
                "threads": parseInt($$('.desc em').first().html().match(/<strong>No of Cores:\<\/strong> ([0-9]*) ?/)[1]) * ($$('.desc em').first().text().includes("2 logical cores per") ? 2 : 1),
                "launch": launch.substr(3, 5) + "." + launch.substr(1, 1)
            }
            db[id].index = parseInt(new BigNumber(db[id].single).dividedBy(db[id].speed).times(10000).toFixed(0));
            console.log(`${db[id].CPU} @ ${db[id].speed} : ${db[id].index} Real PPC (${id + 1}/${$('#mark .chart a:not([href*=price])').length})`);
        })
})();