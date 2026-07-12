// THEMES

const themes = {

    easy:{
        title:"🐾 Animal Memory Match",
        symbols:["🐶","🐱","🐰","🦊","🐼","🦁","🐸","🐨"]
    },

    medium:{
        title:"😀 Emoji Memory Match",
        symbols:["😀","😍","😎","🥳","🍓","🍩","⭐","🎀","🌷","🌻"]
    },

    hard:{
        title:"🚀 Space Memory Match",
        symbols:[
            "🚀","🪐","🌍","🌙","☄️","🌌",
            "⭐","🛰️","👽","🌠","🔭","🛸",
            "🌞","🌑","🌎","🌟","💫","🧑‍🚀"
        ]
    }

};

// VARIABLES

let cards=[];

let firstCard=null;
let secondCard=null;

let lockBoard=false;

let moves=0;
let time=0;

let timer=null;

let gameStarted=false;
let gamePaused=false;

let playerName="Player";

let currentTheme="medium";

const matchSound = new Audio("match.mp3");
const wrongSound = new Audio("wrong.mp3");

// ELEMENTS
const board=document.getElementById("board");

const movesDisplay=document.getElementById("moves");
const timeDisplay=document.getElementById("time");
const bestDisplay=document.getElementById("bestScore");

const popup=document.getElementById("popup");
const result=document.getElementById("result");

const gameTitle=document.getElementById("gameTitle");

// PAGE LOAD

window.onload=()=>{

    document
    .getElementById("namePopup")
    .classList
    .add("show");

};

// PLAYER NAME

function startGameWithName(){

    const input=document
    .getElementById("playerName");

    if(input.value.trim()===""){

        alert("Please enter your name.");

        input.focus();

        return;

    }

    playerName=input.value.trim();

    document
    .getElementById("player")
    .innerText=playerName;

    document
    .getElementById("namePopup")
    .classList
    .remove("show");

    

}

// TIMER

function startTimer(){

    clearInterval(timer);

    timer=setInterval(()=>{

        if(!gamePaused){

            time++;

            timeDisplay.innerText=time;

        }

    },1000);

}

// START GAME

function startGame(){

    clearInterval(timer);

    board.innerHTML="";

    firstCard=null;
    secondCard=null;

    lockBoard=false;

    moves=0;
    time=0;

    gamePaused=false;
    gameStarted=true;

    movesDisplay.innerText=0;
    timeDisplay.innerText=0;

    popup.style.display="none";

    document
    .getElementById("pauseBtn")
    .innerHTML="⏸ Pause";

    showStatus("");

    changeTheme();

    createCards();
   
    startTimer();
    

}

// CHANGE THEME

function changeTheme(){

    const level=parseInt(
        document.getElementById("difficulty").value
    );

    if(level===8){

        currentTheme="easy";
        board.style.gridTemplateColumns="repeat(4,80px)";

    }

    else if(level===10){

        currentTheme="medium";
        board.style.gridTemplateColumns="repeat(5,80px)";

    }

    else{

        currentTheme="hard";
        board.style.gridTemplateColumns="repeat(6,80px)";

    }

    // Theme Change
    document.body.classList.remove(
        "easy",
        "medium",
        "hard"
    );

    document.body.classList.add(currentTheme);

    gameTitle.innerHTML="🧠 Memory Matching Game 🎯";
    loadBestScore();

}

// CREATE CARDS

function createCards(){

    cards=[
        ...themes[currentTheme].symbols,
        ...themes[currentTheme].symbols
    ];

    shuffle(cards);

    cards.forEach(symbol=>{

        const card=document.createElement("div");

        card.className="card";

        card.dataset.symbol=symbol;

        card.innerHTML=`

            <div class="card-inner">

                <div class="card-front">?</div>

                <div class="card-back">${symbol}</div>

            </div>

        `;

        card.addEventListener(
            "click",
            flipCard
        );

        board.appendChild(card);

    });

}

// SHUFFLE

function shuffle(array){

    for(let i=array.length-1;i>0;i--){

        let j=Math.floor(
            Math.random()*(i+1)
        );

        [array[i],array[j]]=
        [array[j],array[i]];

    }

}

// FLIP CARD

function flipCard(){

    if(!gameStarted) return;

    if(gamePaused) return;

    if(lockBoard) return;

    if(this===firstCard) return;

    this.classList.add("flipped");

    if(firstCard===null){

        firstCard=this;

        return;

    }

    secondCard=this;

    moves++;

    movesDisplay.innerText=moves;

    checkMatch();

}

// CHECK MATCH

function checkMatch(){

    if(firstCard.dataset.symbol===secondCard.dataset.symbol){
        matchSound.play();

        firstCard.removeEventListener(
            "click",
            flipCard
        );

        secondCard.removeEventListener(
            "click",
            flipCard
        );

        firstCard=null;
        secondCard=null;

        checkWin();

    }

    else{

        wrongSound.play();
        lockBoard=true;

        setTimeout(()=>{

            firstCard.classList.remove("flipped");

            secondCard.classList.remove("flipped");

            firstCard=null;

            secondCard=null;

            lockBoard=false;

        },800);

    }

}

// CHECK WIN

function checkWin(){

    const flipped=document.querySelectorAll(
        ".card.flipped"
    );

    if(flipped.length!==cards.length) return;

    clearInterval(timer);

    gameStarted=false;

    showConfetti();

    let heading="🎉 Congratulations!";

    if(currentTheme==="easy"){

        heading="🐾 Paw-some!";

    }

    else if(currentTheme==="medium"){

        heading="😀 Awesome Memory!";

    }

    else{

        heading="🚀 Mission Complete!";

    }

    document.querySelector(
        "#popup h2"
    ).innerHTML=heading;

    result.innerHTML=`

        👤 <b>${playerName}</b><br><br>

        🎯 Moves : <b>${moves}</b><br>

        ⏱ Time : <b>${time} sec</b>

    `;

    popup.style.display="flex";

    saveBestScore();

}

// CONFETTI

function showConfetti(){

    let colors=["#8b5cf6"];

    if(currentTheme==="easy"){

        colors=[
            "#16a34a",
            "#22c55e",
            "#86efac"
        ];

    }

    else if(currentTheme==="medium"){

        colors=[
            "#8b5cf6",
            "#c084fc",
            "#e879f9"
        ];

    }

    else{

        colors=[
            "#2563eb",
            "#ffffff",
            "#facc15"
        ];

    }

    confetti({

        particleCount:180,

        spread:90,

        origin:{y:0.6},

        colors:colors

    });

}

// BEST SCORE

function saveBestScore(){

    const key="memoryBest_"+currentTheme;

    let best=JSON.parse(localStorage.getItem(key));

    if(best===null || time<best.time){

        best={

            name:playerName,

            time:time,

            moves:moves

        };

        localStorage.setItem(

            key,

            JSON.stringify(best)

        );

    }

    loadBestScore();

}

function loadBestScore(){

    const key="memoryBest_"+currentTheme;

    let best=JSON.parse(localStorage.getItem(key));

    if(best===null){

        bestDisplay.innerHTML="--";

        return;

    }

    bestDisplay.innerHTML=

    `${best.time}s <br>${best.moves} Moves`;

}

// STATUS MESSAGE

function showStatus(text){

    document.getElementById("gameStatus").innerHTML=text;

}

// TOGGLE PAUSE

function togglePause(){

    if(!gameStarted) return;

    const btn=document.getElementById("pauseBtn");

    gamePaused=!gamePaused;

    if(gamePaused){

        btn.innerHTML="▶ Resume";

        showStatus("⏸ Game Paused");

    }

    else{

        btn.innerHTML="⏸ Pause";

        showStatus("▶ Game Resumed");

        setTimeout(()=>{

            showStatus("");

        },1200);

    }

}

// STOP GAME

function stopGame(){

    clearInterval(timer);

    gameStarted=false;

    gamePaused=false;

    moves=0;

    time=0;

    board.innerHTML="";

    firstCard=null;

    secondCard=null;

    movesDisplay.innerHTML=0;

    timeDisplay.innerHTML=0;

    popup.style.display="none";

    document.getElementById("pauseBtn").innerHTML="⏸ Pause";

    showStatus("⛔ Game Stopped");

}

function newGame(){

    popup.style.display="none";

    board.innerHTML="";

    cards=[];

    firstCard=null;
    secondCard=null;

    gameStarted=false;

    moves=0;
    time=0;

    movesDisplay.innerText=0;
    timeDisplay.innerText=0;

    clearInterval(timer);

    showStatus("🎯 Choose Difficulty");

}

// DARK MODE

function toggleDark(){

    document.body.classList.toggle("dark");

    document.getElementById("darkToggle").innerHTML=

    document.body.classList.contains("dark")

    ? "☀️"

    : "🌙";

}

// DIFFICULTY CHANGE

function chooseDifficulty(){

    popup.style.display="none";

    board.innerHTML="";

    cards=[];

    firstCard=null;
    secondCard=null;

    gameStarted=false;

    moves=0;
    time=0;

    movesDisplay.innerText=0;
    timeDisplay.innerText=0;

    clearInterval(timer);

    showStatus("🎯 Choose Difficulty & Press Start");

}

document.getElementById("difficulty")

.addEventListener("change",()=>{

    if(document.getElementById("difficulty").value==8){

        showStatus("🐾 Animal Theme");

    }

    else if(document.getElementById("difficulty").value==10){

        showStatus("😀 Emoji Theme");

    }

    else{

        showStatus("🚀 Space Theme");

    }

    changeTheme();

});

// LOAD BEST SCORE

window.addEventListener("load",()=>{

    changeTheme();

    loadBestScore();

});
