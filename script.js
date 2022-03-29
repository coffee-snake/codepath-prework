
const clueHoldTime = 1000;
const cluePauseTime = 333;
const nextClueWaitTime = 1000;
const numberOfButtons = 4;
const patternSize = 8;

var pattern = [];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = .3;
var guessCounter = 0;

function fillWith(){
  pattern = [];
  while(pattern.length < patternSize){
    var randomInt = Math.floor(Math.random()*numberOfButtons)+1;
    pattern.push(randomInt);
  }
  
}


function startGame(){
  progress = 0;
  fillWith()
  gamePlaying = true;
  document.getElementById("startButton").classList.add("hidden");
  document.getElementById("endButton").classList.remove("hidden");
  playClueSequence();
}

function stopGame(){
  gamePlaying = false;
  document.getElementById("startButton").classList.remove("hidden");
  document.getElementById("endButton").classList.add("hidden");  

}


function lightButton(buttonNumber){
  document.getElementById("button"+buttonNumber).classList.add("lit");
}


function clearButton(buttonNumber){
  document.getElementById("button"+buttonNumber).classList.remove("lit");
}

function playSingleClue(buttonNumber){
  if(gamePlaying){
    lightButton(buttonNumber);
    playTone(buttonNumber,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,buttonNumber);
    
  }
}

function playClueSequence(){
  guessCounter = 0;
  let delay = nextClueWaitTime;
  for(let i = 0; i<=progress;i++){
    console.log("play single clue: "+pattern[i]+" in "+delay+"ms");
    setTimeout(playSingleClue, delay, pattern[i]);
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
}

function guess(buttonNumber){
  console.log("user guessed: "+buttonNumber);
  if(!gamePlaying){
    return;
  }
  if (pattern[guessCounter]==buttonNumber){
    if(guessCounter < progress){
      guessCounter++;
    }
    else{
      if(progress < pattern.length -1){
        progress++;
        playClueSequence();
      }
      else{
        gameWon();
      }
    }
    
  }
  else{
    gameLost();
  }
  
}

function gameLost(){
  stopGame();
  alert("Game Over. You lost.");

}

function gameWon(){
  stopGame();
  alert("Good job, game is now over. You WON!!! :)")
}


// Sound Synthesis Functions
const freqMap = {
  1: 230.1,
  2: 310.2,
  3: 392,
  4: 466.2
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}
function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)