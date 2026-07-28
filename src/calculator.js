const MAX_INPUT_LENGTH = 14;
const MAX_HISTORY_LENGTH = 8;
const PRECISION = 12;

const operations = {
  "+": (left, right) => left + right,
  "-": (left, right) => left - right,
  "*": (left, right) => left * right,
  "/": (left, right) => left / right,
};

const operatorSymbols = {
  "+": "+",
  "-": "−",
  "*": "×",
  "/": "÷",
};

function normalizeResult(value) {
  if (!Number.isFinite(value)) {
    return null;
  }

  return Number.parseFloat(value.toPrecision(PRECISION));
}
function formatResult(value) {
  const normalized = normalizeResult(value);

  if (normalized === null) {
    return null;
  }

  const plain = String(normalized);
  if (plain.length <= MAX_INPUT_LENGTH) {
    return plain;
  }

  return normalized.toExponential(7).replace("e+", "e");
}

export class Calculator {
  constructor() {
    this.history = [];
    this.clear();
  }

  clear() {
    this.display = "0";
    this.leftOperand = null;
    this.operator = null;
    this.waitingForOperand = false;
    this.justEvaluated = false;
    this.lastOperator = null;
    this.lastRightOperand = null;
    this.error = false;
  }

  clearHistory() {
    this.history = [];
  }

  inputDigit(digit) {
    if (!/^\d$/.test(digit)) {
      throw new TypeError("El dígito debe ser un carácter entre 0 y 9.");
    }

    if (this.error) {
      this.clear();
    }

    if (this.waitingForOperand || this.justEvaluated) {
      this.display = digit;
      this.waitingForOperand = false;
      this.justEvaluated = false;
      return;
    }

    const digitCount = this.display.replace(/[-.]/g, "").length;
    if (digitCount >= MAX_INPUT_LENGTH) {
      return;
    }

    this.display = this.display === "0" ? digit : `${this.display}${digit}`;
  }

  inputDecimal() {
    if (this.error) {
      this.clear();
    }

    if (this.waitingForOperand || this.justEvaluated) {
      this.display = "0.";
      this.waitingForOperand = false;
      this.justEvaluated = false;
      return;
    }

    if (!this.display.includes(".")) {
      this.display += ".";
    }
  }

  chooseOperator(nextOperator) {
    if (!(nextOperator in operations) || this.error) {
      return;
    }

    const currentValue = Number(this.display);

    if (this.operator && !this.waitingForOperand) {
      const result = this.#calculate(
        this.leftOperand,
        currentValue,
        this.operator,
      );

      if (result === null) {
        return;
      }

      this.display = result;
      this.leftOperand = Number(result);
    } else {
      this.leftOperand = currentValue;
    }

    this.operator = nextOperator;
    this.waitingForOperand = true;
    this.justEvaluated = false;
  }

  evaluate() {
    if (this.error) {
      return;
    }

    if (!this.operator) {
      if (this.justEvaluated && this.lastOperator) {
        const leftOperand = Number(this.display);
        const repeated = this.#calculate(
          leftOperand,
          this.lastRightOperand,
          this.lastOperator,
        );

        if (repeated !== null) {
          this.#recordHistory(
            leftOperand,
            this.lastRightOperand,
            this.lastOperator,
            repeated,
          );
          this.display = repeated;
        }
      }
      return;
    }

    const rightOperand = this.waitingForOperand
      ? this.leftOperand
      : Number(this.display);
    const activeOperator = this.operator;
    const result = this.#calculate(
      this.leftOperand,
      rightOperand,
      activeOperator,
    );

    if (result === null) {
      return;
    }

    this.#recordHistory(
      this.leftOperand,
      rightOperand,
      activeOperator,
      result,
    );
    this.display = result;
    this.lastOperator = activeOperator;
    this.lastRightOperand = rightOperand;
    this.leftOperand = null;
    this.operator = null;
    this.waitingForOperand = true;
    this.justEvaluated = true;
  }

  toggleSign() {
    if (this.error || this.display === "0") {
      return;
    }

    this.display = this.display.startsWith("-")
      ? this.display.slice(1)
      : `-${this.display}`;
  }

  percent() {
    if (this.error) {
      return;
    }

    const result = formatResult(Number(this.display) / 100);
    if (result !== null) {
      this.display = result;
      this.waitingForOperand = false;
      this.justEvaluated = false;
    }
  }

  backspace() {
    if (this.error) {
      this.clear();
      return;
    }

    if (this.waitingForOperand || this.justEvaluated) {
      return;
    }

    this.display = this.display.length > 1 ? this.display.slice(0, -1) : "0";
    if (this.display === "-") {
      this.display = "0";
    }
  }

  getState() {
    return {
      display: this.display,
      error: this.error,
      history: this.history.map((entry) => ({ ...entry })),
    };
  }

  #recordHistory(left, right, operator, result) {
    const leftDisplay = formatResult(left) ?? String(left);
    const rightDisplay = formatResult(right) ?? String(right);

    this.history.unshift({
      expression: `${leftDisplay} ${operatorSymbols[operator]} ${rightDisplay}`,
      result,
    });
    this.history = this.history.slice(0, MAX_HISTORY_LENGTH);
  }

  #calculate(left, right, operator) {
    if (operator === "/" && right === 0) {
      this.#setError();
      return null;
    }

    const result = formatResult(operations[operator](left, right));
    if (result === null) {
      this.#setError();
      return null;
    }

    return result;
  }

  #setError() {
    this.display = "No definido";
    this.leftOperand = null;
    this.operator = null;
    this.waitingForOperand = false;
    this.justEvaluated = false;
    this.error = true;
  }
}
