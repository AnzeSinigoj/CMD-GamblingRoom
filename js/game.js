let title = document.getElementById('title-gamble'); //Naslov strani 
let title_bar = document.getElementById('title-bar'); //Title bilik bar
let player_div = document.getElementById('user-data'); //Div kjer so displayed igralci
let game_len_lab = document.getElementById('game_len'); //Label za dolzino igre
let round_len_lab = document.getElementById('round_len'); //Label za dolzino rounda
let user_lab = document.getElementById('cUser'); //Lable za user v game div
let score_lab = document.getElementById('cScore'); //Lable za user score v game div
let throw_btn = document.getElementById('throw'); //Throw button
let start_btn = document.getElementById('start'); //Start button
let dice = document.getElementById('a_dice'); //Div kateri drzi kocko

//user data
let users = [];
let gamemodes = [];
let colors = [];
let score = [];

//game data
let round_c = 1;
let round_len = 1;


const DICE_FACES = [
`+-----------+
|           |
|     o     |
|           |
+-----------+`,
`+-----------+
| o         |
|           |
|         o |
+-----------+`,
`+-----------+
| o         |
|     o     |
|         o |
+-----------+`,
`+-----------+
| o       o |
|           |
| o       o |
+-----------+`,
`+-----------+
| o       o |
|     o     |
| o       o |
+-----------+`,
`+-----------+
| o       o |
| o       o |
| o       o |
+-----------+`
];

function getRandomInt(min, max) { //Vrne random int
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function sleep(ms) { //spi N ms
    return new Promise(resolve => setTimeout(resolve, ms));
}

let isRunning = false;
let isBlinking = false;

async function napisi() { //funkcja ki simulira rocno tipkanje teksta
    if (isRunning) return;
    isRunning = true;
    isBlinking = false;

    title.textContent = '>';
    const text = "Gambling room";

    blinkBar();
    await sleep(500);
    for (let i = 0; i < text.length; i++) {
        title.textContent = `> ${text.slice(0, i + 1)}`;
        await sleep(getRandomInt(100, 250));
    }

    isRunning = false;
    
    blinkBar();
}

async function blinkBar() { //blink za cursor
    if (isBlinking) return;  
    isBlinking = true;

    while (isBlinking) {
        title_bar.style.color = 'black';
        await sleep(700);
        title_bar.style.color = '#00FF00';
        await sleep(700);
    }
}

async function rollDice(id) { //Zavrti kocko in updejta score
    dice.style.fontSize = '4vw';
    let diceNum;
    let delay = 10;

    for (let i = 0; i < 25; i++) {
        diceNum = Math.floor(Math.random() * 6);
        dice.textContent = DICE_FACES[diceNum];
        
        await sleep(delay);
        
        delay += 10; 
    }
    score[id] += diceNum + 1;
    score_lab.textContent = (score[id]); //update score
    updateScoreboard();

    //blink 3 krat po izboru
    for (let i = 0; i <3; i++) {
        dice.style.color = 'black';
        await sleep(150);
        dice.style.color = '#00FF00';
        await sleep(150);
    }

    await sleep(3000);
    await notifyAndUpdate(diceNum+1); 
}

async function notifyAndUpdate(score){ //Pokazemo userju da za koliko se je zvisal score
    dice.style.fontSize = '3.5vw';
    dice.textContent= `Score incremented by ${score}`;
    await sleep(1500);
}

async function countdown(s) { //Preprost odstevalnik
    dice.style.fontSize = '4vw';
    for (let i = s; i > 0; i--) {
        dice.textContent = i;
        await sleep(1000);
    }
}

async function play() { //odigra eno rundo 
        for (let i = 0; i < users.length; i++) {
            for (let r = 1; r <= round_len; r++) {
                round_len_lab.textContent = `Throw: ${r}/${round_len}`; //updejatmo counter
         
                dice.textContent = '';
                user_lab.textContent = users[i];
                user_lab.style.setProperty('color', colors[i], 'important');

                score_lab.textContent = score[i];
                score_lab.style.setProperty('color', colors[i], 'important');

                throw_btn.disabled = gamemodes[i];

                if (gamemodes[i]) {
                    await countdown(3); 
                    await rollDice(i); 
                } else {
                    await waitForEvent(throw_btn); 
                    throw_btn.disabled = true;
                    await rollDice(i);
                }
        }
    }
}

function waitForEvent(element) { //Funkcja ki pocaka do konca necesa
    return new Promise((resolve) => {
        element.addEventListener("click", function handler(event) {
            element.removeEventListener("click", handler);
            resolve(event); 
        });
    });
}

function updateScoreboard() { //Posodibimo scoreboard !POTREBNO BO SORTIRAT IN SPREMINJAT INDEKSE VSEM TABELAM!
    for (let i = 0; i < users.length; i++) {
        let score_lab = document.getElementById('score'+i);
        score_lab.textContent = score[i];
    }
}

async function loadData() { //Podatke pobrane iz session storage damo v dive in to
    player_div.innerHTML = '';
    game_len_lab.textContent = 'Game length: ' + round_c;
    round_len_lab.textContent = 'Throws per round: '+ round_len;

    for (let i = 0; i < users.length; i++) {
        let cMode = gamemodes[i]?"A":"M";
        let cUser = users[i];
        let cColor = colors[i];
        score[i] = 0;

        player_div.innerHTML += 
        `<div class="player">
            <div class="space">
                <p id="mode${i}">${cMode}</p>
            </div>
            <div class="space">
                <p id="name${i}">${cUser}</p>
            </div>
            <div class="space">
            <p id="score${i}">${score[i]}</p>
            </div>
        </div>`;

        await sleep(10); //pocakamo da se elementi nalozijo
        let elements = ['name'+i, 'mode'+i, 'score'+i];
        elements.forEach(e => {
            document.getElementById(e).style.setProperty('color', cColor, 'important');
        });
        await sleep(100);
    }

}

function retrieveData() { //samo umevno poberemo podatke is session storage
    //user data
    users = JSON.parse(sessionStorage.getItem("users")) || [];
    gamemodes = JSON.parse(sessionStorage.getItem("gamemodes")) || [];
    colors = JSON.parse(sessionStorage.getItem("colors")) || [];


    //game data
    round_c = sessionStorage.getItem('game_len');
    round_len = sessionStorage.getItem('round_len');

}

function genFakeTestData() { //SAMO ZA TESTIRANJE NAREDI FAKE USER DATA ZA TESTIRAT FUNKCJONALNOST
    round_c = 7;
    round_len = 3;
    users = [
        "Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Hannah", "Ivy", "Jack", 
        "Kenny", "Liam", "Mona", "Nina", "Oscar", "Paul", "Quinn", "Rita", "Sam", "Tom", 
        "Uma", "Vera", "Will", "John", "Yara", "Zara"
    ];

    colors = [
        "#FFDDC1", "#FFD700", "#90EE90", "#ADD8E6", "#FFB6C1", "#FF69B4", "#FFE4B5", "#FFFFE0", 
        "#F0E68C", "#D3D3D3", "#F5F5F5", "#FAFAD2", "#E0FFFF", "#FFFAF0", "#FFE4E1", "#FF6347", 
        "#98FB98", "#E6E6FA", "#B0E0E6", "#C1FFC1", "#FF98FB", "#FFF0F5", "#D8BFD8", "#F0FFF0", "#F4A300"
    ];

    gamemodes = [
        true, false, true, true, false, true, false, true, false, true, 
        false, true, true, false, true, false, true, false, true, false, 
        true, false, true, false, true, false
    ];

    for (let i = 0; i < users.length; i++) {
        score[i] = 0;
    }

    console.log("Fake data inserted!");
}

start_btn.addEventListener('click', async function() {
    start_btn.disabled = true;
    await startGame();
});

async function startGame() { //startamo dejansko igro
    for (let i = 1; i <= round_c; i++) {
        game_len_lab.textContent = `Game length: ${i}/${round_c}`;
        await play(); 
    }
    //Shranimo podatke
    sessionStorage.setItem("users", JSON.stringify(users));
    sessionStorage.setItem("colors", JSON.stringify(colors));
    sessionStorage.setItem("score", JSON.stringify(score));

    window.location.href = "end.html";
}


window.onload = function () { //Ko se stran zlouda
    throw_btn.disabled = true;
    retrieveData();

    //genFakeTestData(); //REMOVE BEFORE FLIGHT!!!

    loadData();

    napisi();
};
