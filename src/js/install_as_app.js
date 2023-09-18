"use strict";

export default function install(window, document) {
    const btnAdd = document.querySelector(".butInstall");
    let deferredPrompt;
    btnAdd.addEventListener("click", (e) => {
        e.preventDefault();
        btnAdd.classList.add("hidden");
        // Show the prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((resp) => {
            console.log(JSON.stringify(resp));
        });
    });


    window.addEventListener("beforeinstallprompt", (e) => {
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
