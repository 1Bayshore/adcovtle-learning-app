// Cookie handing code, from https://www.w3schools.com/js/js_cookies.asp
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
}

// All other code

let dictionaryData = [];
let possibleLanguages = [];

async function fetchData() {
    let response = await fetch('dictionary.json');
    dictionaryData = await response.json();
}

function populateLanguageSelection() {
    for (let word in dictionaryData) {
        for (let wordLanguageOption in dictionaryData[word]) {
            if (!(possibleLanguages.includes(wordLanguageOption))) {
                possibleLanguages.push(wordLanguageOption);
            }
        }
    }
    for (let lan in possibleLanguages) {
        let opt1 = document.createElement('option');
        opt1.value = possibleLanguages[lan];
        opt1.innerText = possibleLanguages[lan];
        document.getElementById('dictionary-language-lookup').appendChild(opt1);

        let opt2 = document.createElement('option');
        opt2.value = possibleLanguages[lan];
        opt2.innerText = possibleLanguages[lan];
        document.getElementById('dictionary-language-definitions').appendChild(opt2);
    }
    
    document.getElementById('dictionary-language-lookup').value = possibleLanguages[1];
    document.getElementById('dictionary-language-definitions').value = possibleLanguages[0];
}

function dictionarySearch() {
    document.getElementById('dictionary-result-words').innerText = '';
    document.getElementById('dictionary-result-partsofspeech').innerText = '';
    document.getElementById('dictionary-result-definitions').innerText = '';
    document.getElementById('dictionary-result-notes').innerText = '';

    let lookupWord = document.getElementById('search-term').value;

    let lookupLanguage = document.getElementById('dictionary-language-lookup').value;
    let definitionsLanguage = document.getElementById('dictionary-language-definitions').value;

    for (let word in dictionaryData) {
        for (let wordLanguageOption in dictionaryData[word]) {
            if (wordLanguageOption == lookupLanguage) {
                if (dictionaryData[word][wordLanguageOption]['word'].includes(lookupWord)) {
                    for (let defLanguageOption in dictionaryData[word]) {
                        if (defLanguageOption == definitionsLanguage) {
                            let ele = document.createElement('div');
                            if (dictionaryData[word][wordLanguageOption]['word'] != undefined) {
                                ele.innerText = dictionaryData[word][wordLanguageOption]['word'];
                            } else {
                                ele.innerText = '--';
                            }
                            document.getElementById('dictionary-result-words').appendChild(ele);

                            let ele2 = document.createElement('div');
                            if (dictionaryData[word][defLanguageOption]['partOfSpeech'] != undefined) {
                                ele2.innerText = dictionaryData[word][defLanguageOption]['partOfSpeech'];
                            } else {
                                ele2.innerText = '--';
                            }
                            document.getElementById('dictionary-result-partsofspeech').appendChild(ele2);

                            let ele3 = document.createElement('div');
                            if (dictionaryData[word][defLanguageOption]['word'] != undefined) {
                                ele3.innerText = dictionaryData[word][defLanguageOption]['word'];
                            } else {
                                ele3.innerText == '--'
                            }
                            document.getElementById('dictionary-result-definitions').appendChild(ele3);

                            let ele4 = document.createElement('div');
                            if (dictionaryData[word][wordLanguageOption]['notes'] != undefined) {
                                ele4.innerText = dictionaryData[word][wordLanguageOption]['notes'];
                            } else {
                                ele4.innerText = '--'
                            }
                            document.getElementById('dictionary-result-notes').appendChild(ele4);
                        }
                    }
                }
            }
        }
    }
}

async function loadPage() {
    await fetchData();
    populateLanguageSelection();
}

loadPage();
