/** Returns an array of length 2 representing a vector. */
export const vector = (x, y) => [x, y];

/** Returns a vector with all its elements having the same value. */
export const uniform = (n) => vector(n, n);

/* Utility Functions */

/** Clones a given vector. */
export const clone = (a) => [...a];

/** Inverts the given vector */
export const invert = (a) => vector(...a.map((n) => -n));

/** Negates the given vector */
export const negative = (a) => invert(a);

/** Limit the magnitude of a vector. */
export const limit = (a, n) => {
  if (mag(a) > n) return multiply(normalize(a), n);
  return [...a];
};

export const limitX = (a, n) => {
  if (n > 0 && a[0] > n) return [n, a[1]];
  if (n < 0 && a[0] < n) return [n, a[1]];
  return [...a];
};

export const limitY = (a, n) => {
  if (a[1] > n) return [a[0], n];
  return [...a];
};

export const limitComponents = (a, b) => {
  return limitX(limitY(a, b[1]), b[0]);
}

/* Vector Manipulation Functions */

/** Add two vectors */
export const add = (...vectors) => {
  return vectors.reduce((a, b) => vector(a[0] + b[0], a[1] + b[1]), uniform(0));
};

/** Add to the x component of a vector */
export const addX = (a, n) => vector(a[0] + n, a[1]);

/** Add to the y component of a vector */
export const addY = (a, n) => vector(a[0], a[1] + n);

/** Subtract a vector from a vector */
export const subtract = (...vectors) => {
  return vectors.reduce((a, b) => vector(a[0] - b[0], a[1] - b[1]), uniform(0));
};

/** Subtract from the x component of a vector */
export const subtractX = (a, n) => vector(a[0] - n, a[1]);

/** Subtract from the y component of a vector */
export const subtractY = (a, n) => vector(a[0], a[1] - n);

/** Multiply a vector by n */
export const multiply = (v, n) => vector(...v.map((x) => x * n));

/** Multiply the x component of a vector by n */
export const multiplyX = (a, n) => vector(a[0] * n, a[1]);

/** Multiply the y component of a vector by n */
export const multiplyY = (a, n) => vector(a[0], a[1] * n);

/** Divide a vector by n */
export const divide = (a, n) => vector(...a.map((x) => (x !== 0 ? x / n : x)));

/** Divide the x component of a vector by n */
export const divideX = (a, n) => vector(a[0] !== 0 ? a[0] / n : a[0], a[1]);

/** Divide the y component of a vector by n */
export const divideY = (a, n) => vector(a[0], a[1] !== 0 ? a[1] / n : a[1]);

/** Normalizes the given vector */
export const normalize = (a) => vector(...divide(a, mag(a)));

/** Returns the dot product of 2 vectors */
export const dot = (a, b) => a[0] * b[0] + a[1] * b[1];

/** Returns the magnitude of a vector */
export const mag = (a) => Math.sqrt(dot(a, a));

/** Returns the length of a vector. */
export const len = (a) => dot(a, a);
