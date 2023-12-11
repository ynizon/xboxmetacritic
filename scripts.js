chrome.tabs.query({active:true,currentWindow:true},function(tabs){
    chrome.tabs.sendMessage(tabs[0].id,{action: 'extractInfo'});
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'getInfo') {
        if(localStorage.getItem(request.title) == null) {
            let title = request.title.replace('™','').replace('®','');
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

                    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            action: 'showInfo',
                            link: link,
                            note: note,
                            gameId: request.gameId
                        });
                    });
                    if (note !== '?') {
                        localStorage.setItem(request.title, note);
                        localStorage.setItem("link-" + request.title, link);
                    }
                    //console.log(html);
                })
                .catch(error => {
                    //console.error('Error during fetch:', error);
                });
        } else {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs, info) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'showInfo',
                    link: localStorage.getItem("link-"+request.title),
                    note: localStorage.getItem(request.title),
                    gameId: request.gameId
                });
            });
        }
    }
});