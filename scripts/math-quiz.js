// math-quiz.js
const questions = [
  {
    question: "Berapa hasil dari %d + %d?",
    answerOperands: [5, 3],
    answers: [
      { text: 8, correct: true },
      { text: 6, correct: false },
      { text: 10, correct: false },
      { text: 7, correct: false }
    ]
  },
  {
    question: "Berapa hasil dari %d - %d?",
    answerOperands: [12, 7],
    answers: [
      { text: 3, correct: false },
      { text: 5, correct: true },
      { text: 7, correct: false },
      { text: 9, correct: false }
    ]
  },
  {
    question: "Berapa hasil dari %d x %d?",
    answerOperands: [4, 6],
    answers: [
      { text: 18, correct: false },
      { text: 22, correct: false },
      { text: 24, correct: true },
      { text: 28, correct: false }
    ]
  },
  {
    question: "Berapa hasil dari %d ÷ %d?",
    answerOperands: [15, 3],
    answers: [
      { text: 3, correct: false },
      { text: 5, correct: true },
      { text: 6, correct: false },
      { text: 7, correct: false }
    ]
  },
  {
    question: "Berapa hasil dari %d + %d + %d?",
    answerOperands: [2, 3, 4],
    answers: [
      { text: 7, correct: false },
      { text: 8, correct: false },
      { text: 9, correct: true },
      { text: 10, correct: false }
    ]
  }
];

let currentQuestionIndex = 0;
let score = 0;
let answeredQuestions = new Array(questions.length).fill(false);
let selectedAnswers = new Array(questions.length).fill(null);

const questionContainer = document.getElementById("question-container");
const answerOptions = document.getElementById("answer-options");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");
const characterSpeech = document.getElementById("characterSpeech");
const scoreModal = new bootstrap.Modal(document.getElementById("scoreModal"));

const characterMessages = {
  correct: ["Hebat!", "Pintar sekali!", "Terus begitu!"],
  incorrect: ["Jangan menyerah!", "Coba lagi ya!", "Kamu bisa!"],
  encouragement: ["Ayo semangat!", "Kamu hampir selesai!"]
};

// Fungsi-fungsi
function generateQuestion() {
  const question = questions[currentQuestionIndex];
  const operands = [...question.answerOperands];
  const formattedQuestion = question.question.replace(/%d/g, () => operands.shift());

  return {
    question: formattedQuestion,
    answers: shuffleArray([...question.answers])
  };
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function displayQuestion() {
  const currentQuestion = generateQuestion();
  questionContainer.innerHTML = `<p class="question-text">${currentQuestion.question}</p>`;

  answerOptions.innerHTML = "";
  currentQuestion.answers.forEach((answer, index) => {
    const answerBtn = document.createElement("button");
    answerBtn.textContent = answer.text;
    answerBtn.classList.add("btn", "btn-lg");
    answerBtn.dataset.correct = answer.correct;
    answerBtn.dataset.index = index;
    answerBtn.addEventListener("click", selectAnswer);
    answerOptions.appendChild(answerBtn);

    if (selectedAnswers[currentQuestionIndex] !== null) {
      const selectedIndex = selectedAnswers[currentQuestionIndex];
      if (index === selectedIndex) {
        answerBtn.classList.add(answer.correct ? "correct" : "incorrect");
      }
      answerBtn.disabled = true;
    }
  });

  updateButtons();
  updateProgressBar();
  showCharacterSpeech();
}

function selectAnswer(event) {
  const selectedBtn = event.target;
  const isCorrect = selectedBtn.dataset.correct === "true";
  const selectedIndex = parseInt(selectedBtn.dataset.index, 10);

  Array.from(answerOptions.children).forEach(btn => {
    btn.classList.remove("correct", "incorrect");
    btn.disabled = true;
    if (btn.dataset.correct === "true") {
      btn.classList.add("correct");
    }
  });

  selectedBtn.classList.add(isCorrect ? "correct" : "incorrect");

  if (isCorrect) {
    score++;
    playSound("correct");
  } else {
    playSound("incorrect");
  }

  answeredQuestions[currentQuestionIndex] = true;
  selectedAnswers[currentQuestionIndex] = selectedIndex;
  updateButtons();
  updateProgressBar();
  showCharacterSpeech(isCorrect);
}

function showCharacterSpeech(isCorrect = null) {
  let messages = characterMessages.encouragement;
  if (isCorrect !== null) {
    messages = isCorrect ? characterMessages.correct : characterMessages.incorrect;
  }
  const message = messages[Math.floor(Math.random() * messages.length)];
  characterSpeech.textContent = message;
  characterSpeech.classList.add("show");
  setTimeout(() => characterSpeech.classList.remove("show"), 3000);
}

function updateProgressBar() {
  const answeredCount = answeredQuestions.filter(Boolean).length;
  const progress = (answeredCount / questions.length) * 100;
  progressBar.style.width = `${progress}%`;
  progressBar.setAttribute("aria-valuenow", progress);

  const remainingQuestions = questions.length - answeredCount;
  const encouragement = remainingQuestions <= 2 ? "Hampir selesai!" : "";
  progressText.textContent = `${answeredCount}/${questions.length} ${encouragement}`;

  if (progress > 50) {
    progressBar.style.background = 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)';
  }
}

function updateButtons() {
  prevBtn.disabled = currentQuestionIndex === 0;
  nextBtn.disabled = currentQuestionIndex === questions.length - 1 && !answeredQuestions[currentQuestionIndex];
  
  nextBtn.textContent = currentQuestionIndex === questions.length - 1 ? "Selesai" : "Selanjutnya";
  nextBtn.innerHTML += ' <i class="bi bi-arrow-right ms-2"></i>';
}

function showNextQuestion() {
  characterSpeech.classList.remove("show");
  currentQuestionIndex++;
  displayQuestion();
}

function showPreviousQuestion() {
  characterSpeech.classList.remove("show");
  currentQuestionIndex--;
  displayQuestion();
}

function showFinalScore() {
  const finalScoreElement = document.getElementById("finalScore");
  const finalMessageElement = document.getElementById("finalMessage");

  finalScoreElement.textContent = `${score} / ${questions.length}`;

  let message = "";
  const percentage = (score / questions.length) * 100;
  if (percentage === 100) {
    message = "Sempurna! Kamu jenius matematika! 🌟";
  } else if (percentage >= 80) {
    message = "Luar biasa! Terus berlatih ya! 😄";
  } else if (percentage >= 60) {
    message = "Bagus! Kamu sudah hampir menguasainya! 👍";
  } else {
    message = "Jangan menyerah, terus belajar! 💪";
  }

  finalMessageElement.textContent = message;
  playSound("finish");
  scoreModal.show();
}

function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  answeredQuestions.fill(false);
  selectedAnswers.fill(null);
  displayQuestion();
  scoreModal.hide();
}

function playSound(type) {
  const audio = new Audio(`/assets/sounds/${type}.mp3`);
  audio.play().catch(error => console.log("Error playing sound:", error));
}

// Event listeners
prevBtn.addEventListener("click", showPreviousQuestion);
nextBtn.addEventListener("click", () => {
  if (currentQuestionIndex === questions.length - 1 && answeredQuestions[currentQuestionIndex]) {
    showFinalScore();
  } else {
    showNextQuestion();
  }
});

document.querySelector('.modal-footer .btn-primary').addEventListener('click', restartQuiz);

// Menampilkan soal pertama dan animasi loading
document.body.insertAdjacentHTML('afterbegin', '<div class="loading"></div>');
setTimeout(() => {
  document.querySelector('.loading').remove();
  displayQuestion();
}, 1500);

// Inisialisasi halaman
displayQuestion();