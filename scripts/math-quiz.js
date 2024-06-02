// math-quiz.js
const questions = [
  {
    question: "Berapa hasil dari {0} - {1}?",
    answerOperands: [12, 7],
    answers: [
      { text: 3, correct: false },
      { text: 5, correct: true },
      { text: 7, correct: false },
      { text: 9, correct: false }
    ]
  },
  {
    question: "Berapa hasil dari {0} × {1}?",
    answerOperands: [4, 6],
    answers: [
      { text: 18, correct: false },
      { text: 22, correct: false },
      { text: 24, correct: true },
      { text: 28, correct: false }
    ]
  },
  {
    question: "Berapa hasil dari {0} ÷ {1}?",
    answerOperands: [15, 3],
    answers: [
      { text: 3, correct: false },
      { text: 5, correct: true },
      { text: 6, correct: false },
      { text: 7, correct: false }
    ]
  },
  {
    question: "Berapa hasil dari {0} - {1} × {2}?",
    answerOperands: [20, 3, 4],
    answers: [
      { text: 8, correct: true },
      { text: 10, correct: false },
      { text: 12, correct: false },
      { text: 14, correct: false }
    ]
  },
  {
    question: "Berapa hasil dari {0} + {1} - {2}?",
    answerOperands: [15, 7, 9],
    answers: [
      { text: 11, correct: false },
      { text: 13, correct: true },
      { text: 15, correct: false },
      { text: 17, correct: false }
    ]
  },
  {
    question: "Berapa hasil dari {0} + {1}?",
    answerOperands: [9, 7],
    answers: [
      { text: 16, correct: true },
      { text: 15, correct: false },
      { text: 14, correct: false },
      { text: 17, correct: false }
    ]
  },
  {
    question: "Berapa hasil dari {0} ÷ {1} × {2}?",
    answerOperands: [18, 3, 2],
    answers: [
      { text: 6, correct: false },
      { text: 8, correct: false },
      { text: 10, correct: false },
      { text: 12, correct: true }
    ]
  },
  {
    question: "Berapa hasil dari {0} x {1}?",
    answerOperands: [10, 2],
    answers: [
      { text: 15, correct: false },
      { text: 21, correct: false },
      { text: 23, correct: false },
      { text: 20, correct: true }
    ]
  }
];

let currentQuestionIndex = 0;
let score = 0;
let answeredQuestions = new Array(questions.length).fill(false);
let selectedAnswers = new Array(questions.length).fill(null);
let timerTimeout;
let timerDuration = 10000; // 10 detik
let timerInterval;
let isPaused = false;
let remainingTime = timerDuration;
let remainingTimes = new Array(questions.length).fill(timerDuration);

const questionContainer = document.getElementById("question-container");
const answerOptions = document.getElementById("answer-options");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const scoreModal = new bootstrap.Modal(document.getElementById("scoreModal"));

function generateQuestion() {
  const question = questions[currentQuestionIndex];
  const questionText = question.question.replace(/\{(\d+)\}/g, (_, number) => {
    const index = parseInt(number, 10);
    return question.answerOperands[index] ?? _;
  });

  return {
    question: questionText,
    answers: question.answers,
    operands: question.answerOperands
  };
}

function displayQuestionNumbers() {
  const container = document.getElementById("question-number");
  container.innerHTML = "";

  const isMobile = window.matchMedia("(max-width: 767px)").matches;
  const maxButtonsPerRow = isMobile ? 4 : 8;

  const totalRows = Math.ceil(questions.length / maxButtonsPerRow);
  for (let row = 0; row < totalRows; row++) {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("question-nav-row");

    const startIndex = row * maxButtonsPerRow;
    const endIndex = Math.min(startIndex + maxButtonsPerRow, questions.length);

    for (let i = startIndex; i < endIndex; i++) {
      const navBtn = document.createElement("div");
      navBtn.textContent = i + 1;
      navBtn.classList.add("question-nav");
      if (answeredQuestions[i]) {
        navBtn.classList.add("answered");
      }
      if (i === currentQuestionIndex) {
        navBtn.classList.add("current");
      }
      navBtn.addEventListener("click", () => goToQuestion(i));
      rowDiv.appendChild(navBtn);
    }

    container.appendChild(rowDiv);
  }
}

function goToQuestion(index) {
  if (index !== currentQuestionIndex) {
    stopTimer();
    currentQuestionIndex = index;
    displayQuestion();
    displayQuestionNumbers();
  }
}

function displayQuestion() {
  const currentQuestion = generateQuestion();
  questionContainer.innerHTML = `<p class="question-text">${currentQuestion.question}</p>`;

  answerOptions.innerHTML = "";
  currentQuestion.answers.forEach((answer, index) => {
    const answerBtn = document.createElement("button");
    answerBtn.textContent = answer.text;
    answerBtn.classList.add("btn", "btn-lg", "answer-btn");
    answerBtn.dataset.correct = answer.correct;
    answerBtn.dataset.index = index;
    answerBtn.addEventListener("click", selectAnswer);
    answerOptions.appendChild(answerBtn);

    if (selectedAnswers[currentQuestionIndex] !== null || answeredQuestions[currentQuestionIndex]) {
      const selectedIndex = selectedAnswers[currentQuestionIndex];
      if (index === selectedIndex || answer.correct) {
        answerBtn.classList.add(answer.correct ? "correct" : "incorrect");
      }
      answerBtn.disabled = true;
    }
  });

  displayQuestionNumbers();
  updateButtons();

  if (answeredQuestions[currentQuestionIndex]) {
    stopTimer();
    const timerBar = document.querySelector('.timer-bar');
    const progress = (remainingTimes[currentQuestionIndex] / timerDuration) * 100;
    timerBar.style.width = `${progress}%`;
  } else {
    resetTimer();
    startTimer();
  }

  questionContainer.classList.add("fade-in");
  setTimeout(() => questionContainer.classList.remove("fade-in"), 500);
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
  displayQuestionNumbers();
  stopTimer(); // Hanya menghentikan timer tanpa mereset ke ukuran awal
}

function updateButtons() {
  prevBtn.disabled = currentQuestionIndex === 0;
  nextBtn.disabled = currentQuestionIndex === questions.length - 1 && !answeredQuestions[currentQuestionIndex] && remainingTime > 0;

  if (currentQuestionIndex === questions.length - 1) {
    if (answeredQuestions[currentQuestionIndex] || remainingTime <= 0) {
      nextBtn.innerHTML = 'Finish <i class="bi bi-trophy-fill ms-2"></i>';
      nextBtn.classList.add("finish-btn");
      nextBtn.disabled = false;
    } else {
      nextBtn.innerHTML = 'Next <i class="bi bi-arrow-right ms-2"></i>';
      nextBtn.classList.remove("finish-btn");
    }
  } else {
    nextBtn.innerHTML = 'Next <i class="bi bi-arrow-right ms-2"></i>';
    nextBtn.classList.remove("finish-btn");
  }

  // Mengatur kelas dan atribut disabled untuk konsistensi visual
  [prevBtn, nextBtn].forEach(btn => {
    if (btn.disabled) {
      btn.classList.add("disabled");
    } else {
      btn.classList.remove("disabled");
    }
  });
}

function showNextQuestion() {
  // Animasi fade-out sebelum pindah ke soal berikutnya
  questionContainer.classList.add("fade-out");
  setTimeout(() => {
    currentQuestionIndex++;
    displayQuestion();
    displayQuestionNumbers();
    questionContainer.classList.remove("fade-out");
  }, 500);
}

function showPreviousQuestion() {
  stopTimer();
  // Animasi fade-out sebelum pindah ke soal sebelumnya
  questionContainer.classList.add("fade-out");
  setTimeout(() => {
    currentQuestionIndex--;
    displayQuestion();
    displayQuestionNumbers();
    questionContainer.classList.remove("fade-out");
  }, 500);
}

function showFinalScore() {
  const finalScoreElement = document.getElementById("finalScore");
  const finalMessageElement = document.getElementById("finalMessage");
  const trophyImage = document.querySelector(".trophy-image");
 
  finalScoreElement.textContent = `${score} / ${questions.length}`;
 
  let message = "";
  const percentage = (score / questions.length) * 100;
  if (percentage === 100) {
    message = "Sempurna! Kamu jenius matematika! 🌟";
    trophyImage.src = "/imk-v1/assets/gold-trophy.svg";
  } else if (percentage >= 80) {
    message = "Luar biasa! Terus berlatih ya! 😄";
    trophyImage.src = "/imk-v1/assets/gold-trophy.svg";
  } else if (percentage >= 60) {
    message = "Bagus! Kamu sudah hampir menguasainya! 👍";
    trophyImage.src = "/imk-v1/assets/gold-trophy.svg";
  } else {
    message = "Jangan menyerah, terus belajar! 💪";
    trophyImage.src = "/imk-v1/assets/gold-trophy.svg";
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
  scoreModal.hide();
 
  const quizCard = document.querySelector('.quiz-card');
  quizCard.classList.add('restart-animation');
  setTimeout(() => {
    displayQuestion();
    quizCard.classList.remove('restart-animation');
  }, 500);
}  

function playSound(type) {
  const audio = new Audio(`/imk-v1/assets/sound/${type}.wav`);
  audio.play().catch(error => {
    console.error(`Error playing sound: ${type}`, error);
  });
}

function startTimer() {
  const timerBar = document.querySelector('.timer-bar');
  timerBar.style.width = '100%';
  timerBar.style.left = '0';
  
  if (!isPaused) {
    remainingTime = remainingTimes[currentQuestionIndex];
  }

  const startTime = Date.now();
  timerInterval = setInterval(() => {
    if (!isPaused) {
      const elapsedTime = Date.now() - startTime;
      const currentTime = remainingTime - elapsedTime;

      if (currentTime <= 0) {
        stopTimer();
        answeredQuestions[currentQuestionIndex] = true;
        updateButtons();
        displayQuestionNumbers();
        if (currentQuestionIndex < questions.length - 1) {
          showNextQuestion();
        } else {
          showFinalScore();
        }
      } else {
        const progress = (currentTime / timerDuration) * 100;
        timerBar.style.width = `${progress}%`;
        remainingTimes[currentQuestionIndex] = currentTime;
      }
    }
  }, 100);
}

function stopTimer() {
  clearInterval(timerInterval);
  isPaused = true;
}

function resetTimer() {
  stopTimer();
  isPaused = false;
  const timerBar = document.querySelector('.timer-bar');
  timerBar.style.width = '100%';
}


function timerExpired() {
  if (currentQuestionIndex < questions.length - 1) {
    showNextQuestion();
  } else {
    showFinalScore();
  }
}

prevBtn.addEventListener("click", showPreviousQuestion);
nextBtn.addEventListener("click", () => {
  if (currentQuestionIndex === questions.length - 1 && answeredQuestions[currentQuestionIndex]) {
    showFinalScore();
  } else {
    showNextQuestion();
  }
});

document.querySelector('.modal-footer .btn-primary').addEventListener('click', restartQuiz);

document.body.insertAdjacentHTML('afterbegin', '<div class="loading"></div>');
setTimeout(() => {
  document.querySelector('.loading').remove();
  displayQuestion();
}, 1500);

document.addEventListener("DOMContentLoaded", () => {
  prevBtn.innerHTML = '<i class="bi bi-arrow-left me-2"></i> Prev';
  nextBtn.innerHTML = 'Next <i class="bi bi-arrow-right ms-2"></i>';

  displayQuestion();
  displayQuestionNumbers();
});