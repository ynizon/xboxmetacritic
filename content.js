// content.js
// Author:
// Author URI: https://
// Author Github URI: https://www.github.com/
// Project Repository URI: https://github.com/
// Description: Handles all the webpage level activities (e.g. manipulating page data, etc.)
// License: MIT

/*
This method not works for the moment

window.setInterval(function() {
    let h1Elements = document.querySelectorAll('h1');
    let h3Elements = document.querySelectorAll('h3');
    let criticsElements = document.querySelectorAll('.xbox-critics');

    if (criticsElements.length === 0) {
        if (window.location.href.indexOf('/games/store/') > -1 && h1Elements.length > 0) {
            extractH1();
        }
        if (window.location.href.indexOf('/xbox-game-pass/') > -1 && h3Elements.length > 0) {
            extractH3();
        }
    }
}, 500);
*/

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'extractInfo') {
        if (window.location.href.indexOf('/games/store/') > -1) {
            extractH1();
        }
        if (window.location.href.indexOf('/xbox-game-pass/') > -1) {
            extractH3();
        }
    }

    if (request.action === 'showInfo') {
        let listItem = document.getElementById('game-'+request.gameId);
        listItem.innerText = request.note;
        listItem.onclick= function(event){event.preventDefault();window.open(request.link, '_blank');}
        listItem.style.background = '';
        listItem.style.cursor = 'pointer';
        listItem.title = 'View on metacritic.com';

        if (parseInt(request.note)>55) {
            listItem.style.background = 'orange';
        }
        if (parseInt(request.note)>80) {
            listItem.style.background = 'green';
        }
    }
});

function extractH3() {
    let criticsElements = document.querySelectorAll('.xbox-critics');
    let h3Elements = document.querySelectorAll('h3');
    if (h3Elements.length > 0 && criticsElements.length === 0) {
        let gameId = 0;
        h3Elements.forEach(function(node) {
            if (node.parentNode.parentNode.nodeName === 'A') {
                let listItem = document.createElement('div');
                listItem.setAttribute('id', 'game-' + gameId);
                listItem.innerText = '?';
                listItem.style.textAlign = 'center';
                listItem.style.position = 'relative';
                listItem.style.zIndex = '9999';
                listItem.className = 'xbox-critics';

                node.parentNode.parentNode.appendChild(listItem);

                chrome.runtime.sendMessage({action: "getInfo", gameId: gameId, title: node.textContent.trim()});
                gameId++;
            }
        });
    }
}

function extractH1() {
    let criticsElements = document.querySelectorAll('.xbox-critics');
    let h1Elements = document.querySelectorAll('h1');
    if (h1Elements.length > 0 && criticsElements.length === 0) {
        let gameId = 0;
        h1Elements.forEach(function(node) {
            let listItem = document.createElement('div');
            listItem.setAttribute('id', 'game-' + gameId);
            listItem.innerText = '?';
            listItem.style.textAlign = 'center';
            listItem.style.width = '50px';
            listItem.style.height = '50px';
            listItem.style.paddingTop = '12px';
            listItem.className = 'xbox-critics';

            node.parentNode.appendChild(listItem);

            chrome.runtime.sendMessage({action: "getInfo", gameId: gameId, title: node.textContent.trim()});
            gameId++;
        });
    }
}