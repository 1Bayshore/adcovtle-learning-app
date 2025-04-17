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
        maxLessonNumber = Math.max(numI, maxLessonNumber);
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
        maxExerciseNumber = Math.max(numI, maxExerciseNumber);
    }
    document.getElementById('exercise-progress-bar').max = maxExerciseNumber;

    if (lessonData[lesson][exercise].exerciseType == "flashcard") { // only type implemented for now
        document.getElementById('exercise-type').value = "flashcard";
        document.getElementById('exercise-question').innerText = lessonData[lesson][exercise].exerciseQuestion;
        document.getElementById('exercise-answer').classList.add('hidden');
        document.getElementById('exercise-answer').innerText = lessonData[lesson][exercise].exerciseAnswer;
    }
}

function submitExercise() {
    let exerciseType = document.getElementById('exercise-type').value;

    if (exerciseType == "flashcard") {
        document.getElementById('exercise-answer').classList.toggle('hidden');
    }
}

async function loadPage() {
    await fetchData();
    populateFields(0, 0); //initialize on the first exercise
}

loadPage();