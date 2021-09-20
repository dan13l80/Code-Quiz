var startButtonEl = document.querySelector("#begin-btn");
var mainEl = document.querySelector("#quiz-content");
var headerEl = document.querySelector("header");
var viewHighScoreEl = document.querySelector("#view-high-score");

// declare questions, answers, and results as objects
var questions = [
    {question: "1. Inside which HTML element do we put JavaScript code?",
    answers: ["javascript","script","js","scripting"],
    result: ["wrong","correct","wrong","wrong"]
    },
    {question: "2. How do you write 'Hello World' in an alert box?",
    answers: ["alert('Hello World')","msgBox('Hello World')","alertBox='Hello World'","alertBox('Hello World')"],
    result: ["correct","wrong","wrong","wrong"]
    },
    {question: "3. What do you write to display the list of an element's properties?",
    answers: ["console.log()","consolelog()","console.dir()","console(dir)"],
    result: ["wrong","wrong","correct","wrong"]
    },
    {question: "4. What's the correct way to write out the variable name?",
    answers: ["person1","PersonOne","PERSONONE","personOne"],
    result: ["wrong","wrong","wrong","correct"]
    },
    {question: "5. How do you select an element from the HTML file in JS?",
    answers: ["document.select()","document.querySelector()","window.qSelector()","document.querySelect = ()"],
    result: ["wrong","correct","wrong","wrong"]
    }
];

var time = document.querySelector("#countdown").textContent;
var questionCounter = 0;
var score = 0;
var highScoreList = [];

// function to create questions after 'start quiz' is clicked
var askQuestion = function() {
    mainEl.innerHTML = "";
    var questionEl = document.createElement("div");

    questionEl.innerHTML = "<h1 class='main-title question-title'>" + questions[questionCounter].question + "</h1>";

    // append return value from generateAnswers() function
    questionEl.appendChild(generateAnswers());

    mainEl.appendChild(questionEl);
    document.querySelector(".answers-container").addEventListener("click", displayResult);
};

// use setInterval to start an on-screen timer and end quiz when 0 or questions end
var startTimer = function() {
    var timer = setInterval(function() {
    time--;
    document.querySelector("#countdown").textContent = time;
    if (time === 0) {
        clearInterval(timer);
        quizOver();
    }

    if (questionCounter === questions.length) {
        clearInterval(timer);
    }
    }, 1000);
};

// create answers on page by looping through object
var generateAnswers = function() {
    var answerContEl = document.createElement("div");
    answerContEl.className = "answers-container";

    // declare current question on screen
    var currentQuestion = questions[questionCounter];

    for (i = 0; i < currentQuestion.answers.length; i++) {
        var answerButtonEl = document.createElement("button");
        answerButtonEl.type = "button";
        answerButtonEl.className = "answer-btn";
        if (currentQuestion.result[i] === "correct") {
            answerButtonEl.setAttribute("value","correct");
        }
        else if (currentQuestion.result[i] === "wrong") {
            answerButtonEl.setAttribute("value", "incorrect");
        }
        answerButtonEl.innerHTML = currentQuestion.answers[i];
        answerContEl.appendChild(answerButtonEl);
    }
    return answerContEl;
};

// function to show user if they selected the correct answer or not
var displayResult = function(event) {
    // get value from clicked button which reflects answer result
    selectedAnswer = event.target.value;

    if (selectedAnswer === "correct") {
        var resultMessage = document.createElement("div");
        resultMessage.innerHTML = "<h2>Correct!</h2>"
        mainEl.appendChild(resultMessage);
        score++;
    }
    else if (selectedAnswer === "incorrect") {
        var resultMessage = document.createElement("div");
        resultMessage.innerHTML = "<h2>Incorrect!</h2>"
        mainEl.appendChild(resultMessage);
    }

    // allows event listener to continue if user clicks another part of event that isn't the button
    else {
        return;
    }

    document.querySelector(".answers-container").removeEventListener("click", displayResult);

    // increase counter to move on to next question
    questionCounter++;

    // end quiz when questions run out
    if (questionCounter === questions.length) {
        setTimeout(quizOver, 1000);
    }
    else {
        setTimeout(askQuestion, 1000);
    }
};

// function to create end game screen and allow for score submit
var quizOver = function() {
    mainEl.innerHTML = "";
    var scoreForm = document.createElement("div");
    scoreForm.innerHTML = "<h1>All Done!</h1><p>Your final score is " + score + ".</p>";
    scoreForm.className = "score-page";

    var enterScore = document.createElement("div");
    enterScore.innerHTML = "<form class='score-form' id='score-form'><p>Enter initials: </p><div><input type='text' name='initials' /></div><div><button type='submit' id='submit-score'>Submit</submit></div></form>";
    scoreForm.appendChild(enterScore);
    mainEl.appendChild(scoreForm);
    document.querySelector("#score-form").addEventListener("submit", formScoreHandler);
};

// adds score to local storage and calls showScores() function
var formScoreHandler = function(event) {
    event.preventDefault();
    var initialsInput = document.querySelector("input[name='initials']").value;
    var scoreObj = {initials: initialsInput, score: score};

    highScoreList.push(scoreObj);
    localStorage.setItem("high-score", JSON.stringify(highScoreList));
    showScores();
};

// loads scores from local storage into variable to use in code
var loadScores = function() {
    var storedScores = localStorage.getItem("high-score");
    storedScores = JSON.parse(storedScores);

    if (!storedScores) {
        return false;
    }

    for (var i = 0; i < storedScores.length; i++) {
        highScoreList.push(storedScores[i]);
    }
};

// shows the list of high scores stored in local storage
var showScores = function() {
    headerEl.innerHTML = "";
    mainEl.innerHTML = "";

    var scoreListPage = document.createElement("div");
    scoreListPage.className = "score-list-page";

    var scoreListPageHeading = document.createElement("h1");
    scoreListPageHeading.innerHTML = ("High scores");

    var scoreList = document.createElement("ul");

    // sorts scores from highest to lowest
    var highScoreList = orderScores();
    for (i = 0; i < highScoreList.length; i++) {
        var scoreEl = document.createElement("li");
        scoreEl.innerHTML = (i + 1) + ". " + highScoreList[i].initials + " - " + highScoreList[i].score;

        // add alternating styling
        if (i%2 === 0) {
            scoreEl.className = "primary-score";
        }
        else {
            scoreEl.className = "secondary-score";
        }
        scoreList.appendChild(scoreEl);
    }

    var scoreButtons = document.createElement("div");
    scoreButtons.innerHTML = "<button type='button' name='go-back'>Go Back</button><button type='button' name='clear'>Clear High Scores</button>";
    scoreButtons.className = "score-buttons";

    scoreListPage.appendChild(scoreListPageHeading);
    scoreListPage.appendChild(scoreList);
    scoreListPage.appendChild(scoreButtons);

    mainEl.appendChild(scoreListPage);

    // adds functionality to buttons on high scores page
    document.querySelector("button[name='go-back']").addEventListener("click", function() {location.reload();});
    document.querySelector("button[name='clear']").addEventListener("click", clearScores);
};

// function to sort scores
var orderScores = function() {
    highScoreList.sort((a, b)=> {
        return b.score - a.score;
    })
    
    return highScoreList;
};

var clearScores = function() {
    localStorage.clear();
    highScoreList = []; 
    showScores();
};

// on page reload, scores are loaded from local storage
loadScores();

// add button functionality for home page
startButtonEl.addEventListener("click", askQuestion);
startButtonEl.addEventListener("click", startTimer);
viewHighScoreEl.addEventListener("click", showScores);

