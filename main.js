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

    if (lessonData[lesson][exercise].exerciseType == "flashcard") { // only type implemented for now
        document.getElementById('exercise-type').value = "flashcard";
        document.getElementById('exercise-question').innerText = lessonData[lesson][exercise].exerciseQuestion;
        document.getElementById('exercise-answer').classList.add('hidden');
        document.getElementById('next-button').classList.add('hidden');
        document.getElementById('exercise-answer').innerText = lessonData[lesson][exercise].exerciseAnswer;
    }
}

function submitExercise() {
    let exerciseType = document.getElementById('exercise-type').value;

    if (exerciseType == "flashcard") {
        document.getElementById('exercise-answer').classList.toggle('hidden');
        document.getElementById('next-button').classList.toggle('hidden');
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
