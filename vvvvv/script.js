// Типы неравенств и уровни сложности
const TASK_TYPES = {
  BASIC: "Простые неравенства (a^x > b)",
  REPLACEMENT: "Метод замены (a^(2x) + b*a^x + c > 0)",
  ODZ: "Неравенства с ОДЗ (√(a^x) > b)",
  COMPLEX_BASE: "Сложные основания ((x^2)^x > 1)"
};

const DIFFICULTY = {
  EASY: { minBase: 2, maxBase: 5, minExp: -3, maxExp: 3 },
  MEDIUM: { minBase: 2, maxBase: 10, minExp: -5, maxExp: 5 },
  HARD: { minBase: 0.1, maxBase: 15, minExp: -10, maxExp: 10, decimals: 1 }
};

let currentTaskType = TASK_TYPES.BASIC;
let currentDifficulty = DIFFICULTY.EASY;
let correctAnswer = "";
let currentSolutionSteps = [];

// Генерация задачи
function generateInequality() {
  const { minBase, maxBase, minExp, maxExp, decimals } = currentDifficulty;
  const base = parseFloat((Math.random() * (maxBase - minBase) + minBase).toFixed(decimals || 0));
  const exponent = Math.floor(Math.random() * (maxExp - minExp + 1)) + minExp;
  const sign = Math.random() > 0.5 ? ">" : "<";
  const rightSide = parseFloat(Math.pow(base, exponent).toFixed(2));

  // Выбор типа задачи
  switch (currentTaskType) {
    case TASK_TYPES.REPLACEMENT:
      const replacementBase = Math.floor(Math.random() * 3) + 2;
      return {
        task: `${replacementBase}^(2x) + ${replacementBase}^x - 6 > 0`,
        answer: "x > 1",
        steps: [
          "1. Замена: t = " + replacementBase + "^x → t² + t - 6 > 0",
          "2. Решаем квадратное неравенство: t < -3 или t > 2",
          "3. Обратная замена: " + replacementBase + "^x > 2 → x > log" + replacementBase + "(2)"
        ]
      };
    case TASK_TYPES.ODZ:
      return {
        task: `√(${base}^x) > ${Math.abs(rightSide)}`,
        answer: `x > ${2 * exponent}`,
        steps: [
          "1. ОДЗ: " + base + "^x ≥ 0 (выполнено всегда)",
          "2. Возводим в квадрат: " + base + "^x > " + Math.pow(rightSide, 2),
          "3. Решаем: x > " + (2 * exponent)
        ]
      };
    default:
      return {
        task: `${base}^x ${sign} ${rightSide}`,
        answer: sign === ">" ? `x > ${exponent}` : `x < ${exponent}`,
        steps: [
          "1. Приводим к одинаковому основанию: " + base + "^x " + sign + " " + base + "^" + exponent,
          "2. Сравниваем показатели: x " + sign + " " + exponent
        ]
      };
  }
}

// Проверка решения
function checkSolution(userAnswer) {
  return userAnswer.trim().replace(/\s+/g, " ") === correctAnswer;
}

// Обновление интерфейса
function updateUI() {
  const task = generateInequality();
  document.getElementById("task").textContent = task.task;
  document.getElementById("task-type").textContent = currentTaskType;
  document.getElementById("difficulty").textContent = Object.keys(DIFFICULTY).find(
    key => DIFFICULTY[key] === currentDifficulty
  );
  correctAnswer = task.answer;
  currentSolutionSteps = task.steps;
  document.getElementById("hint-steps").innerHTML = "";
  document.getElementById("result").textContent = "";
}

// Подсказки
function showHint() {
  const hintContainer = document.getElementById("hint-steps");
  if (currentSolutionSteps.length > 0) {
    const step = currentSolutionSteps.shift();
    const stepElement = document.createElement("div");
    stepElement.textContent = step;
    hintContainer.appendChild(stepElement);
  } else {
    hintContainer.textContent = "Подсказки закончились! Попробуйте решить самостоятельно.";
  }
}

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
  updateUI();

  // Кнопки
  document.getElementById("generate-btn").addEventListener("click", updateUI);
  document.getElementById("check-btn").addEventListener("click", () => {
    const userAnswer = document.getElementById("user-solution").value;
    const resultElement = document.getElementById("result");
    resultElement.textContent = checkSolution(userAnswer)
      ? "✅ Верно! " + correctAnswer
      : "❌ Неверно. Попробуйте ещё раз или нажмите «Подсказку».";
  });

  document.getElementById("hint-btn").addEventListener("click", showHint);

  // Выбор типа и сложности
  const typeSelect = document.getElementById("task-type-select");
  Object.values(TASK_TYPES).forEach(type => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    typeSelect.appendChild(option);
  });
  typeSelect.addEventListener("change", (e) => {
    currentTaskType = e.target.value;
    updateUI();
  });

  const difficultySelect = document.getElementById("difficulty-select");
  Object.keys(DIFFICULTY).forEach(key => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = key;
    difficultySelect.appendChild(option);
  });
  difficultySelect.addEventListener("change", (e) => {
    currentDifficulty = DIFFICULTY[e.target.value];
    updateUI();
  });
});
