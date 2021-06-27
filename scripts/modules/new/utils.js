/** The identity function. */
export const id = (x) => x;

/** */
export const is = (t) => (x) => Object(x) instanceof t;

/** Returns a partially applied version of the given function. */
export const partial = (fn, ...args) => fn.bind(null, ...args);

/** Composes two or more (composable) functions into a single function. */
export const compose = (...fns) => {
  return (x) => fns.reduceRight((arg, fn) => fn(arg), x);
};

/* The maybe combinator. */
export const maybe = (fn) => {
  return function (...args) {
    if (args.length && args.every((arg) => arg ?? true)) {
      return fn.call(this, ...args);
    }
  };
};

export const leftApply = (fn, ...a) => (...b) => fn(...a, ...b);

export const rightApply = (fn, ...b) => (...a) => fn(...a, ...b);

export const tap = (value) => (fn) => (
  type("function")(fn) && fn(value), value
);

/** Returns a memoized version of the given function. */
export const memoize = (fn, serialize = JSON.stringify) => {
  const cache = {};

  return (...args) => {
    const key = serialize(args);
    return cache[key] ?? (cache[key] = fn(...args));
  };
};

/** Returns a memoized version of the given asynchronous function. */
export const memoizeAsync = (asyncFn, serialize = JSON.stringify) => {
  const memo = memoize(asyncFn, serialize);
  return async (...args) => await memo(...args);
};

export const unfold = (fn, seed) => {
  function* go(fn, seed) {
    let result = fn(seed);

    while (result) {
      yield result[0];
      result = fn(result[1]);
    }
  }

  return [...go(fn, seed)];
};

// Dom Related Utility Functions

export const createImage = memoize(({ src }) => {
  return Object.assign(new Image(), { src });
});

// Additional Utility Functions

export const random = (min = 0) => {
  return (max = 100) => Math.random() * (max - min) + min;
};

export const randomInteger = (min = 0) => {
  return compose(Math.floor, random(min)); // too much?
};

export const randomElement = (arr) => {
  return arr[randomInteger(0)(arr.length - 1)];
};

export const square = (a) => a * a;

export const calculateDistance = (a, b) => {
  const [x, y] = is(Array)(a) ? [0, 1] : ["x", "y"];
  return Math.hypot(a[x] - b[x], a[y] - b[y]);
};
