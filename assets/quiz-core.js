const SYSTEMS = [
  "All Systems",
  "EMS Operations",
  "Airway & Ventilation",
  "Cardiology",
  "Respiratory",
  "Pharmacology",
  "Trauma",
  "Neurology",
  "Medical",
  "Obstetrics",
  "Pediatrics",
  "Toxicology",
  "Critical Care Transport"
];

function classifyQuestion(q) {
  const text = `${q.bank} ${q.question} ${q.options.join(" ")} ${q.rationale}`.toLowerCase();
  const rules = [
    ["Pharmacology", ["medication", "drug", "dose", "epinephrine", "adenosine", "atropine", "aspirin", "nitroglycerin", "naloxone", "dextrose", "albuterol", "magnesium", "fentanyl", "morphine", "benzodiazepine", "dopamine", "calcium", "sodium bicarbonate"]],
    ["Airway & Ventilation", ["airway", "ventilation", "bvm", "opa", "npa", "intubation", "capnography", "etco2", "oxygen", "hypoxia", "tracheostomy", "respiratory failure"]],
    ["Cardiology", ["chest pain", "stemi", "brady", "tachy", "cardiac", "ecg", "ekg", "dysrhythmia", "cardioversion", "defibrillation", "pea", "asystole", "shockable"]],
    ["Respiratory", ["asthma", "copd", "ards", "wheezing", "crackles", "bronchospasm", "pulmonary edema", "hypercapnic"]],
    ["Trauma", ["trauma", "bleeding", "hemorrhage", "amputation", "spinal", "fracture", "tbi", "burn", "tourniquet"]],
    ["Neurology", ["stroke", "seizure", "intracranial", "brain", "neurologic", "status epilepticus"]],
    ["Obstetrics", ["pregnant", "pregnancy", "eclampsia", "preeclampsia", "postpartum", "placental", "newborn", "neonatal"]],
    ["Pediatrics", ["child", "toddler", "pediatric", "infant", "drowning", "foreign body"]],
    ["Toxicology", ["overdose", "poison", "toxin", "carbon monoxide", "cyanide", "hazmat", "opioid", "organophosphate"]],
    ["Critical Care Transport", ["transport", "ventilator", "interfacility", "vasopressor", "infusion", "cct", "critical care"]],
    ["Medical", ["sepsis", "diabetic", "dka", "hypoglycemia", "shock", "infection", "refusal"]],
    ["EMS Operations", ["scene", "documentation", "communication", "consent", "refusal", "confidentiality", "medical direction", "protocol", "public health", "wellness", "p p e", "ppe"]]
  ];
  const match = rules.find(([, terms]) => terms.some(term => text.includes(term)));
  return match ? match[0] : "Medical";
}

function getQuestions() {
  return (window.MCQ_QUESTIONS || []).map(q => ({ ...q, system: q.system || classifyQuestion(q) }));
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
