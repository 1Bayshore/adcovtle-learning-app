# adcovtle-learning-app
A web app that allows users to learn adcovtle, with potential expansion to other conlangs.

## Basic plan
The Javascript web app will allow for people to learn adcovtle, a conlang that is important in Tiðloten. Once adcovtle is implemented, this web app will be able to expand to allow learning of other conlangs.

## UI/UX design
The website will be focused on three key types of exercises, each described below. Note that due to limited resources, vocabulary and grammar will be prioritized over pronunciation. These exercises will be divided into lessons, each of which will have a cultural theme. The website will be easy to use on both desktop and mobile.

### Introduction exercises
These exercises will allow users to learn new vocabulary and grammar. They will include things like flashcards.

### Memorization exercises
These exercises will allow users to memorize new vocabulary and grammar. They will include things like matching and fill in the blank.

### Context exercises
These exercises will allow users to use their new vocabulary and grammar in context. They will include things like full sentence translation and, for more advanced users, multiple choice reading response exercises.

## Backend design
The website will build each exercise from a consistently-formatted JSON file. The JSON format will be described below.

### Lesson number
The number of the lesson, beginning at 0 being the introduction.

### Lesson title
The title of the lesson, with reference to the cultural theme (e.g. Cities in Covtle)

### Exercise number
The number of the exercise, beginning at 0 for the first exercise in the lesson.

### Exercise title
The title of the specific exercise (e.g. Fill in the blank).

### Exercise type
The type of the exercise (e.g. fill-in-the-blank, full-sentence-translation)

### Exercise question
The content of the exercise, to be parsed according to the exercise type. For example, a fill-in-the-blank will include markers for blanks.

### Exercise answer
The answers to the exercise, to be parsed according to the exercise type. For example, a flashcard answer will appear when a button is pressed.

