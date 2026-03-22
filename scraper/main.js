const axios = require("axios");
const cheerio = require("cheerio");
const fsp = require("fs/promises");
const fs = require("fs");

//n5 to n1
let n=5;

function clearDir(dirName){
    if(!fs.existsSync(dirName)){
        console.log("it doesnt exist")
        fs.mkdir("./data/",(err)=>{
            if(err) throw err;
        })

        return;
    }else{
   
        fs.rm(dirName,{recursive:true,force:true},
            (err)=>{
                if(err) throw err;
                fs.mkdir("./data/",(err)=>{
                    if(err) throw err;
                })

            }            
        )

    }
}
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}






async function wrapIt(number){
    while(n >= 2){
        let current_lvl = [];
        console.log(n)
        let PageUrl = `https://jlptsensei.com/jlpt-n${n}-kanji-list/`
        const {data:html} = await axios.get(PageUrl);
        const $ = cheerio.load(html)
        const pages = parseInt($("nav > ul.pagination > li:nth-last-child(2)").text()) || 1//find out total pages to scrape
        //make another url based on the number of pages
        for(let i=1;i<=pages;i++){
            // await delay(1000);
            //i know, i will confuse you more
            let url = i === 1 ? PageUrl :  `https://jlptsensei.com/jlpt-n${n}-kanji-list/page/${i}/`;
            console.log(url);
            await fetchOnly(url,current_lvl);
            
        }
        await fsp.writeFile(`./data/n${n}-kanji.txt`,JSON.stringify(current_lvl,null,2))
        console.log(current_lvl.length)
        n--;
    }

}


async function fetchOnly(url,ary) {
    
    const { data: html } = await axios.get(url);
    await parseHTML(html,ary);
}


async function parseHTML(dump,ary) {
    const $ = cheerio.load(dump);
    let init = ary.length;
   
    $('table#jl-kanji > tbody > tr').each((i, row) => {
        const cols = $(row).find('td');
        ary.push({
            level:`n${n}`,
            number:$(cols[0]).text().trim(),
            kanji: $(cols[1]).text().trim(),
            onyomi: $(cols[2]).text().trim(),
            kunyomi: $(cols[3]).text().trim(),
            meaning: $(cols[4]).text().trim()
        })
    });

    console.log("Changes: ", ary.length - init);
}





wrapIt(n)