import assert from "node:assert/strict";
import test from "node:test";

import { Calculator } from "../src/calculator.js";

function enter(calculator, value) {
  for (const character of value) {
    if (character === ".") {
      calculator.inputDecimal();
    } else {
      calculator.inputDigit(character);
    }
  }
}

test("suma dos valores", () => {
  const calculator = new Calculator();
  enter(calculator, "12");
  calculator.chooseOperator("+");
  enter(calculator, "7");
  calculator.evaluate();

  assert.equal(calculator.getState().display, "19");
});
test("encadena operaciones usando el resultado intermedio", () => {
  const calculator = new Calculator();
  enter(calculator, "10");
  calculator.chooseOperator("+");
  enter(calculator, "5");
  calculator.chooseOperator("*");
  enter(calculator, "2");
  calculator.evaluate();

  assert.equal(calculator.getState().display, "30");
});

test("evita errores comunes de coma flotante", () => {
  const calculator = new Calculator();
  enter(calculator, "0.1");
  calculator.chooseOperator("+");
  enter(calculator, "0.2");
  calculator.evaluate();

  assert.equal(calculator.getState().display, "0.3");
});

test("repite la última operación al pulsar igual", () => {
  const calculator = new Calculator();
  enter(calculator, "5");
  calculator.chooseOperator("+");
  enter(calculator, "2");
  calculator.evaluate();
  calculator.evaluate();

  assert.equal(calculator.getState().display, "9");
});

test("aplica el operando izquierdo cuando falta el derecho", () => {
  const calculator = new Calculator();
  enter(calculator, "8");
  calculator.chooseOperator("+");
  calculator.evaluate();

  assert.equal(calculator.getState().display, "16");
});

test("muestra un estado recuperable al dividir entre cero", () => {
  const calculator = new Calculator();
  enter(calculator, "9");
  calculator.chooseOperator("/");
  enter(calculator, "0");
  calculator.evaluate();

  assert.deepEqual(calculator.getState(), {
    display: "No definido",
    error: true,
    history: [],
  });

  calculator.inputDigit("4");
  assert.deepEqual(calculator.getState(), {
    display: "4",
    error: false,
    history: [],
  });
});

test("admite cambio de signo, porcentaje y retroceso", () => {
  const calculator = new Calculator();
  enter(calculator, "250");
  calculator.backspace();
  calculator.toggleSign();
  calculator.percent();

  assert.equal(calculator.getState().display, "-0.25");
});

test("limita la longitud de la entrada", () => {
  const calculator = new Calculator();
  enter(calculator, "12345678901234567890");

  assert.equal(calculator.getState().display, "12345678901234");
});

test("rechaza entradas que no sean dígitos", () => {
  const calculator = new Calculator();

  assert.throws(() => calculator.inputDigit("12"), TypeError);
  assert.throws(() => calculator.inputDigit("a"), TypeError);
});

test("registra las operaciones resueltas en el historial", () => {
  const calculator = new Calculator();
  enter(calculator, "12");
  calculator.chooseOperator("+");
  enter(calculator, "7");
  calculator.evaluate();

  assert.deepEqual(calculator.getState().history, [
    { expression: "12 + 7", result: "19" },
  ]);
});

test("registra las repeticiones de igual como operaciones nuevas", () => {
  const calculator = new Calculator();
  enter(calculator, "5");
  calculator.chooseOperator("+");
  enter(calculator, "2");
  calculator.evaluate();
  calculator.evaluate();

  assert.deepEqual(calculator.getState().history, [
    { expression: "7 + 2", result: "9" },
    { expression: "5 + 2", result: "7" },
  ]);
});

test("conserva solo las ocho operaciones más recientes", () => {
  const calculator = new Calculator();

  for (let index = 0; index < 10; index += 1) {
    calculator.inputDigit("1");
    calculator.chooseOperator("+");
    calculator.inputDigit("1");
    calculator.evaluate();
  }

  assert.equal(calculator.getState().history.length, 8);
});

test("limpia el historial sin modificar el resultado", () => {
  const calculator = new Calculator();
  enter(calculator, "9");
  calculator.chooseOperator("*");
  enter(calculator, "3");
  calculator.evaluate();
  calculator.clearHistory();

  assert.equal(calculator.getState().display, "27");
  assert.deepEqual(calculator.getState().history, []);
});
