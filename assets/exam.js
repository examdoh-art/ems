const examState = {
  questions: [],
  index: 0,
  answers: new Map(),
  finished: false
};

const examEls = {
  start: document.querySelector("#examStart"),
  quiz: document.querySelector("#examQuiz"),
  result: document.querySelector("#examResult"),
  startBtn: document.querySelector("#startExamBtn"),
  restartBtn: document.querySelector("#restartExamBtn"),
  finishBtn: document.querySelector("#finishExamBtn"),
  prev: document.querySelector("#prevBtn"),
  next: document.querySelector("#nextBtn"),
  position: document.querySelector("#positionText"),
  answered: document.querySelector("#examAnswered"),
  bank: document.querySelector("#bankLabel"),
  number: document.querySelector("#questionNumber"),
  question: document.querySelector("#questionText"),
  options: document.querySelector("#options"),
  score: document.querySelector("#resultScore"),
  summary: document.querySelector("#resultSummary"),
  review: document.querySelector("#reviewList")
};

function startExam() {
  examState.questions = shuffle(getQuestions()).slice(0, 100);
  examState.index = 0;
  examState.answers.clear();
  examState.finished = false;
  examEls.start.hidden = true;
  examEls.result.hidden = true;
  examEls.quiz.hidden = false;
  renderExamQuestion();
}

function renderExamQuestion() {
  const q = examState.questions[examState.index];
  const selected = examState.answers.get(q.id);
  examEls.position.textContent = `Question ${examState.index + 1} of ${examState.questions.length}`;
  examEls.answered.textContent = `${examState.answers.size} answered`;
  examEls.bank.textContent = `${q.system} • ${q.bank}`;
  examEls.number.textContent = `#${q.number}`;
  examEls.question.textContent = q.question;
  examEls.options.innerHTML = q.options.map((text, idx) => {
    const letter = String.fromCharCode(65 + idx);
    const classes = ["option"];
    if (selected === letter) classes.push("selected");
    return `<button class="${classes.join(" ")}" type="button" data-letter="${letter}">
      <span class="letter">${letter}</span><span>${escapeHtml(text)}</span>
    </button>`;
  }).join("");
  document.querySelectorAll(".option").forEach(button => {
    button.addEventListener("click", () => {
      examState.answers.set(q.id, button.dataset.letter);
      renderExamQuestion();
    });
  });
  examEls.prev.disabled = examState.index === 0;
  examEls.next.disabled = examState.index >= examState.questions.length - 1;
}

function finishExam() {
  examState.finished = true;
  const correct = examState.questions.filter(q => examState.answers.get(q.id) === q.answer).length;
  const percent = Math.round((correct / examState.questions.length) * 100);
  examEls.quiz.hidden = true;
  examEls.result.hidden = false;
  examEls.score.textContent = `${correct} / ${examState.questions.length} (${percent}%)`;
  examEls.summary.textContent = `${examState.answers.size} questions answered. Review missed and correct answers below.`;
  examEls.review.innerHTML = examState.questions.map((q, idx) => {
    const selected = examState.answers.get(q.id) || "Not answered";
    const isCorrect = selected === q.answer;
    return `<article class="review-item ${isCorrect ? "is-correct" : "is-wrong"}">
      <h3>${idx + 1}. ${escapeHtml(q.question)}</h3>
      <p><strong>Your answer:</strong> ${escapeHtml(selected)} &nbsp; <strong>Correct:</strong> ${q.answer}</p>
      <p>${escapeHtml(q.rationale)}</p>
    </article>`;
  }).join("");
}

examEls.startBtn.addEventListener("click", startExam);
examEls.restartBtn.addEventListener("click", startExam);
examEls.finishBtn.addEventListener("click", finishExam);
examEls.prev.addEventListener("click", () => {
  examState.index = Math.max(0, examState.index - 1);
  renderExamQuestion();
});
examEls.next.addEventListener("click", () => {
  examState.index = Math.min(examState.questions.length - 1, examState.index + 1);
  renderExamQuestion();
});
