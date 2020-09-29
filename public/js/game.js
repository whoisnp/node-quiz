const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");

const loader = document.getElementById("loader");
const game = document.getElementById("game");

let currentQuestion = {};
let acceptingAnswers = true;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

fetch(
  "https://webhooks.mongodb-stitch.com/api/client/v2.0/app/quizapp-mdsxx/service/http/incoming_webhook/webhook0"
)
  .then((res) => {
    return res.json();
  })
  .then((loadedQuestions) => {
    console.log(loadedQuestions);
    total = loadedQuestions.length;
    questions = loadedQuestions;
    startGame(total);
  })
  .catch((err) => {
    console.log(err);
  });

//constants
const CORRECT_BONUS = 10;

startGame = (total) => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  getNewQuestion(total);
  game.classList.remove("hidden");
  loader.classList.add("hidden");
};

getNewQuestion = () => {
  const MAX_QUESTIONS = total;
  console.log(total);

  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem("mostRecentScore", score);
    return window.location.assign("/end.html");
  }
  questionCounter++;
  // questionCounterText.innerText = questionCounter + "/" + MAX_QUESTIONS
  progressText.innerText = ` Question ${questionCounter}/${MAX_QUESTIONS}`;
  //update progress bar
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerText = currentQuestion.question;

  choices.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
  });
  availableQuestions.splice(questionIndex, 1);
  // console.log(availableQuestions)
  acceptingAnswers = true;
};

choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswers = selectedChoice.dataset["number"];

    const classToApply =
      selectedAnswers == currentQuestion.answer ? "correct" : "incorrect";

    if (classToApply === "correct") {
      incrementScore(CORRECT_BONUS);
    }

    // console.log(selectedAnswers == currentQuestion.answer)

    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 1000);
  });
});

incrementScore = (num) => {
  score += num;
  scoreText.innerText = score;
};
