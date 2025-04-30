# adcovtle-learning-app
A web app that allows users to learn adcovtle, with potential expansion to other conlangs.

## Basic plan
The Javascript web app allows for people to learn adcovtle, a conlang that is important in Tiðloten. Once adcovtle is implemented, this web app will be able to expand to allow learning of other conlangs.

## UI/UX design
The website is focused on three key types of exercises, each described below. Note that due to limited resources, vocabulary and grammar will are prioritized over pronunciation. These exercises are divided into lessons, each of which has a cultural theme. The website is currently easy to use on desktop, with better mobile support coming soon.

### Introduction exercises
These exercises allow users to learn new vocabulary and grammar. They include things like flashcards.

### Memorization exercises
These exercises allow users to memorize new vocabulary and grammar. They  include things like matching and fill in the blank.

### Context exercises
These exercises allow users to use their new vocabulary and grammar in context. They include things like full sentence translation and, for more advanced users, multiple choice reading response exercises.

## Backend design
The website builds each exercise from a consistently-formatted JSON file. The JSON format will be described below.

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
The content of the exercise, which is parsed according to the exercise type. For example, a fill-in-the-blank will include markers for blanks.

### Exercise answer
The answers to the exercise, which is according to the exercise type. For example, a flashcard answer will appear when a button is pressed.

## Upcoming features
The following features will be added in the near future.

### Image support
Optional images for each page will allow for a more visual experience.

### Improved menus and navigation
Right now, navigation is limited, and mostly consists of a username and language selection at the top of the page, plus a "Reset Progress" button at the bottom of the page. These will be replaced with a separate screen that allows users to set their username and select their language and lesson.

### Improved page styling
Currently, the page styling is limited and simplistic. A better design would allow for a light and dark mode, plus more asthetically pleasing elements on the page.

### More Adcovtle content
More Adcovtle content coming soon! This content will have a clearer focus on lesson themes, both grammatical/language themes and cultural themes.
