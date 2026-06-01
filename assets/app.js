const state = {
  all: [],
  current: [],
  index: 0,
  selected: null,
  answered: new Map()
};

const els = {
  category: document.querySelector("#categorySelect"),
  mode: document.querySelector("#modeSelect"),
  search: document.querySelector("#searchInput"),
  shuffle: document.querySelector("#shuffleBtn"),
  reset: document.querySelector("#resetBtn"),
  prev: document.querySelector("#prevBtn"),
  next: document.querySelector("#nextBtn"),
  submit: document.querySelector("#submitBtn"),
  showAnswer: document.querySelector("#showAnswerBtn"),
  score: document.querySelector("#scoreText"),
  total: document.querySelector("#totalCount"),
  answered: document.querySelector("#answeredCount"),
  correct: document.querySelector("#correctCount"),
  position: document.querySelector("#positionText"),
  bank: document.querySelector("#bankLabel"),
  number: document.querySelector("#questionNumber"),
  question: document.querySelector("#questionText"),
  options: document.querySelector("#options"),
  feedback: document.querySelector("#feedback")
};

function init() {
  state.all = window.MCQ_QUESTIONS || [];
  const banks = ["All banks", ...new Set(state.all.map(q => q.bank))];
  els.category.innerHTML = banks.map(bank => `<option value="${escapeAttr(bank)}">${escapeHtml(bank)}</option>`).join("");
  bindEvents();
  applyFilters();
}

function bindEvents() {
  els.category.addEventListener("change", applyFilters);
  els.mode.addEventListener("change", render);
  els.search.addEventListener("input", applyFilters);
  els.shuffle.addEventListener("click", () => {
    state.current = shuffle([...state.current]);
    state.index = 0;
    state.selected = null;
    render();
  });
  els.reset.addEventListener("click", () => {
    state.answered.clear();
    state.index = 0;
    state.selected = null;
    render();
  });
  els.prev.addEventListener("click", () => move(-1));
  els.next.addEventListener("click", () => move(1));
  els.submit.addEventListener("click", submitAnswer);
  els.showAnswer.addEventListener("click", showAnswer);
}

function applyFilters() {
  const bank = els.category.value;
  const query = els.search.value.trim().toLowerCase();
  state.current = state.all.filter(q => {
    const matchesBank = bank === "All banks" || q.bank === bank;
    const haystack = `${q.question} ${q.options.join(" ")} ${q.rationale}`.toLowerCase();
    return matchesBank && (!query || haystack.includes(query));
  });
  state.index = 0;
  state.selected = null;
  render();
}

function render() {
  updateStats();
  const q = state.current[state.index];
  if (!q) {
    els.position.textContent = "No questions found";
    els.bank.textContent = "Try another search";
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
  state.selected = record?.selected || null;
  els.position.textContent = `Question ${state.index + 1} of ${state.current.length}`;
  els.bank.textContent = q.bank;
  els.number.textContent = `#${q.number}`;
  els.question.textContent = q.question;
  els.options.innerHTML = q.options.map((text, idx) => {
    const letter = String.fromCharCode(65 + idx);
    const classes = ["option"];
    if (state.selected === letter) classes.push("selected");
    if (record?.revealed && letter === q.answer) classes.push("correct");
    if (record?.revealed && record.selected === letter && letter !== q.answer) classes.push("incorrect");
    return `<button class="${classes.join(" ")}" type="button" data-letter="${letter}">
      <span class="letter">${letter}</span>
      <span>${escapeHtml(text)}</span>
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
    els.feedback.textContent = "";
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
  render();
}

function submitAnswer() {
  const q = state.current[state.index];
  if (!q || !state.selected) return;
  const correct = state.selected === q.answer;
  state.answered.set(q.id, { selected: state.selected, correct, revealed: true });
  render();
}

function showAnswer() {
  const q = state.current[state.index];
  if (!q) return;
  state.answered.set(q.id, {
    selected: state.selected,
    correct: state.selected === q.answer,
    revealed: true
  });
  render();
}

function move(delta) {
  state.index = Math.min(Math.max(state.index + delta, 0), state.current.length - 1);
  state.selected = null;
  render();
}

function updateStats() {
  const visibleIds = new Set(state.current.map(q => q.id));
  const answered = [...state.answered.entries()].filter(([id]) => visibleIds.has(id));
  const correct = answered.filter(([, record]) => record.correct).length;
  els.total.textContent = state.current.length;
  els.answered.textContent = answered.length;
  els.correct.textContent = correct;
  els.score.textContent = `${correct} / ${answered.length}`;
}

function shuffle(items) {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}

init();
