const express = require('express');
const fsp = require('fs/promises');
const fs = require('fs');
const path = require("path");
const cors = require("cors");
const app = express();

app.use(cors())
/*
  index -> lvl
    0       1
    1       2
    2       3
    3       4
    4       5
*/
var DATASET = [];

//this is for keeping the server alive by pinging
app.get("/keep-alive",(req,res)=>{
    res.send("Hi")
})

function getRandomKanjiChoice(choice){
    //for a single choice case
    const count= DATASET[choice].length;
    //choose a random kanji
    const kanji_random = Math.floor(Math.random() * count);
    return DATASET[choice][kanji_random];
}




function getRandomKanjiRange(start,end){
    //end should the smaller number eg n1,n2
    let rand = 0;
    if(start === end){
        rand = start-1;
    }else{
        //the first () is by n-lvl. so we need to -1 for the index
        rand =  (Math.floor(Math.random() * (start - end + 1)) + end)
        console.log("should be less than start :" + start + ":" + rand)
    }
    const count= DATASET[rand].length;
    //choose a random kanji
    const kanji_random = Math.ceil(Math.random() * count);

    return DATASET[rand][kanji_random];
}

//this will be random for a single lvl
app.get("/kanji/random/:lvl",(req,res)=>{
    const lvl = Number(req.params.lvl) || 5;
    //need to translate the lvl into the index 
    //lvl - 1 = index
    res.send(getRandomKanjiChoice(lvl-1));
})

//for the range
//query will be start and end
app.get("/kanji/random/",(req,res)=>{
    const start = Number(req.query.start);
    const end = Number(req.query.end);

    if(start < 1 || start > 5 || end < 1 || end > 5 || end > start){
        res.status(400).send("Starting and ending point should be in the range of 1 - 5 and start should be greater");
        return;
    }

    res.status(200).send(getRandomKanjiRange(start,end))
})



app.get("/kanji/:lvl",async (req,res)=>{
    let lvl = Number(req.params.lvl) || 5;
    //to check the input is greater than 0 AND LESS than 6
    //1 to 5
    if(!(lvl > 0 && lvl < 6)){
        res.status(404)
        res.send("Invalid request 404")
        return;
    }
    res.send(DATASET[lvl-1])
})



async function loadData(){
    const files = await fsp.readdir("./data/");
    for(i=0;i<files.length;i++){
        const file_name = files[i];
        const file = await fsp.readFile(path.join(__dirname,'data',file_name));
        let ary = JSON.parse(file.toString())
        DATASET.push(ary)
    }


    console.log("loading completed!");
}

app.listen(process.env.PORT || 3000,(req,res)=>{
    loadData()
    console.log("The show has began!")
})