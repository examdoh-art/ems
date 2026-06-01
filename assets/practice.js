const state = {
  all: getQuestions(),
  current: [],
  index: 0,
  selected: null,
  answered: new Map()
};

const els = {
  system: document.querySelector("#systemSelect"),
  bank: document.querySelector("#bankSelect"),
  search: document.querySelector("#searchInput"),
  shuffle: document.querySelector("#shuffleBtn"),
  reset: document.querySelector("#resetBtn"),
  prev: document.querySelector("#prevBtn"),
  next: document.querySelector("#nextBtn"),
  submit: document.querySelector("#submitBtn"),
  showAnswer: document.querySelector("#showAnswerBtn"),
  total: document.querySelector("#totalCount"),
  answered: document.querySelector("#answeredCount"),
  correct: document.querySelector("#correctCount"),
  position: document.querySelector("#positionText"),
  bankLabel: document.querySelector("#bankLabel"),
  number: document.querySelector("#questionNumber"),
  question: document.querySelector("#questionText"),
  options: document.querySelector("#options"),
  feedback: document.querySelector("#feedback")
};

function initPractice() {
  const banks = ["All Banks", ...new Set(state.all.map(q => q.bank))];
  els.system.innerHTML = SYSTEMS.map(system => `<option>${escapeHtml(system)}</option>`).join("");
  els.bank.innerHTML = banks.map(bank => `<option>${escapeHtml(bank)}</option>`).join("");
  els.system.addEventListener("change", applyFilters);
  els.bank.addEventListener("change", applyFilters);
  els.search.addEventListener("input", applyFilters);
  els.shuffle.addEventListener("click", () => {
    state.current = shuffle([...state.current]);
    state.index = 0;
    state.selected = null;
    renderPractice();
  });
  els.reset.addEventListener("click", () => {
    state.answered.clear();
    state.selected = null;
    state.index = 0;
    renderPractice();
  });
  els.prev.addEventListener("click", () => move(-1));
  els.next.addEventListener("click", () => move(1));
  els.submit.addEventListener("click", submitAnswer);
  els.showAnswer.addEventListener("click", revealAnswer);
  applyFilters();
}

function applyFilters() {
  const system = els.system.value;
  const bank = els.bank.value;
  const query = els.search.value.trim().toLowerCase();
  state.current = state.all.filter(q => {
    const haystack = `${q.question} ${q.options.join(" ")} ${q.rationale}`.toLowerCase();
    return (system === "All Systems" || q.system === system)
      && (bank === "All Banks" || q.bank === bank)
      && (!query || haystack.includes(query));
  });
  state.index = 0;
  state.selected = null;
  renderPractice();
}

function renderPractice() {
  updateStats();
  const q = state.current[state.index];
  if (!q) {
    els.position.textContent = "No questions found";
    els.bankLabel.textContent = "Change filters";
    els.number.textContent = "";
    els.question.textContent = "No matching questions.";
    els.options.innerHTML = "";
    els.feedback.hidden = true;
    els.submit.disabled = true;
    els.showAnswer.disabled = true;
    els.prev.disabled = true;
    els.next.disabled = true;
    return;
  }

  const record = state.answered.get(q.id);
  state.selected = record?.selected || state.selected;
  els.position.textContent = `Question ${state.index + 1} of ${state.current.length}`;
  els.bankLabel.textContent = `${q.system} • ${q.bank}`;
  els.number.textContent = `#${q.number}`;
  els.question.textContent = q.question;
  els.options.innerHTML = q.options.map((text, idx) => {
    const letter = String.fromCharCode(65 + idx);
    const classes = ["option"];
    if (state.selected === letter) classes.push("selected");
    if (record?.revealed && letter === q.answer) classes.push("correct");
    if (record?.revealed && record.selected === letter && letter !== q.answer) classes.push("incorrect");
    return `<button class="${classes.join(" ")}" type="button" data-letter="${letter}">
      <span class="letter">${letter}</span><span>${escapeHtml(text)}</span>
    </button>`;
  }).join("");
  document.querySelectorAll(".option").forEach(button => {
    button.addEventListener("click", () => selectOption(button.dataset.letter));
  });
  if (record?.revealed) {
    els.feedback.hidden = false;
    els.feedback.innerHTML = `<strong>${record.correct ? "Correct" : "Correct answer: " + q.answer}</strong>${escapeHtml(q.rationale)}`;
  } else {
    els.feedback.hidden = true;
  }
  els.submit.disabled = !state.selected || Boolean(record?.revealed);
  els.showAnswer.disabled = Boolean(record?.revealed);
  els.prev.disabled = state.index === 0;
  els.next.disabled = state.index >= state.current.length - 1;
}

function selectOption(letter) {
  const q = state.current[state.index];
  if (!q || state.answered.get(q.id)?.revealed) return;
  state.selected = letter;
  renderPractice();
}

function submitAnswer() {
  const q = state.current[state.index];
  if (!q || !state.selected) return;
  state.answered.set(q.id, { selected: state.selected, correct: state.selected === q.answer, revealed: true });
  renderPractice();
}

function revealAnswer() {
  const q = state.current[state.index];
  if (!q) return;
  state.answered.set(q.id, { selected: state.selected, correct: state.selected === q.answer, revealed: true });
  renderPractice();
}

function move(delta) {
  state.index = Math.min(Math.max(state.index + delta, 0), state.current.length - 1);
  state.selected = state.answered.get(state.current[state.index]?.id)?.selected || null;
  renderPractice();
}

function updateStats() {
  const ids = new Set(state.current.map(q => q.id));
  const answered = [...state.answered.entries()].filter(([id]) => ids.has(id));
  els.total.textContent = state.current.length;
  els.answered.textContent = answered.length;
  els.correct.textContent = answered.filter(([, r]) => r.correct).length;
}

initPractice();
