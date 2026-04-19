let allSymbols=[
'😀','🌷','🌻','😎','😍','🍓','😜','🥳',
'🌼','🌞','🍩','✨','⭐','🌟','🎀','🍭',
'💐','🧁'
];

let cards=[];
let firstCard=null;
let secondCard=null;
let lock=false;

let moves=0;
let time=0;
let timer;
let gameStarted=false;

const board=document.getElementById("board");
let playerName="Player";

// SHOW NAME POPUP BEFORE GAME
window.onload = function() {
  document.getElementById("namePopup").style.display="flex";
};

// START GAME AFTER ENTERING NAME
function startGameWithName(){
  const inputName=document.getElementById("playerName").value.trim();
  playerName = inputName || "Player";

  document.getElementById("namePopup").style.display="none";
  startGame();
}

// TIMER
function startTimer(){
  if(gameStarted) return;
  gameStarted=true;
  timer=setInterval(()=>{
    time++;
    document.getElementById("time").innerText=time;
  },1000);
}

// START GAME
function startGame(){
  board.innerHTML="";
  firstCard=null;
  secondCard=null;
  lock=false;
  gameStarted=false;

  let level=parseInt(document.getElementById("difficulty").value);
  let symbols=allSymbols.slice(0,level);

  cards=[...symbols,...symbols];
  cards.sort(()=>Math.random()-0.5);

  moves=0;
  time=0;

  document.getElementById("moves").innerText=moves;
  document.getElementById("time").innerText=time;

  clearInterval(timer);

  let columns = (level==8)?4:(level==10)?5:9;
  board.style.gridTemplateColumns=`repeat(${columns}, auto)`;

  cards.forEach(symbol=>{
    let card=document.createElement("div");
    card.classList.add("card");

    if(level==18){
      card.style.width="60px";
      card.style.height="60px";
    }

    card.innerHTML=`
      <div class="card-inner">
        <div class="card-front">?</div>
        <div class="card-back">${symbol}</div>
      </div>
    `;

    card.dataset.symbol=symbol;
    card.addEventListener("click",flipCard);
    board.appendChild(card);
  });

  document.getElementById("popup").style.display="none";
}

// FLIP CARD
function flipCard(){
  if(lock || !gameStarted) return;
  if(this===firstCard) return;

  this.classList.add("flipped");

  if(!firstCard){
    firstCard=this;
    return;
  }

  secondCard=this;

  moves++;
  document.getElementById("moves").innerText=moves;

  checkMatch();
}

// CHECK MATCH
function checkMatch(){
  if(firstCard.dataset.symbol===secondCard.dataset.symbol){
    firstCard=null;
    secondCard=null;
    checkWin();
  }else{
    lock=true;
    setTimeout(()=>{
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      firstCard=null;
      secondCard=null;
      lock=false;
    },800);
  }
}

// CHECK WIN
function checkWin(){
  let flipped=document.querySelectorAll(".flipped");
  if(flipped.length===cards.length){
    clearInterval(timer);
    showConfetti();

    document.getElementById("result").innerText=
      `Moves: ${moves} | Time: ${time} sec`;

    document.getElementById("popup").style.display="flex";

    saveScore(time);
  }
}

// DARK MODE
function toggleDark(){
  document.body.classList.toggle("dark");
  let btn=document.getElementById("darkToggle");
  btn.innerText=document.body.classList.contains("dark")?"☀️":"🌙";
}

// STOP GAME
function stopGame(){ clearInterval(timer); }

// CONFETTI
function showConfetti(){
  confetti({
    particleCount:150,
    spread:70,
    origin:{y:0.6}
  });
}