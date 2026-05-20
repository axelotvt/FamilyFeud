// script.js

const csvInput = document.getElementById("csvInput");
const loadCsvBtn = document.getElementById("loadCsvBtn");

const questionText = document.getElementById("questionText");
const answersContainer = document.getElementById("answersContainer");
const tabsContainer = document.getElementById("tabsContainer");

const strikeOverlay = document.getElementById("strikeOverlay");

let questions = [];
let currentQuestionIndex = 0;

loadCsvBtn.addEventListener("click", () => {
  csvInput.click();
});

csvInput.addEventListener("change", (event) => {
  const file = event.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    parseCSV(e.target.result);
    renderTabs();
    loadQuestion(0);
  };

  reader.readAsText(file);
});

function parseCSV(csvText) {
  questions = [];

  const lines = csvText.split("\n").filter(line => line.trim());

  let currentQuestion = null;

  lines.forEach(line => {
    const parts = line.split(",");

    const type = parts[0]?.trim();

    if (type === "QUESTION") {
      if (currentQuestion) {
        questions.push(currentQuestion);
      }

      currentQuestion = {
        question: parts[1]?.trim(),
        answers: []
      };
    }

    if (type === "ANSWER") {
      currentQuestion.answers.push({
        text: parts[1]?.trim(),
        points: parts[2]?.trim(),
        revealed: false
      });
    }
  });

  if (currentQuestion) {
    questions.push(currentQuestion);
  }
}

function loadQuestion(index) {
  currentQuestionIndex = index;

  const q = questions[index];

  questionText.textContent = q.question;

  answersContainer.innerHTML = "";

  q.answers.forEach((answer, answerIndex) => {

    const card = document.createElement("div");
    card.className = "answer-card answer-hidden";

    card.innerHTML = `
      <div class="answer-content">
        <span>${answerIndex + 1}</span>
        <span>???</span>
      </div>
    `;

    card.addEventListener("click", () => {
      answer.revealed = !answer.revealed;
      updateAnswerCard(card, answer, answerIndex);
    });

    updateAnswerCard(card, answer, answerIndex);

    answersContainer.appendChild(card);
  });

  updateTabs();
}

function updateAnswerCard(card, answer, index) {

  if (answer.revealed) {

    card.classList.remove("answer-hidden");
    card.classList.add("answer-revealed");

    card.innerHTML = `
      <div class="answer-content">
        <span>${index + 1}. ${answer.text}</span>
        <span class="points">${answer.points}</span>
      </div>
    `;

  } else {

    card.classList.remove("answer-revealed");
    card.classList.add("answer-hidden");

    card.innerHTML = `
      <div class="answer-content">
        <span>${index + 1}</span>
        <span>???</span>
      </div>
    `;
  }
}

function renderTabs() {

  tabsContainer.innerHTML = "";

  questions.forEach((q, index) => {

    const btn = document.createElement("button");

    btn.className = "tab";
    btn.textContent = `Q${index + 1}`;

    btn.addEventListener("click", () => {
      loadQuestion(index);
    });

    tabsContainer.appendChild(btn);
  });

  updateTabs();
}

function updateTabs() {

  const tabs = document.querySelectorAll(".tab");

  tabs.forEach((tab, index) => {

    tab.classList.toggle(
      "active",
      index === currentQuestionIndex
    );

  });
}

document.querySelectorAll(".strike-btn").forEach(btn => {

  btn.addEventListener("click", () => {

    const strikeNumber = btn.dataset.strike;

    strikeOverlay.textContent = "X".repeat(strikeNumber);

    strikeOverlay.classList.add("show");
  
    // Restart sound if already playing
    strikeSound.currentTime = 0;

    strikeSound.play();
    
    setTimeout(() => {
      strikeOverlay.classList.remove("show");
    }, 1200);

  });

});

document.getElementById("clearStrikes")
  .addEventListener("click", () => {
    strikeOverlay.classList.remove("show");
  });
