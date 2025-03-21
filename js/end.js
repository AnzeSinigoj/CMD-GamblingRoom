let title = document.getElementById('title-gamble'); //Naslov strani 
let title_bar = document.getElementById('title-bar'); //Title bilik bar
let player_div = document.getElementById('players'); //Plac za igralce
let game_len_lab = document.getElementById('len'); //Label za gamelen
let round_len_lab = document.getElementById('r_len'); //Label za round len
let menu = document.getElementById('menu'); //Menu gumb

//uporabnik data
let users = [];
let colors = [];
let score = [];

//game data
let game_len = 1;
let round_len = 1;

async function loadData() { //Podatke pobrane iz session storage damo v dive in to
    player_div.innerHTML = '';
    game_len_lab.textContent = 'Rounds played: ' + round_c;
    round_len_lab.textContent = 'Dices thrown: '+ (round_len * users.length * game_len);

    for (let i = 0; i < users.length; i++) {
        let cUser = users[i];
        let cColor = colors[i];
        let cScore = score[i];

        player_div.innerHTML += 
        `<div class="entry">
            <div class="space">
                <p id="pos${i}">${i+1}.</p>
            </div>
            <div class="space">
                <p id="name${i}">${cUser}</p>
            </div>
            <div class="space">
                <p id="color${i}">${cColor}</p>
            </div>
            <div class="spaceS">
                <p id="score${i}">${cScore}</p>
            </div>
        </div>`;

        await sleep(10); //pocakamo da se elementi nalozijo
        let elements = ['pos'+i, 'name'+i, 'color'+i, 'score'+i];
        elements.forEach(e => {
            document.getElementById(e).style.setProperty('color', cColor, 'important');
        });
        await sleep(100);
    }

}

function retrieveData() { //samo umevno poberemo podatke is session storage
    //user data
    users = JSON.parse(sessionStorage.getItem("users")) || [];
    colors = JSON.parse(sessionStorage.getItem("colors")) || [];
    score = JSON.parse(sessionStorage.getItem("score")) || [];

    //game data
    round_c = sessionStorage.getItem('game_len');
    round_len = sessionStorage.getItem('round_len');
}


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
    const text = "Game scoreboard";

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

menu.addEventListener('click', function(){
    window.location.href = "../index.html";
});

window.onload = function () { //Ko se stran zlouda 
    retrieveData();

    genFakeTestData(); //REMOVE

    loadData();

    napisi();
};