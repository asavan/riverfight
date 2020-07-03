import "./css/style.css";

import settings from "./settings.js";
import {startGame} from "./starter.js";
import {placementAutomation, enableSecretMenu} from "./automation.js";

const game = startGame(settings.currentMode);
enableSecretMenu(game);
if (game && game.myField) {
    placementAutomation(game.myField, game);
}

try {
    game.getBattle().then(g => {
        g.on("gameover", (res) => {
            const btnAdd = document.querySelector('.butInstall');
            btnAdd.classList.remove("hidden2");
        });
    });

} catch (e) {
    console.log(e);
}

function install(window, document) {
    const btnAdd = document.querySelector('.butInstall');
    let deferredPrompt;
    btnAdd.addEventListener('click', (e) => {
        // hide our user interface that shows our A2HS button
        // btnAdd.setAttribute('disabled', true);
        btnAdd.classList.add("hidden");
        // Show the prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((resp) => {
            console.log(JSON.stringify(resp));
        });
    });


    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-info bar from appearing.
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI notify the user they can add to home screen
        // btnAdd.removeAttribute('disabled');
        btnAdd.classList.remove("hidden");
    });
    return btnAdd;
}

if (__USE_SERVICE_WORKERS__) {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js', {scope: './'});
        install(window, document);
    }
}
