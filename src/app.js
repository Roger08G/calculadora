import { Calculator } from "./calculator.js";

const calculator = new Calculator();
const display = document.querySelector("#display");
const keypad = document.querySelector(".calculator__keys");

function render() {
  const state = calculator.getState();
  display.textContent = state.display.replace(".", ",");
  display.dataset.error = String(state.error);
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
    decimal: () => calculator.inputDecimal(),
    equals: () => calculator.evaluate(),
    percent: () => calculator.percent(),
    "toggle-sign": () => calculator.toggleSign(),
  };

  actions[button.dataset.action]?.();
}

keypad.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button || !keypad.contains(button)) {
    return;
  }

  runAction(button);
  render();
});

render();
