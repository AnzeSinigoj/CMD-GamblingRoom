//Deklaracja vsega
let len_sl = document.getElementById('length'); //Slider za dolzino igre
let len_lab = document.getElementById('len-lab'); //Label za dolzino
let th_sl = document.getElementById('throws'); //Slider za kolicino metov na rundo
let th_lab = document.getElementById('throw-lab'); //Label za kolicino
let title = document.getElementById('title-gamble'); //Naslov strani 
let title_bar = document.getElementById('title-bar'); //Title bilik bar
let p_count = document.getElementById('p_count'); //Slider za stevilo igralcev
let p_lab = document.getElementById('p_c'); //Label za st igralcev
let players = document.getElementById('players'); //Div za igralce -parent
let play_b = document.getElementById('play-b'); //Gumb za igrat
let reset = document.getElementById('reset'); //reset gumb
let info = document.getElementById('info'); //info gumb
let info_det = document.getElementById('info-detailed'); //info opis
let cover = document.getElementById('cover'); //Dim overlay
let close = document.getElementById('exit'); //info exit

let play_disabled_name = false; //true: ce je aktivna napaka pri kakem imenu 
let play_disabled_color = false;//true: ce je aktrivna napaka pri kaki barvi
let mobileScreen = window.matchMedia("(max-aspect-ratio: 3/4)").matches; //Preveri ce media querry aktiviran

//User data -> vsak igralec ima svoj id kateri je enak indeksu tabele 
let player_names = []; //Imena igralcev
let player_colors = []; //Barve za vsakega igralca
let player_gamemodes = []; //True -> automatic, False -> manual
let game_len = 1;
let round_len = 1;

let players_c = 2; //Stevilo igralcev

function genPlayers(n) { //Metoda ki generira forme za igralce
    let userDiv = '';
    players_c = n;
    play_disabled_name = false;
    play_disabled_color = false;
    updatePlay();

    for (let i = 0; i < n; i++) { //Dodamo vsakega igralca posebej v div in mu damo svoj lasten id, vsak id igralca je enak njegovemu indeksu v setu
        const name = `Player ${i + 1}`;
        const id = i;
        player_names.push(name);
        player_colors.push('#00FF00');
        player_gamemodes.push(true);  //Default gamemode je automatic

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
            <div id="btn-holder"> 
                <button id="a_${id}">Auto</button>
                <button id="m_${id}">Manual</button>
            </div>
        </div>
        `;

        userDiv += p_div;
    }
    return userDiv;
};

len_sl.addEventListener('input', function () { //Updater za label od st rund
    let n = parseInt(len_sl.value);
    game_len = n;
    if (n == 1) {
        len_lab.textContent = n + ' round';
    } else {
        len_lab.textContent = n + ' rounds';
    }
});

th_sl.addEventListener('input', function () { //Updater za label od st metov na rundo
    let n = parseInt(th_sl.value);
    round_len = n;
    if (n == 1) {
        th_lab.textContent = n + ' throw';
    } else {
        th_lab.textContent = n + ' throws';
    }
});

p_count.addEventListener('input', function () { //event listener za players
    let desiredCount = parseInt(p_count.value);
    p_lab.textContent = desiredCount + ' players';

    if(desiredCount == 2 && !mobileScreen){
        players.style.justifyContent = "center";
    }else {
        players.style.justifyContent = "start";
    }

    let currentCount = player_names.length;

    if (desiredCount < currentCount) {
        player_names.splice(desiredCount);
        player_colors.splice(desiredCount);
        player_gamemodes.splice(desiredCount);

        // Rebuild DOM completely
        players.innerHTML = '';
        for (let i = 0; i < desiredCount; i++) {
            const name = player_names[i] || `Player ${i + 1}`;
            const id = i;
            const color = player_colors[i] || '#00FF00';
            const isAuto = player_gamemodes[i] !== false;

            players.innerHTML += `
                <div class="addP">
                    <h1 id="name${id}">${name}</h1>
                    <p>Input user name:</p>
                    <input type="text" id="pName${id}" value="${name}">
                    <p class="err" id="name-err${id}"></p>
                    <p>Select user color:</p>
                    <input type="color" id="color${id}" value="${color}">
                    <p class="err" id="color-err${id}"></p>
                    <p>Select game mode:</p>
                    <div id="btn-holder"> 
                        <button id="a_${id}">Auto</button>
                        <button id="m_${id}">Manual</button>
                    </div>
                </div>
            `;

            // Ensure values exist if we were rebuilding
            player_names[i] = name;
            player_colors[i] = color;
            player_gamemodes[i] = isAuto;

            setTimeout(() => {
                document.getElementById('color' + id).value = color;
                if (isAuto) {
                    document.getElementById('a_' + id).disabled = true;
                } else {
                    document.getElementById('m_' + id).disabled = true;
                }
            }, 0);
            addSinglePlayerEv(id);
        }
    }

    else if (desiredCount > currentCount) {
        for (let i = currentCount; i < desiredCount; i++) {
            const name = `Player ${i + 1}`;
            const id = i;
            player_names.push(name);
            player_colors.push('#00FF00');
            player_gamemodes.push(true); 

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
                <div id="btn-holder"> 
                    <button id="a_${id}">Auto</button>
                    <button id="m_${id}">Manual</button>
                </div>
            </div>
            `;

            players.innerHTML += p_div;
            addSinglePlayerEv(i);
        }
    }
});

function addSinglePlayerEv(i) {
    let name_h1 = document.getElementById('name' + i);
    let name_input = document.getElementById('pName' + i);
    let name_e = document.getElementById('name-err' + i);
    let color_c = document.getElementById('color' + i);
    let manual = document.getElementById('m_' + i);
    let auto = document.getElementById('a_' + i);
    let parent_box = name_h1.parentElement;

    name_input.addEventListener('input', function () {
        if (name_input.value.length > 10) {
            name_input.value = name_input.value.slice(0, 10);
        } else if (name_input.value.length === 0) {
            play_disabled_name = true;
            name_h1.textContent = `ERROR`;
            name_h1.classList.add('errH1');
            parent_box.classList.add('pErr');

            name_e.style.display = 'block';
            name_e.textContent = 'Username cannot be empty!';
            updatePlay();
        } else {
            play_disabled_name = false;
            name_h1.classList.remove('errH1');
            parent_box.classList.remove('pErr');

            name_e.style.display = 'none';
            name_e.textContent = '';
            updatePlay();
        }

        if (name_input.value.length > 0) {
            if (nameValidation(name_input.value, i)) {
                player_names[i] = name_input.value;
                name_h1.textContent = name_input.value;
            } else {
                play_disabled_name = true;
                name_h1.textContent = `ERROR`;
                name_h1.classList.add('errH1');
                parent_box.classList.add('pErr');

                name_e.textContent = 'Cannot use the same name as another user!';
                name_e.style.display = 'block';
                updatePlay();
            }
        }
        updateColor(i);
    });

    color_c.addEventListener('input', function () {
        updateColor(i);
    });

    manual.addEventListener('click', function () {
        player_gamemodes[i] = false;
        manual.disabled = true;
        auto.disabled = false;
    });

    auto.addEventListener('click', function () {
        player_gamemodes[i] = true;
        manual.disabled = false;
        auto.disabled = true;
    });
}


function addPlayerEv(n) { //Metoda ki doda event listener vsakemu igralcu glede na svoj id
    for (let i = 0; i < n; i++) {
        let name_h1 = document.getElementById('name' + i);
        let name_input = document.getElementById('pName' + i);
        let name_e = document.getElementById('name-err' + i);
        let color_c = document.getElementById('color' + i);
        let manual = document.getElementById('m_' + i);
        let auto = document.getElementById('a_' + i);
        let parent_box = name_h1.parentElement;


        name_input.addEventListener('input', function () { //Preverimo ce je ime krajse od 10 in ce ni prazno  in potem spremenimo
            if (name_input.value.length > 10) { //Ce je ime vecje od ne dovolimo vec vnosa
                name_input.value = name_input.value.slice(0, 10);
            } else if (name_input.value.length == 0) { //Ce ni imena obvestimo usr
                play_disabled_name = true;
                name_h1.textContent = `ERROR`;
                name_h1.classList.add('errH1');
                parent_box.classList.add('pErr');

                name_e.style.display = 'block';
                name_e.textContent = 'Username cannot be empty!';
                updatePlay();
            }
            else {
                play_disabled_name = false;
                name_h1.classList.remove('errH1');
                parent_box.classList.remove('pErr');

                name_e.style.display = 'none';
                name_e.textContent = '';
                updatePlay();
            }

            if (name_input.value.length > 0) {
                if (nameValidation(name_input.value, i)) {
                    player_names[i] = name_input.value;
                    name_h1.textContent = name_input.value;
                } else {
                    play_disabled_name = true;
                    name_h1.textContent = `ERROR`;
                    name_h1.classList.add('errH1');
                    parent_box.classList.add('pErr');

                    name_e.textContent = 'Cannot use the same name as another user!';
                    name_e.style.display = 'block';
                    updatePlay();
                }
            }
            updateColor(i);
        });

        color_c.addEventListener('input', function () { //Pogledamo ce barva ni crna in dodamo novo
            updateColor(i)
        });

        manual.addEventListener('click', function () {
            player_gamemodes[i] = false;
            manual.disabled = true;
            auto.disabled = false;
        });

        auto.addEventListener('click', function () {
            player_gamemodes[i] = true;
            manual.disabled = false;
            auto.disabled = true;
        });

    }
}


function loadData() { //Funkcja ki zlouda podatke
    if(player_names.length === 0){ //Ce nimamo podatkov jih naredimo
        players.innerHTML = genPlayers(2);
        addPlayerEv(2);
        return;
    }

    //Game data
    len_sl.value = game_len;
    if (game_len == 1) {
        len_lab.textContent = game_len + ' round';
    } else {
        len_lab.textContent = game_len + ' rounds';
    }

    th_sl.value = round_len;
    if (round_len == 1) {
        th_lab.textContent = round_len + ' throw';
    } else {
        th_lab.textContent = round_len + ' throws';
    }

    p_count.value = player_names.length;
    p_lab.textContent = player_names.length + ' players';

    players.innerHTML = ''; 
    //Player data
    for (let i = 0; i < player_names.length; i++) {
        let name = player_names[i];

        players.innerHTML += `
        <div class="addP">
            <h1 id="name${i}">${name}</h1>
            <p>Input user name:</p>
            <input type="text" id="pName${i}" value="${name}">
            <p class="err" id="name-err${i}"></p>
            <p>Select user color:</p>
            <input type="color" id="color${i}" value="#00FF00">
            <p class="err" id="color-err${i}"></p>
            <p>Select game mode:</p>
            <div id="btn-holder"> 
                <button id="a_${i}">Auto</button>
                <button id="m_${i}">Manual</button>
            </div>
        </div>
        `;

        setTimeout(function() {
            document.getElementById('name' + i).style.color = player_colors[i];
            document.getElementById('color' + i).value = player_colors[i];
    
            if (player_gamemodes[i]) {
                document.getElementById('a_' + i).disabled = true;
                document.getElementById('m_' + i).disabled = false;
            } else {
                document.getElementById('m_' + i).disabled = true;
                document.getElementById('a_' + i).disabled = false;
            }
        }, 0);

    }
    addPlayerEv(player_names.length);
}

function retrieveData() { //samo umevno poberemo podatke is session storage
    try { 
        //user data
        player_names = JSON.parse(localStorage.getItem("users")) || [];
        player_gamemodes = JSON.parse(localStorage.getItem("gamemodes")) || [];
        player_colors = JSON.parse(localStorage.getItem("colors")) || [];

        if (
            player_names.length !== player_colors.length ||
            player_names.length !== player_gamemodes.length
        ) {
            throw new Error("Mismatched player data");
        }

        //game data
        game_len = parseInt(localStorage.getItem('game_len')) || 1;
        round_len = parseInt(localStorage.getItem('round_len')) || 1;
    } catch (e) {
        localStorage.clear();
        console.warn("LocalStorage reset due to error:", e.message);
    }
}

function nameValidation(new_name, id) { //preveri ce novo ime za userja je conflicting
    for (let i = 0; i < player_names.length; i++) {
        if (i == id) { //ce je id isti kot indeks preskocino da ne primerjamo enakega userja 
            continue;
        }
        else if (player_names[i].toLowerCase() == new_name.toLowerCase()) {
            return false;
        }
    }
    return true;
}

function updateColor(id) { //Funkcja za posodabljat in izbirat barvo
    let color_c = document.getElementById('color' + id);
    let color_e = document.getElementById('color-err' + id);
    let name_h1 = document.getElementById('name' + id);
    let parent_box = name_h1.parentElement;

    let color_s = color_c.value;
    let brightness = getBrightness(color_s);

    if (brightness > 20) {
        play_disabled_color = false;
        color_e.style.display = 'none';
        if (!play_disabled_name) {
            name_h1.classList.remove('errH1');
            parent_box.classList.remove('pErr');
        }

        name_h1.style.color = color_s;
        player_colors[id] = (color_s);
        updatePlay();
    } else {
        play_disabled_color = true;
        color_e.textContent = 'Color is too dark! Please pick a brighter one.';
        color_e.style.display = 'block';
        name_h1.classList.add('errH1');
        parent_box.classList.add('pErr');

        updatePlay();
    }
}


function getBrightness(hex) { //Funkcja ki izracuna koliko je barva svetla
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);
    return (0.299 * r) + (0.587 * g) + (0.114 * b);
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


play_b.addEventListener('click', function(){ //Funkcja za zacetek igre
    //Dodajanje v localStorage
    localStorage.setItem("users", JSON.stringify(player_names)); //Player count ni treba podat ker users.len = p_count
    localStorage.setItem("colors", JSON.stringify(player_colors));
    localStorage.setItem("gamemodes", JSON.stringify(player_gamemodes));
    localStorage.setItem("game_len", game_len);
    localStorage.setItem("round_len", round_len);

    //Odpremo game page z moznostjo iti nazaj
    window.location.href = "html/game.html";
});

reset.addEventListener('click', function(){
    localStorage.setItem("users", JSON.stringify([]));
    localStorage.setItem("colors", JSON.stringify([]));
    localStorage.setItem("gamemodes", JSON.stringify([]));
    localStorage.setItem("game_len", "1");
    localStorage.setItem("round_len", "1");

    game_len = 1;
    len_sl.value = 1;
    len_lab.textContent = '1 round';
    round_len = 1;
    th_sl.value = 1;
    th_lab.textContent = '1 throw';
    p_count.value = 2;
    p_lab.textContent = '2 players';

    players.innerHTML = genPlayers(2);
    addPlayerEv(2);
});

info.addEventListener('click', function() {
    if (info_det.classList.contains('hide')) {
        cover.classList.remove('fade-out');
        cover.classList.add('fade-in');

        info_det.classList.remove('hide');
        info_det.classList.add('show');
    } else {
        cover.classList.remove('fade-in');
        cover.classList.add('fade-out');
        info_det.classList.remove('show');
        info_det.classList.add('hide');
    }
});

close.addEventListener('click', function() {
    cover.classList.remove('fade-in');
    cover.classList.add('fade-out');
    info_det.classList.remove('show');
    info_det.classList.add('hide');
});

window.onload = function () { //Ko se stran zlouda 
    retrieveData();
    loadData();
    napisi();
};


