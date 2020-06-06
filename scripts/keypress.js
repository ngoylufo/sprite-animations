export const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  Shift: false,
  Space: false,
};

window.addEventListener('keydown', ({ key, code }) => {
  if (keys.hasOwnProperty(code) && !keys[code]) {
    keys[code] = true;
  } else if (keys.hasOwnProperty(key) && !keys[key]) {
    keys[key] = true;
  }
});

window.addEventListener('keyup', ({ key, code }) => {
  if (keys.hasOwnProperty(code) && keys[code]) {
    keys[code] = false;
  } else if (keys.hasOwnProperty(key) && keys[key]) {
    keys[key] = false;
  }
});
