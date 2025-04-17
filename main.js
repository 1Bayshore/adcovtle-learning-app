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

let lessonData = {};

async function fetchData() {
    let response = await fetch('lessons.json');
    data = await response.json();
    lessonData = data;
}

function matchingDropCheck(e) {
    let srcId = e.dataTransfer.getData("Text");
    let targetId = e.target.id;
    if (srcId.replace('question', '').replace('answer', '') == targetId.replace('question', '').replace('answer', '')) {
        document.getElementById(srcId).classList.add('completed');
        document.getElementById(targetId).classList.add('completed');
    }

    e.preventDefault();
}

function matchingDragStart(e) {
    e.dataTransfer.setData("Text", e.target.id);
}

function populateFields(lesson, exercise) {
    document.getElementById('lesson-title').innerText = lessonData[lesson].lessonTitle;
    document.getElementById('lesson-progress-bar').value = lessonData[lesson].lessonNumber;
    let maxLessonNumber = 0;
    for (let i in lessonData) {
        let numI = Number(i);
        if (Number.isNaN(numI)) {
            continue;
        }
        maxLessonNumber = Math.max(numI, maxLessonNumber) + 1; // plus because of 0-indexing
    }
    document.getElementById('lesson-progress-bar').max = maxLessonNumber;

    document.getElementById('exercise-title').innerText = lessonData[lesson][exercise].exerciseTitle;
    document.getElementById('exercise-progress-bar').value = lessonData[lesson][exercise].exerciseNumber;
    let maxExerciseNumber = 0;
    for (let i in lessonData[lesson]) {
        let numI = Number(i);
        if (Number.isNaN(numI)) {
            continue;
        }
        maxExerciseNumber = Math.max(numI, maxExerciseNumber) + 1; // plus because of 0-indexing
    }
    document.getElementById('exercise-progress-bar').max = maxExerciseNumber;

    document.getElementById('exercise-question').innerText = ""; // clear out these fields before setting their new values
    document.getElementById('exercise-answer').innerText = "";
    document.getElementById('next-button').classList.add('hidden');

    if (lessonData[lesson][exercise].exerciseType == "flashcard") {
        document.getElementById('exercise-type').value = "flashcard";
        document.getElementById('exercise-question').innerText = lessonData[lesson][exercise].exerciseQuestion;
        document.getElementById('exercise-answer').classList.add('hidden');
        document.getElementById('exercise-answer').innerText = lessonData[lesson][exercise].exerciseAnswer;
    } else if (lessonData[lesson][exercise].exerciseType == "fill-in-the-blank") {
        document.getElementById('exercise-type').value = "fill-in-the-blank";

        let textWithBlanks = lessonData[lesson][exercise].exerciseQuestion;
        let splitTextWithBlanks = textWithBlanks.split('__blank__');
        for (let e in splitTextWithBlanks) {
            document.getElementById('exercise-question').appendChild(new Text(splitTextWithBlanks[e]));
            if (Number(e)+1 != splitTextWithBlanks.length) {
                let inputE = document.createElement('input');
                inputE.type = 'text';
                inputE.id = "question" + e;
                inputE.oninput = function () {
                    this.classList.remove('incorrect');
                }
                document.getElementById('exercise-question').appendChild(inputE);
            }
        }

        document.getElementById('exercise-answer').classList.add('hidden');
        document.getElementById('next-button').classList.add('hidden');

        for (let i in lessonData[lesson][exercise].exerciseAnswer) {
            let answerE = document.createElement('input');
            answerE.type = 'text'; // for debugging purposes, it will still be hidden by the div class
            answerE.id = "answer" + i;
            answerE.value = lessonData[lesson][exercise].exerciseAnswer[i];
            document.getElementById('exercise-answer').appendChild(answerE);
        }
    } else if (lessonData[lesson][exercise].exerciseType == "matching") {
        document.getElementById('exercise-type').value = "matching";
        document.getElementById('exercise-question').innerText = "Match the items on the left with the items on the right:"

        document.getElementById('exercise-answer').classList.remove('hidden');

        let leftBox = document.createElement('div');
        leftBox.id = 'leftBox';

        let rightBox = document.createElement('div');
        rightBox.id = 'rightBox';

        let boxBox = document.createElement('div');
        boxBox.id = 'boxBox';

        boxBox.ondragover = function (e) {
            e.preventDefault();
        }
        
        document.getElementById('exercise-answer').appendChild(boxBox);
        document.getElementById('boxBox').appendChild(leftBox);
        document.getElementById('boxBox').appendChild(rightBox);

        for (let i in lessonData[lesson][exercise].exerciseQuestion) {
            let iEle = document.createElement('span');
            iEle.draggable = true;
            iEle.id = 'question' + i;
            iEle.classList.add('draggable');
            iEle.innerText = lessonData[lesson][exercise].exerciseQuestion[i];
            iEle.ondrop = matchingDropCheck;
            iEle.ondragstart = matchingDragStart;
            document.getElementById('leftBox').appendChild(iEle);
            document.getElementById('leftBox').appendChild(document.createElement('br'));
        }

        let answerArray = [];
        for (let i in lessonData[lesson][exercise].exerciseAnswer) {
            let iEle = document.createElement('span');
            iEle.draggable = true;
            iEle.id = 'answer' + i;
            iEle.classList.add('draggable');
            iEle.innerText = lessonData[lesson][exercise].exerciseAnswer[i];
            iEle.ondrop = matchingDropCheck;
            iEle.ondragstart = matchingDragStart;
            answerArray.push(iEle);
        }
        
        let fullAnswerArrayLength = answerArray.length;
        for (let i = 0; i < fullAnswerArrayLength; i++) {
            let appendingEle = answerArray[Math.floor(Math.random() * answerArray.length)];
            answerArray.splice(answerArray.indexOf(appendingEle), 1);
            document.getElementById('rightBox').appendChild(appendingEle);
            document.getElementById('rightBox').appendChild(document.createElement('br'));
        }

        document.getElementById('leftBox').classList.add('draggableContainer');
        document.getElementById('rightBox').classList.add('draggableContainer');
    } else if (lessonData[lesson][exercise].exerciseType == "multiple-choice") {
        document.getElementById('exercise-type').value = "multiple-choice";
        document.getElementById('exercise-question').innerText = lessonData[lesson][exercise].exerciseQuestion;
        document.getElementById('exercise-answer').classList.remove('hidden');

        let formEle = document.createElement('form');
        formEle.id = 'buttonForm';

        for (let i in lessonData[lesson][exercise].exerciseAnswer) {
            let iEle = document.createElement('input');
            iEle.type = 'radio';
            iEle.name = 'radioButton';
            iEle.value = lessonData[lesson][exercise].exerciseAnswer[i];

            let iEleLabel = document.createElement('label');
            iEleLabel.for = iEle;
            iEleLabel.innerText = i;

            formEle.appendChild(iEle);
            formEle.appendChild(iEleLabel);
            formEle.appendChild(document.createElement('br'));
        }
        document.getElementById('exercise-answer').appendChild(formEle);
    }
}

function submitExercise() {
    let exerciseType = document.getElementById('exercise-type').value;

    if (exerciseType == "flashcard") {
        document.getElementById('exercise-answer').classList.toggle('hidden');
        document.getElementById('next-button').classList.toggle('hidden');
    } else if (exerciseType == "fill-in-the-blank") {
        let allCorrect = true;
        for (let a = 0; a < document.getElementById('exercise-answer').children.length; a++) {
            let answerEle = document.getElementById('exercise-answer').children[a];
            let questionEle = document.getElementById('question' + answerEle.id.replace('answer', ''));
            if (questionEle.value.toLowerCase() == answerEle.value.toLowerCase()) {
                questionEle.disabled = true;
            } else {
                questionEle.classList.add('incorrect');
                allCorrect = false;
            }
        }
        if (allCorrect) {
            document.getElementById('next-button').classList.remove('hidden');
        }
    } else if (exerciseType == "matching") {
        if (document.getElementsByClassName('completed').length == document.getElementsByClassName('draggable').length) {
            // all draggable elements are marked as completed, so user has matched them all
            document.getElementById('next-button').classList.remove('hidden');
        }
    } else if (exerciseType == "multiple-choice") {
        let valueIsTrue = false;
        document.getElementsByName('radioButton').forEach( function (i) {
            if (i.checked && i.value == "true") { // yes this is supposed to be a string
                valueIsTrue = true;
            }
        });
        if (valueIsTrue) {
            document.getElementById('next-button').classList.remove('hidden');
        }
    }
}

function displayCompletionScreen() {
    alert('Congratulations! You have finished all of the lessons. Check back for more lessons soon!');
}

function nextExercise() {
    let oldLesson = document.getElementById('lesson-progress-bar').value;
    let oldExercise = document.getElementById('exercise-progress-bar').value;
    let oldLessonMax = document.getElementById('lesson-progress-bar').max;
    let oldExerciseMax = document.getElementById('exercise-progress-bar').max;

    let newLesson = oldLesson;
    let newExercise = oldExercise + 1;
    if (newExercise == oldExerciseMax) {
        newExercise = 0;
        newLesson = oldLesson + 1;
    }

    if (newLesson == oldLessonMax) {
        displayCompletionScreen();
    } else {
        setCookie('currentLesson', newLesson, 365);
        setCookie('currentExercise', newExercise, 365);
        populateFields(newLesson, newExercise);
    }
}

function resetProgress() {
    let confirmation = confirm("Are you sure you want to reset your progress? This cannot be undone.");
    if (confirmation) {
        setCookie('currentLesson', 0, 365);
        setCookie('currentExercise', 0, 365);
        populateFields(0, 0);
    }
}

async function loadPage() {
    await fetchData();
    let prevLesson = Number(getCookie('currentLesson')); // will return 0 if unset
    let prevExercise = Number(getCookie('currentExercise')); // same as above
    populateFields(prevLesson, prevExercise); // return to the previous lesson
}

loadPage();
