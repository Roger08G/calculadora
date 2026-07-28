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
  });

  calculator.inputDigit("4");
  assert.deepEqual(calculator.getState(), { display: "4", error: false });
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
