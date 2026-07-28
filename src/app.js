import { Calculator } from "./calculator.js";

const calculator = new Calculator();
const calculatorElement = document.querySelector(".calculator");
const display = document.querySelector("#display");
const historyList = document.querySelector("#history-list");
const clearHistoryButton = document.querySelector('[data-action="clear-history"]');

function localizeNumber(value) {
  return value.replace(".", ",");
}

function renderHistory(history) {
  if (history.length === 0) {
    const emptyState = document.createElement("li");
    emptyState.className = "history__empty";
    emptyState.textContent = "No hay operaciones todavía.";
    historyList.replaceChildren(emptyState);
    clearHistoryButton.disabled = true;
    return;
  }

  const entries = history.map((entry) => {
    const item = document.createElement("li");
    const expression = document.createElement("span");
    const result = document.createElement("span");

    item.className = "history__item";
    item.setAttribute("role", "listitem");
    expression.textContent = localizeNumber(entry.expression);
    result.className = "history__result";
    result.textContent = `= ${localizeNumber(entry.result)}`;
    item.append(expression, result);
    return item;
  });

  historyList.replaceChildren(...entries);
  clearHistoryButton.disabled = false;
}

function render() {
  const state = calculator.getState();
  display.textContent = localizeNumber(state.display);
  display.dataset.error = String(state.error);
  renderHistory(state.history);
}

function runAction(button) {
  if (button.dataset.digit) {
    calculator.inputDigit(button.dataset.digit);
    return;
  }

  if (button.dataset.operator) {
    calculator.chooseOperator(button.dataset.operator);
    return;
  }

  const actions = {
    backspace: () => calculator.backspace(),
    clear: () => calculator.clear(),
    "clear-history": () => calculator.clearHistory(),
    decimal: () => calculator.inputDecimal(),
    equals: () => calculator.evaluate(),
    percent: () => calculator.percent(),
    "toggle-sign": () => calculator.toggleSign(),
  };

  actions[button.dataset.action]?.();
}

function runKeyboardAction(key) {
  if (/^\d$/.test(key)) {
    calculator.inputDigit(key);
    return true;
  }

  if (["+", "-", "*", "/"].includes(key)) {
    calculator.chooseOperator(key);
    return true;
  }

  const actions = {
    "%": () => calculator.percent(),
    ",": () => calculator.inputDecimal(),
    ".": () => calculator.inputDecimal(),
    Backspace: () => calculator.backspace(),
    Enter: () => calculator.evaluate(),
    "=": () => calculator.evaluate(),
    Escape: () => calculator.clear(),
    c: () => calculator.clear(),
    C: () => calculator.clear(),
  };

  if (!actions[key]) {
    return false;
  }

  actions[key]();
  return true;
}

calculatorElement.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button || !calculatorElement.contains(button)) {
    return;
  }

  runAction(button);
  render();
});

document.addEventListener("keydown", (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey) {
    return;
  }

  if (runKeyboardAction(event.key)) {
    event.preventDefault();
    render();
  }
});

render();
