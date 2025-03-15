//Deklaracja vsega
let len_sl = document.getElementById('length'); //Slider za dolzino igre
let len_lab = document.getElementById('len-lab'); //Label za dolzino
let th_sl = document.getElementById('throws'); //Slider za kolicino metov na rundo
let th_lab = document.getElementById('throw-lab'); //Label za kolicino
let title = document.getElementById('title-gamble'); //Naslov strani 
let p_count = document.getElementById('p_count'); //Slider za stevilo igralcev
let p_lab = document.getElementById('p_c'); //Label za st igralcev
let players = document.getElementById('players'); //Div za igralce -parent
let play_b = document.getElementById('play-b'); //Gumb za igrat
let play_disabled_name = false; //true: ce je aktivna napaka pri kakem imenu 
let play_disabled_color = false;//true: ce je aktrivna napaka pri kaki barvi
let player_names = new Set(); //Imena igralcev
let player_colors = [];

let players_c = 2; //Stevilo igralcev

function addPlayer(oldname, name, index) { //Metoda ki doda igralca brez dodajanja duplikatov
    player_names.delete(oldname); 
    if (player_names.has(name)) { 
        warnPlayer(index);
    }else{
        player_names.add(name);
    }
}

function warnPlayer(index) { //Metoda ki opozori igralca ce je nastavil duplikatno ime
    console.log(player_names);
    console.log(index);
    let name_h1 = document.getElementById('name' + index); 
    let name_e = document.getElementById('name-err' + index);
    name_h1.textContent = 'NULL';
    name_e.textContent = 'Cannot use the same name!';
    name_e.style.display = 'block';
    play_disabled_name = true;
    updatePlay();
}

function genPlayers(n) { //Metoda ki generira forme za igralce
    let userDiv = '';
    players_c = n;
    play_disabled_name = false;
    play_disabled_color = false;
    player_names.clear();
    updatePlay();

    for (let i = 1; i <= n; i++) { //Dodamo vsakega igralca posebej v div in mu damo svoj lasten id, vsak id igralca je enak njegovemu indeksu v setu
        const name = `Player ${i}`;
        const id = i;
        addPlayer(name, name, i); //Set je prazen lahko damo oba parametra enako ker itak .del nebo nic zbrisu ce ne najde
        player_colors.push('#00FF00');

        const p_div = `
        <div class="addP">
            <h1 id="name${id}">${name}</h1>
            <p>Input user name:</p>
            <input type="text" id="pName${id}" value="${name}">
            <p class="err" id="name-err${id}"></p>
            <p>Select user color:</p>
            <input type="color" id="color${id}" value="#00FF00">
            <p class="err" id="color-err${id}"></p>
            <p>Select game mode:</p>
            <button id="a_${id}">Auto</button>
            <button id="m_${id}">Manual</button>
        </div>
        `;

        userDiv += p_div;
    }
    return userDiv;
};

len_sl.addEventListener('input', function () { //Updater za label od st rund
    let n = parseInt(len_sl.value);
    if (n == 1) {
        len_lab.textContent = n + ' round';
    } else {
        len_lab.textContent = n + ' rounds';
    }
});

th_sl.addEventListener('input', function () { //Updater za label od st metov na rundo
    let n = parseInt(th_sl.value);
    if (n == 1) {
        th_lab.textContent = n + ' throw';
    } else {
        th_lab.textContent = n + ' throws';
    }
});

p_count.addEventListener('input', function () { //Updater za label od st igralcov
    player_names.clear();
    let n = parseInt(p_count.value);
    p_lab.textContent = n + ' players';
    players.innerHTML = genPlayers(n);
    addPlayerEv(n);
});


function addPlayerEv(n) { //Metoda ki doda event listener vsakemu igralcu glede na svoj id
    for (let i = 1; i <= n; i++) {
        let name_h1 = document.getElementById('name' + i);
        let name_input = document.getElementById('pName' + i);
        let name_e = document.getElementById('name-err' + i);
        let color_c = document.getElementById('color' + i);
        let color_e = document.getElementById('color-err' + i);

        name_input.addEventListener('input', function () { //Preverimo ce je ime krajse od 10 in ce ni prazno  in potem spremenimo
            if (name_input.value.length > 10) { //Ce je ime vecje od 10 obvestimo usr
                name_e.style.display = 'block';
                play_disabled_name = true
                updatePlay();
                name_e.textContent = 'Max username length reached!';
                name_input.value = name_input.value.slice(0, 10);
                name_h1.style.color = 'red';
            } else if (name_input.value.length == 0) { //Ce ni imena obvestimo usr
                name_h1.textContent = `NULL`;
                name_h1.style.color = 'red';
                name_e.style.display = 'block';
                play_disabled_name = true
                updatePlay();
                name_e.textContent = 'Username cannot be empty!';
            }
            else {
                name_e.style.display = 'none';
                play_disabled_name = false;
                updatePlay();
                name_e.textContent = '';
                name_h1.style.color = '#00FF00';
            }
            if (name_input.value.length > 0) {
                addPlayer(name_h1.textContent, name_input.value, i); //Damo likvidirat prejsnje ime
                name_h1.textContent = name_input.value;
                
            }
        });

        color_c.addEventListener('input', function () { //Pogledamo ce barva ni crna in dodamo novo
            if (color_c.value != '#000000') {
                color_e.style.display = 'none';
                play_disabled_color = false;
                updatePlay();
                name_h1.style.color = color_c.value;
                player_colors.push(color_c.value);
            } else {
                color_e.style.display = 'block';
                play_disabled_color = true;
                updatePlay();
                color_e.textContent = 'Cannot use black as user color!';
            }
        });
    }
}

function updatePlay() { //Pogledamo ce so vsi pogoji za omogocit zacetek igre
    if (play_disabled_name || play_disabled_color) {
        play_b.disabled = true;
    } else {
        play_b.disabled = false;
    }
}


function getRandomInt(min, max) { //Vrne random int
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function sleep(ms) { //spi N ms
    return new Promise(resolve => setTimeout(resolve, ms));
}

let isRunning = false;

async function napisi() { //Printamo naslov kot da nekdo tipka
    if (isRunning) return;
    isRunning = true;

    title.textContent = '> |';
    const text = "Gambling room";

    await sleep(300);
    for (let i = 0; i < text.length; i++) {
        title.textContent = `> ${text.slice(0, i + 1)}|`;
        await sleep(getRandomInt(100, 200));
    }

    isRunning = false;
}

window.onload = function() { //Ko se stran zlouda napisemo enkrat tekst nato pa usake 3.5 sekunde
    napisi();
    setInterval(napisi, 3500);
};

players.innerHTML = genPlayers(2); //Nastavimo rocno 2 igralca
addPlayerEv(2); //Jim dodamo evente

