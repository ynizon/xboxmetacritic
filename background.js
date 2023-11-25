// background.js
// Author:
// Author URI: https://
// Author Github URI: https://www.github.com/
// Project Repository URI: https://github.com/
// Description: Handles all the browser level activities (e.g. tab management, etc.)
// License: MIT
/*

Need into manifest:
    "background": {
        "service_worker": "background.js"
    },

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action === 'getInfo') {
            let title = request.title.replace('™','').replace('®','');
            //sendResponse(chrome.storage.local.get("Gotham Knights"));

            const url = 'https://www.metacritic.com/search/' + encodeURI(title)+"/";
            //alert(url);
            //console.log(url);

            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Network response was not ok, status: ${response.status}`);
                    }

                    return response.text();
                })
                .then(html => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');

                    const scoreElement = doc.querySelector('.c-siteReviewScore_background');
                    let note = "?";
                    let link = url;
                    if (scoreElement) {
                        note = scoreElement.textContent.trim();
                        link = 'https://www.metacritic.com' + scoreElement.parentNode.parentNode.getAttribute('href');
                    }
                    senderResponse({note:note, link: link});
                })
                .catch(error => {
                    //console.error('Error during fetch:', error);
                });
        }
    }
);
*/