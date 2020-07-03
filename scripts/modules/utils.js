/** The identity function. Returns the given function unchanged. */
export const identity = (x) => x;

/** */
export const is = (t) => (x) => Object(x) instanceof t;

/** */
export const type = (t) => (x) => typeof x === t;

/** Returns a partially applied version of the given function. */
export const partial = (fn, ...args) => fn.bind(null, ...args);

/* Returns a curried version the given function. */
export const curry = (fn) => {
  const curried = (...args) =>
    fn.length === args.length
      ? fn(...args)
      : (...newArgs) => curried(...args, ...newArgs);
  return curried;
};

/* The maybe combinator. TODO: write docs */
export const maybe = (fn) => {
  return function(...args) {
    if (args.length > 0) {
      if (args.some(arg => arg === undefined || arg === null)) {
        return;
      }
      return fn.call(this, ...args);
    }
  };
};

/** Composes two or more (composable) functions into a single function. */
export const compose = (...fns) => {
  return (x) => fns.reduceRight((arg, fn) => fn(arg), x);
};

/** Pipes two or more (composable) functions into a single function. */
export const pipe = (...fns) => {
  return (x) => fns.reduce((arg, fn) => fn(arg), x);
};

/** Returns a memoized version of the given function. */
export const memoize = (fn) => {
  const cache = {};
  const isCached = (key) => cache.hasOwnProperty(key);

  return function (...args) {
    const k = JSON.stringify(args);
    return isCached(k) ? cache[k] : (cache[k] = fn.call(this, ...args));
  };
};

/** Returns a memoized version of the given asynchronous function. */
export const memoizeAsync = (fn) => {
  const cache = {};
  const isCached = (key) => cache.hasOwnProperty(key);

  return async function(...args) {
    const k = JSON.stringify(args);
    return isCached(k) ? cache[k] : (cache[k] = await fn.call(this, ...args));
  };
};

export const unfold = (fn, seed) => {
  function* go(fn, seed) {
    let result = fn(seed);

    while(result) {
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
}

export const square = (a) => a * a;

export const calculateDistance = (a, b) => {
  const [x, y] = is(Array)(a) ? [0, 1] : ['x', 'y'];
  return Math.hypot(a[x] - b[x], a[y] - b[y]);
};
