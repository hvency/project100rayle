/* =========================================================
   PROJECT: 100
   RAYLE // MY LOVE

   99 MESSAGE STRIPS
   + MESSAGE 100 FINAL LETTER

   No external audio files required.
========================================================= */

(() => {

"use strict";


/* =========================================================
   HELPERS
========================================================= */

const $ = selector => document.querySelector(selector);

const $$ = selector => [...document.querySelectorAll(selector)];

const STORAGE_KEY = "PROJECT_100_MY_LOVE_V1";


/* =========================================================
   SAVE STATE
========================================================= */

const defaultState = {
    xp: 0,
    opened: [],
    completed: [],
    achievements: [],
    sound: true
};

let state;

try {

    state = JSON.parse(
        localStorage.getItem(STORAGE_KEY)
    ) || structuredClone(defaultState);

} catch {

    state = structuredClone(defaultState);

}


if (!Array.isArray(state.opened)) {
    state.opened = [];
}

if (!Array.isArray(state.completed)) {
    state.completed = [];
}

if (!Array.isArray(state.achievements)) {
    state.achievements = [];
}


function save() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state)
    );

}


/* =========================================================
   AUDIO ENGINE
========================================================= */

let audioContext = null;


function initAudio() {

    if (!state.sound) {
        return;
    }

    try {

        if (!audioContext) {

            audioContext =
                new (
                    window.AudioContext ||
                    window.webkitAudioContext
                )();

        }

        if (audioContext.state === "suspended") {
            audioContext.resume();
        }

    } catch {

        // Audio is optional.

    }

}


function tone(
    frequency = 440,
    duration = .08,
    type = "sine",
    volume = .045,
    delay = 0
) {

    if (!state.sound) {
        return;
    }

    initAudio();

    if (!audioContext) {
        return;
    }

    const oscillator =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();

    oscillator.type = type;

    oscillator.frequency.setValueAtTime(
        frequency,
        audioContext.currentTime + delay
    );

    gain.gain.setValueAtTime(
        0.0001,
        audioContext.currentTime + delay
    );

    gain.gain.exponentialRampToValueAtTime(
        volume,
        audioContext.currentTime + delay + .01
    );

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audioContext.currentTime + delay + duration
    );

    oscillator.connect(gain);

    gain.connect(audioContext.destination);

    oscillator.start(
        audioContext.currentTime + delay
    );

    oscillator.stop(
        audioContext.currentTime +
        delay +
        duration +
        .02
    );

}


function sound(type) {

    switch(type) {

        case "click":

            tone(420,.05,"square",.025);

            break;


        case "open":

            tone(420,.07,"sine",.04);

            tone(620,.08,"sine",.035,.07);

            tone(820,.12,"sine",.03,.14);

            break;


        case "good":

            tone(500,.07,"sine",.04);

            tone(700,.08,"sine",.04,.07);

            tone(950,.16,"sine",.05,.14);

            break;


        case "bad":

            tone(180,.15,"sawtooth",.04);

            tone(120,.2,"sawtooth",.03,.12);

            break;


        case "hit":

            tone(760,.035,"square",.035);

            break;


        case "damage":

            tone(120,.12,"sawtooth",.04);

            tone(80,.16,"sawtooth",.025,.08);

            break;


        case "unlock":

            tone(450,.08,"triangle",.035);

            tone(600,.08,"triangle",.04,.09);

            tone(800,.15,"triangle",.05,.18);

            break;


        case "final":

            tone(420,.12,"sine",.04);

            tone(520,.12,"sine",.04,.12);

            tone(650,.12,"sine",.04,.24);

            tone(820,.2,"sine",.05,.36);

            break;

    }

}

/* =========================================================
   BACKGROUND MUSIC
========================================================= */

let backgroundMusic = null;
let bgmStarted = false;


function initBackgroundMusic() {

    if (backgroundMusic) {
        return backgroundMusic;
    }

    backgroundMusic = new Audio("bgm.mp3");

    backgroundMusic.loop = true;

    backgroundMusic.preload = "auto";

    backgroundMusic.volume = 0.24;

    backgroundMusic.setAttribute(
        "aria-hidden",
        "true"
    );

    return backgroundMusic;

}


function startBackgroundMusic() {

    const music =
        initBackgroundMusic();

    if (!music) {
        return;
    }

    music.muted = false;

    const playPromise =
        music.play();

    if (
        playPromise &&
        typeof playPromise.catch === "function"
    ) {

        playPromise
            .then(() => {

                bgmStarted = true;

            })
            .catch(() => {

                /*
                 * Modern browsers may block audible autoplay.
                 * The global first-interaction listener below retries
                 * automatically as soon as the browser permits playback.
                 */

            });

    }

}


function stopBackgroundMusic() {

    if (!backgroundMusic) {
        return;
    }

    backgroundMusic.pause();

    backgroundMusic.currentTime = 0;

    bgmStarted = false;

}


initBackgroundMusic();

startBackgroundMusic();


function resumeBackgroundMusicFromInteraction() {

    if (!bgmStarted) {

        startBackgroundMusic();

    }

    if (bgmStarted) {

        document.removeEventListener(
            "pointerdown",
            resumeBackgroundMusicFromInteraction,
            true
        );

        document.removeEventListener(
            "keydown",
            resumeBackgroundMusicFromInteraction,
            true
        );

        document.removeEventListener(
            "touchstart",
            resumeBackgroundMusicFromInteraction,
            true
        );

    }

}


document.addEventListener(
    "pointerdown",
    resumeBackgroundMusicFromInteraction,
    true
);


document.addEventListener(
    "keydown",
    resumeBackgroundMusicFromInteraction,
    true
);


document.addEventListener(
    "touchstart",
    resumeBackgroundMusicFromInteraction,
    true
);

/* =========================================================
   BOOT
========================================================= */

let bootReady = false;

const bootMessages = [
    "loading private world...",
    "connecting player: RAYLE...",
    "checking love vault...",
    "generating 99 message strips...",
    "sealing message 100...",
    "loading quests...",
    "starting private server..."
];


function boot() {

    const bar = $("#boot-progress-bar");

    const percent = $("#boot-percent");

    const status = $("#boot-status");

    const log = $("#boot-log");

    const enter = $("#enter-game");

    let progress = 0;

    const interval = setInterval(() => {

        progress += Math.floor(
            Math.random() * 8
        ) + 4;

        if (progress >= 100) {
            progress = 100;
        }

        bar.style.width = progress + "%";

        percent.textContent =
            progress + "%";

        const index =
            Math.min(
                bootMessages.length - 1,
                Math.floor(
                    progress /
                    (100 / bootMessages.length)
                )
            );

        log.textContent =
            "> " + bootMessages[index];

        status.textContent =
            progress < 100
                ? "INITIALIZING..."
                : "WORLD READY";

        if (progress >= 100) {

            clearInterval(interval);

            bootReady = true;

            enter.disabled = false;

            sound("good");

        }

    }, 120);

}


$("#enter-game").addEventListener(
    "click",
    () => {

        if (!bootReady) {
            return;
        }

        initAudio();

        sound("click");

        $("#boot-screen")
            .classList
            .add("hidden");

        $("#game-interface")
            .classList
            .remove("hidden");

        updateAll();

    }
);


/* =========================================================
   PARTICLES
========================================================= */

const canvas = $("#particles");

const ctx = canvas.getContext("2d");

let particles = [];


function resizeCanvas() {

    canvas.width =
        window.innerWidth;

    canvas.height =
        window.innerHeight;

}


window.addEventListener(
    "resize",
    resizeCanvas
);

resizeCanvas();


for (let i = 0; i < 45; i++) {

    particles.push({

        x: Math.random() *
            window.innerWidth,

        y: Math.random() *
            window.innerHeight,

        size:
            Math.random() * 2 + .5,

        speed:
            Math.random() * .3 + .05,

        alpha:
            Math.random() * .5 + .1

    });

}


function animateParticles() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    particles.forEach(p => {

        p.y -= p.speed;

        if (p.y < -10) {
            p.y = canvas.height + 10;
        }

        ctx.globalAlpha = p.alpha;

        ctx.fillStyle = "#38bdf8";

        ctx.fillRect(
            p.x,
            p.y,
            p.size,
            p.size
        );

    });

    requestAnimationFrame(
        animateParticles
    );

}

animateParticles();


/* =========================================================
   NAVIGATION
========================================================= */

function showSection(name) {

    $$(".section").forEach(section => {

        section.classList.toggle(
            "active",
            section.id ===
            "section-" + name
        );

    });


    $$(".nav-item").forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.section === name
        );

    });

    sound("click");

}


document.addEventListener(
    "click",
    event => {

        const nav =
            event.target.closest(
                "[data-section]"
            );

        if (nav) {

            showSection(
                nav.dataset.section
            );

            return;

        }


        const go =
            event.target.closest(
                "[data-go-section]"
            );

        if (go) {

            showSection(
                go.dataset.goSection
            );

        }

    }
);


/* =========================================================
   XP / LEVEL
========================================================= */

function getLevel() {

    return Math.floor(
        state.xp / 500
    ) + 1;

}


function updateHUD() {

    const level =
        getLevel();

    $("#level").textContent =
        level;

    $("#xp").textContent =
        state.xp;

    const progress =
        (state.xp % 500) / 500 * 100;

    $("#xp-fill").style.width =
        progress + "%";

    $("#quest-count").textContent =
        state.completed.length;

    $("#home-progress").textContent =
        state.completed.length + " / 4";

    $("#scroll-count").textContent =
        state.opened.length;

}


function awardXP(amount) {

    state.xp += amount;

    save();

    updateHUD();

}


/* =========================================================
   ACHIEVEMENTS
========================================================= */

function unlockAchievement(id) {

    if (
        state.achievements.includes(id)
    ) {
        return;
    }

    state.achievements.push(id);

    save();

    const element =
        document.querySelector(
            `[data-achievement="${id}"]`
        );

    if (element) {
        element.classList.add("unlocked");
    }

    sound("unlock");

    toast(
        "ACHIEVEMENT UNLOCKED"
    );

}


function updateAchievements() {

    state.achievements.forEach(id => {

        const element =
            document.querySelector(
                `[data-achievement="${id}"]`
            );

        if (element) {
            element.classList.add("unlocked");
        }

    });

}


/* =========================================================
   TOAST
========================================================= */

function toast(message) {

    const container =
        $("#toast-container");

    const element =
        document.createElement("div");

    element.className =
        "toast";

    element.textContent =
        message;

    container.appendChild(
        element
    );

    setTimeout(() => {

        element.remove();

    }, 3200);

}


/* =========================================================
   HEART EFFECT
========================================================= */

function heartPop(x, y) {

    for (let i = 0; i < 7; i++) {

        const heart =
            document.createElement("div");

        heart.className =
            "heart-pop";

        heart.textContent =
            "♥";

        heart.style.left =
            x + "px";

        heart.style.top =
            y + "px";

        heart.style.setProperty(
            "--x",
            (Math.random() * 120 - 60) + "px"
        );

        heart.style.setProperty(
            "--y",
            (-Math.random() * 120 - 30) + "px"
        );

        document.body.appendChild(
            heart
        );

        setTimeout(
            () => heart.remove(),
            1100
        );

    }

}


/* =========================================================
   99 MESSAGE STRIPS
========================================================= */

const messages = [

    "Happy birthday, my love. I hope today reminds you how loved you are.",

    "I hope you know that having you in my life means more to me than I can properly explain.",

    "My love, I hope you get every good thing you have been quietly wishing for.",

    "You are one of the people I want to keep making memories with.",

    "Even when we are far apart, you still have a special place in my everyday life.",

    "I love hearing you laugh, especially when I know I was the reason.",

    "You somehow became one of my favorite people to annoy.",

    "My love, please never forget that you are important to me.",

    "I hope this new year of your life gives you more reasons to smile.",

    "I love the little things about you that you probably don't even notice.",

    "You make ordinary conversations feel like something I want to remember.",

    "I hope you keep chasing the things that make you genuinely happy.",

    "I am proud of the person you continue to become.",

    "My love, I hope you never feel like you have to face everything alone.",

    "Thank you for all the random conversations, jokes, games, and little moments.",

    "Some of my favorite memories are simply moments where we were being ourselves.",

    "I hope we get to make many more ridiculous memories together.",

    "You are my favorite gaming partner, even when we absolutely fail.",

    "I hope you keep singing because your voice deserves to be heard.",

    "I hope you keep playing music and discovering new things you enjoy.",

    "My love, I hope you never lose your curiosity.",

    "I love that there are still so many things about you I get to discover.",

    "Distance may make things harder, but it does not erase what someone means to you.",

    "I hope one day we can look back at the distance and say, 'We really made it through that.'",

    "You deserve a birthday where you can simply relax and enjoy being celebrated.",

    "My love, today is your day. Please let yourself enjoy it.",

    "I hope your future has more adventures than you can count.",

    "I hope you experience places that make you stop and think, 'Wow.'",

    "I hope you get to try every crazy ride you want.",

    "And yes, I still hope you eventually learn how to swim.",

    "I hope gaming never stops being one of the things that makes you smile.",

    "I hope you keep creating things because your ideas deserve somewhere to exist.",

    "My love, I hope you continue becoming someone your younger self would be proud of.",

    "You have your own way of making an ordinary day memorable.",

    "I love our random conversations that somehow last way longer than planned.",

    "I love the moments when we forget about time because we are having too much fun.",

    "Thank you for being someone I can share both serious and completely stupid thoughts with.",

    "My love, you don't have to be perfect for me to care about you.",

    "I appreciate the real version of you — not some imaginary perfect version.",

    "I hope you always have people around you who genuinely want you to succeed.",

    "I hope you receive kindness even on the days when you don't expect it.",

    "I hope this birthday marks the beginning of something really good for you.",

    "You have so many more chapters ahead of you.",

    "My love, I hope those chapters are filled with experiences worth remembering.",

    "I hope you get opportunities that surprise you.",

    "I hope you get the courage to try things that scare you.",

    "I hope you keep learning even when something feels difficult.",

    "I hope you remember that progress does not have to be perfect.",

    "You are allowed to have bad days and still be worthy of good things.",

    "My love, you are allowed to rest too.",

    "You don't always have to have everything figured out.",

    "I hope you give yourself more credit for the things you have already overcome.",

    "I hope you realize how many little things make you uniquely you.",

    "I love the person behind the gamer tag.",

    "I love the person behind the jokes.",

    "I love the person behind the confident moments and the quiet ones too.",

    "My love, I hope you always have somewhere you feel safe being yourself.",

    "I hope you keep finding people and places that make you feel at home.",

    "Even from far away, I am cheering for you.",

    "I hope you accomplish something this year that makes you ridiculously proud.",

    "I hope you get more wins than losses — in games and outside them.",

    "And when you lose, I hope you remember that one bad round does not define the whole game.",

    "My love, life is not supposed to be one perfect run.",

    "Sometimes the best memories happen because something went completely wrong.",

    "I hope we continue collecting those stories.",

    "I hope someday we laugh about the things that once stressed us out.",

    "I hope we keep choosing to understand each other.",

    "I hope we keep learning how to communicate better.",

    "My love, I hope we never stop being honest with each other.",

    "I hope we can always find our way back to laughter.",

    "I hope there are many more birthdays where I get to celebrate you.",

    "I hope there are future birthdays where distance is no longer part of the story.",

    "I hope one day I can hand you something like this instead of sending it through a screen.",

    "Until then, I hope this little world makes the distance feel a little smaller.",

    "I wanted to make something instead of simply buying something.",

    "I wanted you to have something that could only belong to you.",

    "My love, every little detail here exists because I was thinking about you.",

    "The games are for the gamer in you.",

    "The music parts are for the person who loves playing and listening to music.",

    "The challenges are for the person who likes winning.",

    "The ridiculous parts are for the person I can be ridiculous with.",

    "And the messages are for the person I love.",

    "I hope you smiled at least once while opening these.",

    "If you did, then this little project already did what I wanted.",

    "My love, thank you for being part of my life.",

    "Thank you for the memories we already have.",

    "Thank you for the memories we haven't made yet.",

    "There are still so many places, games, songs, conversations, and moments waiting for us.",

    "I hope we get to experience many of them.",

    "I hope your birthday is peaceful, fun, exciting, and completely yours.",

    "I hope you eat something really good today.",

    "I hope you laugh until your stomach hurts.",

    "I hope you get to play the games you love.",

    "I hope you hear something today that makes you happy.",

    "I hope you feel appreciated.",

    "I hope you feel remembered.",

    "I hope you feel loved.",

    "And if you ever forget that last one, my love, come back here.",

    "Because somewhere inside this little game is a reminder that someone was thinking about you.",

    "You are worth celebrating.",

    "You are worth remembering.",

    "You are worth loving.",

    "Happy birthday again, my love.",

    "This is only strip 99.",

    "The last message is waiting for you.",

    "Go open all the others first, birthday boy. ♥"

];


/*
   Safety check:
   Exactly 99 strips are required.
*/

if (messages.length > 99) {

    messages.length = 99;

}


while (messages.length < 99) {

    messages.push(
        "One more little reminder, my love: you are loved."
    );

}


/* =========================================================
   FINAL LETTER
========================================================= */

const finalLetter = `
Happy birthday, my love. ♥

If you reached this message, then you really opened all 99.

I made this little world for you because I wanted to give you something that was made with you in mind. Something you could play, laugh at, and hopefully remember.

We've had good days, difficult days, stupid arguments, random conversations, games, laughter, and so many little moments that became memories. And even though we're still far apart, I'm grateful that I get to share those moments with you.

I don't know what every year ahead will look like, but I hope we get to fill it with more memories together. Thank you for being my love, my favorite person to annoy, and someone I genuinely want in my life.

Happy birthday, Rayle. I love you my love always, in all ways <33

— Heaven
`;


/* =========================================================
   RENDER 99 SCROLLS
========================================================= */

function renderScrolls() {

    const grid =
        $("#scroll-grid");

    grid.innerHTML = "";

    for (
        let i = 0;
        i < 99;
        i++
    ) {

        const card =
            document.createElement("button");

        card.className =
            "scroll-card";

        card.type =
            "button";

        card.dataset.index =
            i;

        card.style.setProperty(
            "--rotation",
            ((Math.random() * 4) - 2) + "deg"
        );

        const number =
            String(i + 1)
                .padStart(2, "0");

        card.innerHTML = `
            <span class="scroll-number">
                ${number}
            </span>

            <span class="scroll-hint">
                ${state.opened.includes(i)
                    ? "OPENED ♥"
                    : "UNWRAP"}
            </span>
        `;

        if (
            state.opened.includes(i)
        ) {

            card.classList.add(
                "opened"
            );

        }

        grid.appendChild(card);

    }

}


/* =========================================================
   OPEN SCROLL
========================================================= */

function openScroll(index) {

    if (
        index < 0 ||
        index >= 99
    ) {
        return;
    }

    const isNew =
        !state.opened.includes(index);

    if (isNew) {

        state.opened.push(index);

        awardXP(5);

        save();

        unlockAchievementIfNeeded();

    }

    $("#opened-scroll-number")
        .textContent =
        String(index + 1)
            .padStart(2, "0");

    $("#scroll-message")
        .textContent =
        messages[index];

    $("#scroll-modal")
        .classList
        .remove("hidden");

    sound("open");

    heartPop(
        window.innerWidth / 2,
        window.innerHeight / 2
    );

    updateVault();

}


document.addEventListener(
    "click",
    event => {

        const scroll =
            event.target.closest(
                ".scroll-card"
            );

        if (!scroll) {
            return;
        }

        openScroll(
            Number(
                scroll.dataset.index
            )
        );

    }
);


/* =========================================================
   VAULT
========================================================= */

function updateVault() {

    renderScrolls();

    updateHUD();

    const count =
        state.opened.length;

    const warning =
        $("#vault-warning");

    const finalCard =
        $("#final-letter-card");

    const finalButton =
        $("#open-final-letter");

    if (count >= 99) {

        warning.textContent =
            "♥ ALL 99 STRIPS DISCOVERED. MESSAGE 100 IS NOW UNSEALED.";

        finalCard.classList.add(
            "unlocked"
        );

        finalButton.disabled =
            false;

        finalButton.textContent =
            "OPEN LETTER";

        $("#final-letter-card .final-lock")
            .textContent =
            "♥";

    } else {

        warning.textContent =
            `🔒 THE 100TH MESSAGE IS SEALED. OPEN ALL 99 STRIPS TO UNLOCK IT.`;

        finalCard.classList.remove(
            "unlocked"
        );

        finalButton.disabled =
            true;

        finalButton.textContent =
            "SEALED";

        $("#final-letter-card .final-lock")
            .textContent =
            "🔒";

    }

}


function unlockAchievementIfNeeded() {

    if (
        state.opened.length >= 99
    ) {

        unlockAchievement(
            "scroll-collector"
        );

    }

}


/* =========================================================
   FINAL LETTER
========================================================= */

$("#open-final-letter")
    .addEventListener(
        "click",
        event => {

            if (
                state.opened.length < 99
            ) {
                return;
            }

            sound("final");

            unlockAchievement(
                "final-reward"
            );

            showFinalLetter();

            heartPop(
                event.clientX,
                event.clientY
            );

        }
    );


function showFinalLetter() {

    $("#opened-scroll-number")
        .textContent =
        "100";

    $("#scroll-message")
        .innerHTML =
        finalLetter
            .trim()
            .replace(
                /\n/g,
                "<br>"
            );

    $("#scroll-modal")
        .classList
        .remove("hidden");

}


/* =========================================================
   MODAL CLOSE
========================================================= */

$("#close-scroll")
    .addEventListener(
        "click",
        () => {

            $("#scroll-modal")
                .classList
                .add("hidden");

            sound("click");

        }
    );


/* =========================================================
   GAMES
========================================================= */

let currentGame =
    null;

let gameCleanup =
    null;


function stopGame() {

    if (typeof gameCleanup === "function") {

        try {
            gameCleanup();
        } catch {}

    }

    gameCleanup =
        null;

    currentGame =
        null;

}


function gameUnlocked(game) {

    if (game === "dodge") {
        return true;
    }

    if (game === "blade") {
        return state.completed.includes("dodge");
    }

    if (game === "duo") {
        return state.completed.includes("blade");
    }

    if (game === "music") {
        return state.completed.includes("duo");
    }

    return false;

}


function openGame(game) {

    if (!gameUnlocked(game)) {

        sound("bad");

        toast(
            "COMPLETE THE PREVIOUS QUEST FIRST."
        );

        return;

    }

    stopGame();

    currentGame =
        game;

    $("#game-modal")
        .classList
        .remove("hidden");

    const titles = {

        dodge:
            "01 // SURVIVE THE ARENA",

        blade:
            "02 // BLADE REFLEX",

        duo:
            "03 // DUO QUEUE",

        music:
            "04 // MUSIC STAGE"

    };

    $("#game-window-title")
        .textContent =
        titles[game];

    $("#game-area")
        .innerHTML = "";

    if (game === "dodge") {
        startDodge();
    }

    if (game === "blade") {
        startBlade();
    }

    if (game === "duo") {
        startDuo();
    }

    if (game === "music") {
        startMusic();
    }

}


document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-open-game]"
            );

        if (!button) {
            return;
        }

        openGame(
            button.dataset.openGame
        );

    }
);


$("#close-game")
    .addEventListener(
        "click",
        closeGame
    );


function closeGame() {

    stopGame();

    $("#game-modal")
        .classList
        .add("hidden");

    $("#game-area")
        .innerHTML = "";

    sound("click");

}


/* =========================================================
   COMPLETE GAME
========================================================= */

function completeGame(
    game,
    xp
) {

    const already =
        state.completed.includes(
            game
        );

    if (!already) {

        state.completed.push(game);

        awardXP(xp);

        unlockAchievement(
            "first-clear"
        );

        if (game === "dodge") {

            unlockAchievement(
                "reflex-master"
            );

        }

        if (game === "duo") {

            unlockAchievement(
                "duo-sync"
            );

        }

        if (game === "music") {

            unlockAchievement(
                "rhythm-runner"
            );

        }

        save();

    }

    updateAll();

}


/* =========================================================
   REFRESH GAME BUTTONS
========================================================= */

function updateGames() {

    const games = [
        "dodge",
        "blade",
        "duo",
        "music"
    ];

    games.forEach(game => {

        const card =
            document.querySelector(
                `[data-game-card="${game}"]`
            );

        if (!card) {
            return;
        }

        const button =
            card.querySelector(
                ".quest-button"
            );

        const complete =
            state.completed.includes(
                game
            );

        const unlocked =
            gameUnlocked(game);

        button.disabled =
            !unlocked;

        if (!unlocked) {

            button.textContent =
                "LOCKED";

        } else if (complete) {

            button.textContent =
                "PLAY AGAIN";

        } else {

            button.textContent =
                "PLAY QUEST";

        }

    });

}


/* =========================================================
   GAME 1
   EXACTLY 30 SECONDS
========================================================= */

function startDodge() {

    const host =
        $("#game-area");

    host.innerHTML = `

        <div class="game-screen">

            <div class="game-title">

                <h2>
                    SURVIVE THE ARENA
                </h2>

                <p>
                    Move left and right.
                    Survive for exactly 30 seconds.
                </p>

                <div class="game-stats">

                    <span>
                        TIME:
                        <strong id="dodge-time">
                            30.00
                        </strong>
                    </span>

                    <span>
                        LIVES:
                        <strong id="dodge-lives">
                            ♥ ♥ ♥
                        </strong>
                    </span>

                </div>

            </div>

            <div class="arena" id="dodge-arena">

                <div
                    class="player"
                    id="dodge-player"
                >
                    R
                </div>

            </div>

            <div class="game-controls">

                <button
                    class="control-button"
                    id="dodge-left"
                >
                    ◀ LEFT
                </button>

                <button
                    class="control-button"
                    id="dodge-right"
                >
                    RIGHT ▶
                </button>

            </div>

        </div>
    `;


    const arena =
        $("#dodge-arena");

    const player =
        $("#dodge-player");

    const timeText =
        $("#dodge-time");

    const livesText =
        $("#dodge-lives");


    let playerX =
        arena.clientWidth / 2;

    let lives = 3;

    let obstacles = [];

    let running = true;

    let lastTime =
        performance.now();

    let startTime =
        performance.now();

    let lastSpawn = 0;

    let keys = {
        left: false,
        right: false
    };


    function renderPlayer() {

        player.style.left =
            playerX + "px";

        player.style.bottom =
            "15px";

    }


    renderPlayer();


    function keydown(e) {

        if (
            e.key === "ArrowLeft" ||
            e.key.toLowerCase() === "a"
        ) {

            keys.left = true;

        }

        if (
            e.key === "ArrowRight" ||
            e.key.toLowerCase() === "d"
        ) {

            keys.right = true;

        }

    }


    function keyup(e) {

        if (
            e.key === "ArrowLeft" ||
            e.key.toLowerCase() === "a"
        ) {

            keys.left = false;

        }

        if (
            e.key === "ArrowRight" ||
            e.key.toLowerCase() === "d"
        ) {

            keys.right = false;

        }

    }


    function pressLeft() {
        keys.left = true;
    }


    function releaseLeft() {
        keys.left = false;
    }


    function pressRight() {
        keys.right = true;
    }


    function releaseRight() {
        keys.right = false;
    }


    document.addEventListener(
        "keydown",
        keydown
    );

    document.addEventListener(
        "keyup",
        keyup
    );


    const left =
        $("#dodge-left");

    const right =
        $("#dodge-right");


    left.addEventListener(
        "pointerdown",
        pressLeft
    );

    left.addEventListener(
        "pointerup",
        releaseLeft
    );

    left.addEventListener(
        "pointerleave",
        releaseLeft
    );

    right.addEventListener(
        "pointerdown",
        pressRight
    );

    right.addEventListener(
        "pointerup",
        releaseRight
    );

    right.addEventListener(
        "pointerleave",
        releaseRight
    );


    function spawnObstacle() {

        const obstacle =
            document.createElement("div");

        obstacle.className =
            "obstacle";

        obstacle.style.left =
            Math.random() *
            Math.max(
                1,
                arena.clientWidth - 35
            ) + "px";

        obstacle.style.top =
            "-40px";

        arena.appendChild(
            obstacle
        );

        obstacles.push({
            element: obstacle,
            x: parseFloat(
                obstacle.style.left
            ),
            y: -40,
            speed:
                180 +
                Math.random() * 100
        });

    }


    function updateObstacles(
        delta
    ) {

        const playerRect =
            player.getBoundingClientRect();

        for (
            let i = obstacles.length - 1;
            i >= 0;
            i--
        ) {

            const obstacle =
                obstacles[i];

            obstacle.y +=
                obstacle.speed *
                delta;

            obstacle.element.style.top =
                obstacle.y + "px";


            const rect =
                obstacle.element
                    .getBoundingClientRect();


            const collision =
                rect.left <
                    playerRect.right &&
                rect.right >
                    playerRect.left &&
                rect.top <
                    playerRect.bottom &&
                rect.bottom >
                    playerRect.top;


            if (collision) {

                obstacle.element.remove();

                obstacles.splice(i,1);

                lives--;

                sound("damage");

                livesText.textContent =
                    "♥ ".repeat(
                        Math.max(0,lives)
                    );

                if (lives <= 0) {

                    finish(false);

                    return;

                }

            }


            if (
                obstacle.y >
                arena.clientHeight + 60
            ) {

                obstacle.element.remove();

                obstacles.splice(i,1);

            }

        }

    }


    function finish(
        won
    ) {

        if (!running) {
            return;
        }

        running = false;

        if (won) {

            sound("good");

            completeGame(
                "dodge",
                150
            );

            showResult(
                true,
                "ARENA CLEARED",
                "You survived the full 30 seconds, my love.",
                150,
                "blade"
            );

        } else {

            sound("bad");

            showResult(
                false,
                "GAME OVER",
                "The arena got you. Try again.",
                0,
                "dodge"
            );

        }

    }


    function loop(now) {

        if (!running) {
            return;
        }


        const delta =
            Math.min(
                (now - lastTime) / 1000,
                .05
            );

        lastTime =
            now;


        const elapsed =
            (now - startTime) / 1000;


        const remaining =
            Math.max(
                0,
                30 - elapsed
            );


        timeText.textContent =
            remaining.toFixed(2);


        if (keys.left) {

            playerX -=
                300 * delta;

        }

        if (keys.right) {

            playerX +=
                300 * delta;

        }


        playerX =
            Math.max(
                25,
                Math.min(
                    arena.clientWidth - 25,
                    playerX
                )
            );


        renderPlayer();


        const difficulty =
            1 +
            Math.min(
                elapsed / 30,
                1
            );


        if (
            elapsed * 1000 -
            lastSpawn >
            650 / difficulty
        ) {

            spawnObstacle();

            lastSpawn =
                elapsed * 1000;

        }


        updateObstacles(
            delta
        );


        if (elapsed >= 30) {

            finish(true);

            return;

        }


        requestAnimationFrame(
            loop
        );

    }


    gameCleanup = () => {

        running = false;

        document.removeEventListener(
            "keydown",
            keydown
        );

        document.removeEventListener(
            "keyup",
            keyup
        );

        obstacles.forEach(o => {
            o.element.remove();
        });

    };


    requestAnimationFrame(
        loop
    );

}


/* =========================================================
   GAME 2
========================================================= */

function startBlade() {

    const host =
        $("#game-area");

    host.innerHTML = `

        <div class="game-screen timing-game">

            <div class="game-title">

                <h2>
                    BLADE REFLEX
                </h2>

                <p>
                    Press STRIKE when the target is ready.
                </p>

                <div class="game-stats">

                    <span>
                        ROUND:
                        <strong id="blade-round">
                            1/10
                        </strong>
                    </span>

                    <span>
                        SCORE:
                        <strong id="blade-score">
                            0
                        </strong>
                    </span>

                </div>

            </div>

            <div class="timing-target">

                <div
                    class="timing-core"
                    id="blade-core"
                >
                    WAIT
                </div>

            </div>

            <div
                class="timing-state"
                id="blade-state"
            >
                WAIT FOR THE SIGNAL
            </div>

            <div
                class="timing-round"
                id="blade-message"
            >
                Round 1
            </div>

            <button
                class="big-action"
                id="blade-action"
            >
                STRIKE
            </button>

        </div>
    `;


    let round = 1;

    let score = 0;

    let accepting = false;

    let finished = false;

    let timer = null;


    const core =
        $("#blade-core");

    const stateText =
        $("#blade-state");

    const message =
        $("#blade-message");

    const action =
        $("#blade-action");


    function nextRound() {

        if (finished) {
            return;
        }

        accepting = false;

        core.textContent =
            "WAIT";

        core.style.background =
            "var(--purple)";

        stateText.textContent =
            "WAIT FOR THE SIGNAL";


        const wait =
            650 +
            Math.random() * 900;


        timer = setTimeout(() => {

            if (finished) {
                return;
            }

            accepting = true;

            core.textContent =
                "NOW";

            core.style.background =
                "var(--green)";

            stateText.textContent =
                "STRIKE!";

            sound("hit");

        }, wait);

    }


    function strike() {

        if (finished) {
            return;
        }

        if (accepting) {

            score++;

            sound("good");

            core.style.background =
                "var(--cyan)";

            stateText.textContent =
                "PERFECT!";

        } else {

            sound("bad");

            stateText.textContent =
                "TOO EARLY!";

        }

        accepting = false;

        $("#blade-score")
            .textContent =
            score;


        if (round >= 10) {

            finished = true;

            setTimeout(() => {

                if (score >= 7) {

                    completeGame(
                        "blade",
                        200
                    );

                    showResult(
                        true,
                        "REFLEX MASTER",
                        "You hit the timing requirement, my love.",
                        200,
                        "duo"
                    );

                } else {

                    showResult(
                        false,
                        "NOT ENOUGH",
                        "You need at least 7 successful strikes.",
                        0,
                        "blade"
                    );

                }

            }, 500);

            return;

        }


        round++;

        $("#blade-round")
            .textContent =
            round + "/10";

        message.textContent =
            "Round " + round;


        clearTimeout(timer);

        timer =
            setTimeout(
                nextRound,
                500
            );

    }


    action.addEventListener(
        "click",
        strike
    );


    function key(e) {

        if (
            e.code === "Space" ||
            e.code === "Enter"
        ) {

            e.preventDefault();

            strike();

        }

    }


    document.addEventListener(
        "keydown",
        key
    );


    gameCleanup = () => {

        finished = true;

        clearTimeout(timer);

        document.removeEventListener(
            "keydown",
            key
        );

    };


    nextRound();

}


/* =========================================================
   GAME 3
   MEMORY MATCH
========================================================= */

function startDuo() {

    const host =
        $("#game-area");

    host.innerHTML = `

        <div class="game-screen duo-game">

            <div class="game-title">

                <h2>
                    MEMORY MATCH
                </h2>

                <p>
                    Remember the sequence and repeat it.
                </p>

                <div class="game-stats">

                    <span>
                        ROUND:
                        <strong id="memory-round">
                            1/5
                        </strong>
                    </span>

                    <span>
                        SUCCESS:
                        <strong id="memory-score">
                            0
                        </strong>
                    </span>

                </div>

            </div>


            <div
                id="memory-display"
                style="
                    min-height:100px;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    gap:12px;
                    flex-wrap:wrap;
                    font-family:var(--font-display);
                    font-size:28px;
                    color:var(--cyan);
                "
            >
                GET READY...
            </div>


            <div
                id="memory-buttons"
                style="
                    width:min(500px,95%);
                    display:grid;
                    grid-template-columns:repeat(4,1fr);
                    gap:10px;
                    margin:20px auto;
                "
            >

                <button
                    class="control-button memory-button"
                    data-memory="◆"
                >
                    ◆
                </button>

                <button
                    class="control-button memory-button"
                    data-memory="●"
                >
                    ●
                </button>

                <button
                    class="control-button memory-button"
                    data-memory="▲"
                >
                    ▲
                </button>

                <button
                    class="control-button memory-button"
                    data-memory="■"
                >
                    ■
                </button>

            </div>


            <div
                id="memory-state"
                class="timing-state"
            >
                WATCH THE SEQUENCE
            </div>

        </div>
    `;


    const display =
        $("#memory-display");

    const buttons =
        $$(".memory-button");

    const stateText =
        $("#memory-state");


    const symbols = [
        "◆",
        "●",
        "▲",
        "■"
    ];


    let round = 1;

    let score = 0;

    let sequence = [];

    let playerSequence = [];

    let acceptingInput = false;

    let finished = false;

    let timers = [];


    function clearTimers() {

        timers.forEach(
            timer => clearTimeout(timer)
        );

        timers = [];

    }


    function randomSymbol() {

        return symbols[
            Math.floor(
                Math.random() *
                symbols.length
            )
        ];

    }


    function createSequence() {

        sequence = [];

        /*
            Round 1 = 2 symbols
            Round 2 = 3
            Round 3 = 4
            Round 4 = 5
            Round 5 = 6
        */

        const length =
            round + 1;


        for (
            let i = 0;
            i < length;
            i++
        ) {

            sequence.push(
                randomSymbol()
            );

        }

    }


    function showSequence() {

        acceptingInput = false;

        playerSequence = [];

        display.innerHTML = "";

        stateText.textContent =
            "WATCH THE SEQUENCE";

        buttons.forEach(
            button => {
                button.disabled = true;
            }
        );


        let index = 0;


        function showNext() {

            if (
                finished ||
                index >= sequence.length
            ) {

                const wait =
                    setTimeout(() => {

                        display.innerHTML =
                            `<span
                                style="
                                    color:var(--green);
                                    font-size:18px;
                                "
                            >
                                YOUR TURN
                            </span>`;

                        stateText.textContent =
                            "REPEAT THE SEQUENCE";

                        buttons.forEach(
                            button => {
                                button.disabled = false;
                            }
                        );

                        acceptingInput = true;

                    }, 600);

                timers.push(wait);

                return;

            }


            display.innerHTML = `

                <span
                    style="
                        font-size:55px;
                        color:var(--cyan);
                        text-shadow:
                            0 0 25px
                            rgba(34,211,238,.5);
                    "
                >
                    ${sequence[index]}
                </span>

            `;

            sound("click");


            const next =
                setTimeout(() => {

                    display.innerHTML =
                        `<span
                            style="
                                color:#475569;
                                font-size:22px;
                            "
                        >
                            •
                        </span>`;

                    const following =
                        setTimeout(() => {

                            index++;

                            showNext();

                        }, 180);

                    timers.push(
                        following
                    );

                }, 600);

            timers.push(next);

        }


        showNext();

    }


    function nextRound() {

        if (finished) {
            return;
        }

        $("#memory-round")
            .textContent =
            round + "/5";

        createSequence();

        const wait =
            setTimeout(
                showSequence,
                500
            );

        timers.push(wait);

    }


    function pressSymbol(symbol) {

        if (
            !acceptingInput ||
            finished
        ) {
            return;
        }


        const expected =
            sequence[
                playerSequence.length
            ];


        if (
            symbol !== expected
        ) {

            acceptingInput = false;

            buttons.forEach(
                button => {
                    button.disabled = true;
                }
            );

            stateText.textContent =
                "WRONG SEQUENCE";

            stateText.style.color =
                "var(--red)";

            sound("bad");


            const retry =
                setTimeout(() => {

                    if (round >= 5) {

                        finish();

                        return;

                    }

                    round++;

                    stateText.style.color =
                        "white";

                    nextRound();

                }, 800);

            timers.push(retry);

            return;

        }


        playerSequence.push(
            symbol
        );

        sound("hit");


        display.innerHTML = `

            <span
                style="
                    color:var(--green);
                    font-size:22px;
                "
            >
                ${playerSequence.join("  ")}
            </span>

        `;


        if (
            playerSequence.length ===
            sequence.length
        ) {

            acceptingInput = false;

            buttons.forEach(
                button => {
                    button.disabled = true;
                }
            );

            score++;

            $("#memory-score")
                .textContent =
                score;

            stateText.textContent =
                "CORRECT ♥";

            stateText.style.color =
                "var(--green)";

            sound("good");


            if (round >= 5) {

                const finishTimer =
                    setTimeout(
                        finish,
                        700
                    );

                timers.push(
                    finishTimer
                );

                return;

            }


            round++;

            const nextTimer =
                setTimeout(() => {

                    stateText.style.color =
                        "white";

                    nextRound();

                }, 800);

            timers.push(
                nextTimer
            );

        }

    }


    function finish() {

        if (finished) {
            return;
        }

        finished = true;

        clearTimers();


        if (score >= 4) {

            sound("good");

            completeGame(
                "duo",
                250
            );

            showResult(
                true,
                "MEMORY MASTER",
                "You remembered the sequence and cleared the memory challenge, my love.",
                250,
                "music"
            );

        } else {

            sound("bad");

            showResult(
                false,
                "MEMORY FAILED",
                "You need at least 4 successful rounds. Try again!",
                0,
                "duo"
            );

        }

    }


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    pressSymbol(
                        button.dataset.memory
                    );

                }
            );

        }
    );


    gameCleanup = () => {

        finished = true;

        acceptingInput = false;

        clearTimers();

        buttons.forEach(
            button => {
                button.disabled = true;
            }
        );

    };


    nextRound();

}

/* =========================================================
   GAME 4
========================================================= */

function startMusic() {

    const host =
        $("#game-area");

    host.innerHTML = `

        <div class="game-screen music-game">

            <div class="game-title">

                <h2>
                    MUSIC STAGE
                </h2>

                <p>
                    Press the matching key.
                </p>

                <div class="game-stats">

                    <span>
                        NOTE:
                        <strong id="music-note-count">
                            1/20
                        </strong>
                    </span>

                    <span>
                        HIT:
                        <strong id="music-score">
                            0
                        </strong>
                    </span>

                </div>

            </div>

            <div
                class="music-lanes"
                id="music-lanes"
            >

                <button
                    class="music-lane"
                    data-key="a"
                >
                    <span class="lane-key">
                        A
                    </span>
                </button>

                <button
                    class="music-lane"
                    data-key="s"
                >
                    <span class="lane-key">
                        S
                    </span>
                </button>

                <button
                    class="music-lane"
                    data-key="d"
                >
                    <span class="lane-key">
                        D
                    </span>
                </button>

                <button
                    class="music-lane"
                    data-key="f"
                >
                    <span class="lane-key">
                        F
                    </span>
                </button>

            </div>

            <div
                class="timing-state"
                id="music-state"
            >
                GET READY
            </div>

        </div>
    `;


    const lanes =
        $$(".music-lane");

    const stateText =
        $("#music-state");

    let note = 1;

    let score = 0;

    let activeKey =
        null;

    let finished = false;

    let timer = null;


    function chooseNote() {

        if (finished) {
            return;
        }

        lanes.forEach(
            lane =>
                lane.classList.remove(
                    "active"
                )
        );


        const index =
            Math.floor(
                Math.random() *
                4
            );

        const selected =
            lanes[index];

        activeKey =
            selected.dataset.key;

        selected.classList.add(
            "active"
        );

        stateText.textContent =
            "PRESS " +
            activeKey.toUpperCase();

        sound("click");

    }


    function press(key) {

        if (
            finished ||
            !activeKey
        ) {
            return;
        }


        if (
            key.toLowerCase() ===
            activeKey
        ) {

            score++;

            sound("hit");

            stateText.textContent =
                "NICE!";

        } else {

            sound("bad");

            stateText.textContent =
                "MISS";

        }


        $("#music-score")
            .textContent =
            score;


        if (note >= 20) {

            finished = true;

            lanes.forEach(
                lane =>
                    lane.classList.remove(
                        "active"
                    )
            );

            setTimeout(() => {

                if (score >= 14) {

                    completeGame(
                        "music",
                        300
                    );

                    showResult(
                        true,
                        "MUSIC STAGE CLEARED",
                        "You finished the final quest, my love.",
                        300,
                        null
                    );

                } else {

                    showResult(
                        false,
                        "SONG FAILED",
                        "You need at least 14 correct notes.",
                        0,
                        "music"
                    );

                }

            }, 500);

            return;

        }


        note++;

        $("#music-note-count")
            .textContent =
            note + "/20";


        timer =
            setTimeout(
                chooseNote,
                250
            );

    }


    function keydown(e) {

        const key =
            e.key.toLowerCase();

        if (
            ["a","s","d","f"]
                .includes(key)
        ) {

            e.preventDefault();

            press(key);

        }

    }


    document.addEventListener(
        "keydown",
        keydown
    );


    lanes.forEach(
        lane => {

            lane.addEventListener(
                "click",
                () => {

                    press(
                        lane.dataset.key
                    );

                }
            );

        }
    );


    gameCleanup = () => {

        finished = true;

        clearTimeout(timer);

        document.removeEventListener(
            "keydown",
            keydown
        );

    };


    setTimeout(
        chooseNote,
        700
    );

}


/* =========================================================
   RESULT SCREEN
========================================================= */

function showResult(
    won,
    title,
    description,
    xp,
    nextGame
) {

    const area =
        $("#game-area");

    const overlay =
        document.createElement("div");

    overlay.className =
        "result-overlay";


    let buttons = "";

    if (won) {

        buttons += `
            <button
                class="continue"
                data-result-action="continue"
            >
                ${nextGame
                    ? "NEXT QUEST"
                    : "CLOSE"}
            </button>
        `;

    } else {

        buttons += `
            <button
                class="continue"
                data-result-action="retry"
            >
                TRY AGAIN
            </button>

            <button
                data-result-action="close"
            >
                EXIT
            </button>
        `;

    }


    overlay.innerHTML = `

        <div class="result-card">

            <div class="result-icon">
                ${won ? "♥" : "×"}
            </div>

            <h2>
                ${title}
            </h2>

            <p>
                ${description}
            </p>

            ${
                xp > 0
                    ? `<div class="result-xp">
                        +${xp} XP
                       </div>`
                    : ""
            }

            <div class="result-actions">
                ${buttons}
            </div>

        </div>
    `;


    area
        .querySelector(".game-screen")
        .appendChild(
            overlay
        );


    function actionHandler(event) {

        const button =
            event.target.closest(
                "[data-result-action]"
            );

        if (!button) {
            return;
        }

        const action =
            button.dataset.resultAction;


        overlay.remove();

        area.removeEventListener(
            "click",
            actionHandler
        );


        if (action === "retry") {

            openGame(
                currentGame
            );

            return;

        }


        if (action === "continue") {

            if (nextGame) {

                openGame(
                    nextGame
                );

            } else {

                closeGame();

                showSection(
                    "vault"
                );

            }

            return;

        }


        if (action === "close") {

            closeGame();

        }

    }


    area.addEventListener(
        "click",
        actionHandler
    );

}


/* =========================================================
   SOUND TOGGLE
========================================================= */

$("#sound-toggle")
    .addEventListener(
        "click",
        () => {

            state.sound =
                !state.sound;

            save();

            $("#sound-toggle")
                .textContent =
                state.sound
                    ? "🔊"
                    : "🔇";

            if (state.sound) {

                initAudio();

                sound("good");

            }

        }
    );


/* =========================================================
   RESET SAVE
========================================================= */

$("#reset-save")
    .addEventListener(
        "click",
        () => {

            const confirmed =
                confirm(
                    "Reset all PROJECT: 100 progress?"
                );

            if (!confirmed) {
                return;
            }

            localStorage.removeItem(
                STORAGE_KEY
            );

            location.reload();

        }
    );


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            if (
                !$("#game-modal")
                    .classList
                    .contains("hidden")
            ) {

                closeGame();

            }

            if (
                !$("#scroll-modal")
                    .classList
                    .contains("hidden")
            ) {

                $("#scroll-modal")
                    .classList
                    .add("hidden");

            }

        }

    }
);


/* =========================================================
   UPDATE EVERYTHING
========================================================= */

function updateAll() {

    updateHUD();

    updateGames();

    updateVault();

    updateAchievements();

    $("#sound-toggle")
        .textContent =
        state.sound
            ? "🔊"
            : "🔇";

}


/* =========================================================
   INITIALIZE
========================================================= */

renderScrolls();

updateAll();

boot();


})();