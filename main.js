let supportedLanguages = ["demo", "adcovtle"]; // updated manually for each new language

let lessonData = {};
let currentUser = "default";
let currentLearningLanguage = "demo";

async function fetchData() {
    try {
        let response = await fetch('/languages/' + currentLearningLanguage + '.json');
        data = await response.json();
        lessonData = data;
        return true;
    } catch {
        return false;
    }
}

// Exercise setup and sumbition functions

let defaultInnerHTML = document.getElementById('exercise-area').innerHTML;

function clearDefaults() {
    document.getElementById('exercise-area').innerText = "";
}

function restoreDefaults() {
    document.getElementById('exercise-area').innerHTML = defaultInnerHTML;
}

function setupFlashcard(lesson, exercise) {
    document.getElementById('exercise-type').value = "flashcard";
    document.getElementById('exercise-question').innerText = lessonData[lesson][exercise].exerciseQuestion;
    document.getElementById('exercise-answer').classList.add('hidden');
    document.getElementById('exercise-answer').innerText = lessonData[lesson][exercise].exerciseAnswer;
}

function submitFlashcard() {
    document.getElementById('exercise-answer').classList.toggle('hidden');
    document.getElementById('next-button').classList.toggle('hidden');
}

function setupFillInTheBlank (lesson, exercise) {
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
}

function submitFillInTheBlank(lesson, exercise) {
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
}

function setupMatching(lesson, exercise) {
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
}

function submitMatching() {
    if (document.getElementsByClassName('completed').length == document.getElementsByClassName('draggable').length) {
        // all draggable elements are marked as completed, so user has matched them all
        document.getElementById('next-button').classList.remove('hidden');
    }
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

function setupMultipleChoice(lesson, exercise) {
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

function submitMultipleChoice() {
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

function setupTerminologyIntroduction(lesson, exercise) {
    clearDefaults();
    let terms = lessonData[lesson][exercise].terms;
    let definitions = lessonData[lesson][exercise].definitions;
    let termImgLinks = lessonData[lesson][exercise].termImgs;

    let termCon = document.createElement('div');
    termCon.id = 'term-container';

    for (let i in terms) {
        let termColumn = document.createElement('div');

        let termImg = document.createElement('img');
        termImg.src = '/images/' + termImgLinks[i];
        termImg.classList.add('term-img');
        termColumn.appendChild(termImg);

        let term = document.createElement('div');
        term.innerText = terms[i];
        termColumn.appendChild(term);

        let definition = document.createElement('div');
        definition.innerText = definitions[i];
        termColumn.appendChild(definition);

        termCon.appendChild(termColumn);
    }

    let nextButton = document.createElement('button');
    nextButton.id = 'next-button';
    nextButton.onclick = nextExercise;
    nextButton.innerText = 'Continue';

    document.getElementById('exercise-area').appendChild(termCon);
    document.getElementById('exercise-area').appendChild(nextButton);
}

let numberFlashcardsVisible = 0;
let numberFlashcardsTotal = 0;

function setupFlashcardv2(lesson, exercise) {
    clearDefaults();
    let terms = lessonData[lesson][exercise].terms;
    let definitions = lessonData[lesson][exercise].definitions;
    let termImgLinks = lessonData[lesson][exercise].termImgs;

    let termCon = document.createElement('div');
    termCon.id = 'term-container';

    for (let i in terms) {
        let termColumn = document.createElement('div');

        let termImg = document.createElement('img');
        termImg.src = '/images/' + termImgLinks[i];
        termImg.classList.add('term-img');
        termColumn.appendChild(termImg);

        let term = document.createElement('div');
        term.innerText = terms[i];
        termColumn.appendChild(term);

        let definition = document.createElement('div');
        definition.innerText = definitions[i];
        definition.classList.add('hidden');
        termColumn.appendChild(definition);

        termColumn.onclick = function () {
            term.classList.toggle('hidden');
            definition.classList.toggle('hidden');
            if (definition.classList.contains('hidden')) {
                numberFlashcardsVisible--;
            } else {
                numberFlashcardsVisible++;
            }
            if (numberFlashcardsVisible >= numberFlashcardsTotal) {
                document.getElementById('next-button').classList.remove('hidden');
            }
        }

        termCon.appendChild(termColumn);
        numberFlashcardsTotal++;
    }

    let nextButton = document.createElement('button');
    nextButton.id = 'next-button';
    nextButton.onclick = nextExercise;
    nextButton.innerText = 'Continue';
    nextButton.classList.add('hidden');

    document.getElementById('exercise-area').appendChild(termCon);
    document.getElementById('exercise-area').appendChild(nextButton);
}

function setupFillInTheBlankv2(lesson, exercise) {
    clearDefaults();
    let terms = lessonData[lesson][exercise].terms;
    let definitions = lessonData[lesson][exercise].definitions;
    let termImgLinks = lessonData[lesson][exercise].termImgs;

    let termCon = document.createElement('div');
    termCon.id = 'term-container';

    for (let i in terms) {
        let termColumn = document.createElement('div');

        let termImg = document.createElement('img');
        termImg.src = '/images/' + termImgLinks[i];
        termImg.classList.add('term-img');
        termColumn.appendChild(termImg);

        let term = document.createElement('div');
        term.innerText = terms[i];
        termColumn.appendChild(term);

        let definition = document.createElement('div');
        let definitionAnswer = document.createElement('input');
        definitionAnswer.type = "hidden";
        definitionAnswer.value = definitions[i];
        definition.appendChild(definitionAnswer)

        let definitionInput = document.createElement('input');
        definitionInput.type = "text";
        definitionInput.classList.add('incorrect');
        definitionInput.onchange = function () {
            if (definitionInput.value == definitionAnswer.value) {
                definitionInput.classList.remove('incorrect');
                definitionInput.disabled = true;
                if (termCon.getElementsByClassName('incorrect').length == 0) {
                    nextButton.classList.remove('hidden');
                }
            }
        }
        definition.appendChild(definitionInput);
        termColumn.appendChild(definition);

        termCon.appendChild(termColumn);
    }

    let nextButton = document.createElement('button');
    nextButton.id = 'next-button';
    nextButton.onclick = nextExercise;
    nextButton.innerText = 'Continue';
    nextButton.classList.add('hidden');

    document.getElementById('exercise-area').appendChild(termCon);
    document.getElementById('exercise-area').appendChild(nextButton);
}

function setupMultipleChoicev2(lesson, exercise) {
    clearDefaults();
    let term = lessonData[lesson][exercise].term;
    let choices = lessonData[lesson][exercise].choices;
    let correctAnswerValue = lessonData[lesson][exercise].correctAnswer;
    let choiceImgLinks = lessonData[lesson][exercise].choiceImgs;

    let termLoc = document.createElement('div');
    termLoc.id = 'term-location';
    termLoc.innerText = term;
    document.getElementById('exercise-area').appendChild(termLoc);

    let choiceCon = document.createElement('div');
    choiceCon.id = 'term-container';

    for (let i in choices) {
        let choiceColumn = document.createElement('div');

        let choiceImg = document.createElement('img');
        choiceImg.src = '/images/' + choiceImgLinks[i];
        choiceImg.classList.add('term-img');
        choiceColumn.appendChild(choiceImg);

        let answer = document.createElement('div');
        let answerText = document.createElement('span');
        answerText.innerText = choices[i];
        answer.appendChild(answerText);

        let correctAnswer = document.createElement('input');
        correctAnswer.type = "hidden";
        if (choices[i] == correctAnswerValue) {
            correctAnswer.value = true;
        } else {
            correctAnswer.value = false;
        }
        answer.appendChild(correctAnswer)

        choiceColumn.onclick = function () {
            if (correctAnswer.value == "true") {
                choiceColumn.classList.add('correct-highlight');
                nextButton.classList.remove('hidden');
            }
        }

        choiceColumn.appendChild(answer);
        choiceCon.appendChild(choiceColumn);
    }

    let nextButton = document.createElement('button');
    nextButton.id = 'next-button';
    nextButton.onclick = nextExercise;
    nextButton.innerText = 'Continue';
    nextButton.classList.add('hidden');

    document.getElementById('exercise-area').appendChild(choiceCon);
    document.getElementById('exercise-area').appendChild(nextButton);
}

// All other functions

function updateProgressBars(lesson, exercise) {
    document.getElementById('lesson-progress-bar').value = lesson;
    let maxLessonNumber = 0;
    for (let i in lessonData) {
        let numI = Number(i);
        if (Number.isNaN(numI)) {
            continue;
        }
        maxLessonNumber = Math.max(numI, maxLessonNumber) + 1; // plus because of 0-indexing
    }
    document.getElementById('lesson-progress-bar').max = maxLessonNumber;

    document.getElementById('exercise-progress-bar').value = exercise;
    let maxExerciseNumber = 0;
    for (let i in lessonData[lesson]) {
        let numI = Number(i);
        if (Number.isNaN(numI)) {
            continue;
        }
        maxExerciseNumber = Math.max(numI, maxExerciseNumber) + 1; // plus because of 0-indexing
    }
    document.getElementById('exercise-progress-bar').max = maxExerciseNumber;
}

function populateFields(lesson, exercise) {
    document.getElementById('lesson-title').innerText = lessonData[lesson].lessonTitle;
    document.getElementById('exercise-title').innerText = lessonData[lesson][exercise].exerciseTitle;
    updateProgressBars(lesson, exercise);

    document.getElementById('exercise-question').innerText = ""; // clear out these fields before setting their new values
    document.getElementById('exercise-answer').innerText = "";
    document.getElementById('next-button').classList.add('hidden');
    document.getElementById('exercise-submit').classList.remove('hidden');

    if (lessonData[lesson][exercise].exerciseImage != undefined) {
        let img_obj = document.createElement('img');
        img_obj.src = '/images/' + lessonData[lesson][exercise].exerciseImage;
        img_obj.classList.add('page-image');
        document.getElementById('exercise-image-container').appendChild(img_obj);
    } else {
        document.getElementById('exercise-image-container').innerText = "";
    }

    if (lessonData[lesson][exercise].exerciseType == "flashcard") {
        setupFlashcard(lesson, exercise);
    } else if (lessonData[lesson][exercise].exerciseType == "fill-in-the-blank") {
        setupFillInTheBlank(lesson, exercise);
    } else if (lessonData[lesson][exercise].exerciseType == "matching") {
        setupMatching(lesson, exercise);
    } else if (lessonData[lesson][exercise].exerciseType == "multiple-choice") {
        setupMultipleChoice(lesson, exercise);
    } else if (lessonData[lesson][exercise].exerciseType == "terminology-introduction") {
        setupTerminologyIntroduction(lesson, exercise);
    } else if (lessonData[lesson][exercise].exerciseType == "flashcard-v0.2") {
        setupFlashcardv2(lesson, exercise);
    } else if (lessonData[lesson][exercise].exerciseType == "fill-in-the-blank-v0.2") {
        setupFillInTheBlankv2(lesson, exercise);
    } else if (lessonData[lesson][exercise].exerciseType == "multiple-choice-v0.2") {
        setupMultipleChoicev2(lesson, exercise);
    }
}

function submitExercise() {
    let exerciseType = document.getElementById('exercise-type').value;

    if (exerciseType == "flashcard") {
        submitFlashcard();
    } else if (exerciseType == "fill-in-the-blank") {
        submitFillInTheBlank();
    } else if (exerciseType == "matching") {
        submitMatching();
    } else if (exerciseType == "multiple-choice") {
        submitMultipleChoice();
    }
}

function displayCompletionScreen(newLesson, newExercise) {
    updateProgressBars(newLesson, newExercise);
    document.getElementById('lesson-title').innerText = "Congratulations!";
    document.getElementById('exercise-title').innerText = "You have finished all of the lessons";
    document.getElementById('exercise-question').innerText = "Check back for more lessons soon!";
    document.getElementById('exercise-answer').innerText = "";
    document.getElementById('next-button').classList.add('hidden');
    document.getElementById('exercise-submit').classList.add('hidden');
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

    setCookie(currentUser + currentLearningLanguage + 'currentLesson', newLesson, 365);
    setCookie(currentUser + currentLearningLanguage + 'currentExercise', newExercise, 365);

    restoreDefaults();

    if (newLesson == oldLessonMax) {
        displayCompletionScreen(newLesson, newExercise);
    } else {
        populateFields(newLesson, newExercise);
    }
}

function resetProgress() {
    let confirmation = confirm("Are you sure you want to reset your progress for the current learning language? This cannot be undone.");
    if (confirmation) {
        setCookie(currentUser + currentLearningLanguage + 'currentLesson', 0, 365);
        setCookie(currentUser + currentLearningLanguage + 'currentExercise', 0, 365);
        populateFields(0, 0);
    }
}

function login() {
    currentUser = document.getElementById('username').value;
    setCookie('currentUser', currentUser, 365);
    currentLearningLanguage = getCookie(username + 'currentLearningLanguage');
    let prevLesson = Number(getCookie(currentUser + currentLearningLanguage + 'currentLesson')); // will return 0 if unset
    let prevExercise = Number(getCookie(currentUser + currentLearningLanguage + 'currentExercise')); // same as above
    try {
        populateFields(prevLesson, prevExercise); // return to the previous lesson
    } catch (e) {
        displayCompletionScreen(prevLesson, prevExercise);
    }
    alert('Switched to user ' + currentUser);
}

function switchLearningLanguage() {
    currentLearningLanguage = document.getElementById('learning-language').value;
    setCookie(currentUser + 'currentLearningLanguage', currentLearningLanguage, 365);
    let prevLesson = Number(getCookie(currentUser + currentLearningLanguage + 'currentLesson')); // will return 0 if unset
    let prevExercise = Number(getCookie(currentUser + currentLearningLanguage + 'currentExercise')); // same as above
    fetchData().then(function () {
        try {
            populateFields(prevLesson, prevExercise); // return to the previous lesson
        } catch (e) {
            displayCompletionScreen(prevLesson, prevExercise);
        }
        //alert('Switched to learning ' + currentLearningLanguage);
    });
}

async function setupLanguageSelection() {
    for (let i in supportedLanguages) {
        let opt = document.createElement('option');
        opt.value = supportedLanguages[i];
        opt.innerText = supportedLanguages[i];
        document.getElementById('learning-language').appendChild(opt);
    }
}

async function loadPage() {
    await setupLanguageSelection()
    currentUser = getCookie('currentUser');
    if (currentUser == "") {
        currentUser = "default";
        setCookie('currentUser', currentUser, 365);
        alert('This site uses cookies to maintain your progress and distinguish you from other visitors. By continuing to use this site you agree to the use of cookies.')
    }
    currentLearningLanguage = getCookie(currentUser + 'currentLearningLanguage');
    if (currentLearningLanguage == "") {
        currentLearningLanguage = "demo";
    }
    document.getElementById('username').value = currentUser;
    document.getElementById('learning-language').value = currentLearningLanguage;
    let prevLesson = Number(getCookie(currentUser + currentLearningLanguage + 'currentLesson')); // will return 0 if unset
    let prevExercise = Number(getCookie(currentUser + currentLearningLanguage + 'currentExercise')); // same as above
    await fetchData();
    try {
        populateFields(prevLesson, prevExercise); // return to the previous lesson
    } catch (e) {
        displayCompletionScreen(prevLesson, prevExercise);
    }
}

loadPage();
