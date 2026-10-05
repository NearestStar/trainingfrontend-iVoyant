import {
  capitalize,
  unique,
  sum,
  clamp
} from "./index";

import "./style.css";

function getElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);

  if (!element) {
    throw new Error(`Element #${id} not found`);
  }

  return element as T;
}

/* =========================================
   CAPITALIZE
========================================= */

const capitalizeInput =
  getElement<HTMLInputElement>("capitalizeInput");

const capitalizeButton =
  getElement<HTMLButtonElement>("capitalizeButton");

const capitalizeResult =
  getElement<HTMLElement>("capitalizeResult");

capitalizeButton.addEventListener("click", () => {
  const value = capitalizeInput.value;

  capitalizeResult.textContent =
    value ? capitalize(value) : "Enter some text";
});


/* =========================================
   UNIQUE
========================================= */

const uniqueInput =
  getElement<HTMLInputElement>("uniqueInput");

const uniqueButton =
  getElement<HTMLButtonElement>("uniqueButton");

const uniqueResult =
  getElement<HTMLElement>("uniqueResult");

uniqueButton.addEventListener("click", () => {
  const values = uniqueInput.value
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const result = unique(values);

  uniqueResult.textContent =
    result.length > 0
      ? result.join(", ")
      : "Enter comma-separated values";
});


/* =========================================
   SUM
========================================= */

const sumInput =
  getElement<HTMLInputElement>("sumInput");

const sumButton =
  getElement<HTMLButtonElement>("sumButton");

const sumResult =
  getElement<HTMLElement>("sumResult");

sumButton.addEventListener("click", () => {
  const numbers = sumInput.value
    .split(",")
    .map((value) => Number(value.trim()))
    .filter((value) => !Number.isNaN(value));

  if (numbers.length === 0) {
    sumResult.textContent = "Enter some numbers";
    return;
  }

  sumResult.textContent = String(sum(numbers));
});


/* =========================================
   CLAMP
========================================= */

const clampValue =
  getElement<HTMLInputElement>("clampValue");

const clampMin =
  getElement<HTMLInputElement>("clampMin");

const clampMax =
  getElement<HTMLInputElement>("clampMax");

const clampButton =
  getElement<HTMLButtonElement>("clampButton");

const clampResult =
  getElement<HTMLElement>("clampResult");

clampButton.addEventListener("click", () => {
  const value = Number(clampValue.value);
  const min = Number(clampMin.value);
  const max = Number(clampMax.value);

  if (
    Number.isNaN(value) ||
    Number.isNaN(min) ||
    Number.isNaN(max)
  ) {
    clampResult.textContent = "Enter valid numbers";
    return;
  }

  try {
    const result = clamp(value, min, max);

    clampResult.textContent = String(result);
  } catch (error) {
    clampResult.textContent =
      error instanceof Error
        ? error.message
        : "Something went wrong";
  }
});