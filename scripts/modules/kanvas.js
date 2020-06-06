import { partial } from './utils.js';

export function createLooper(canvas) {
  const context = canvas.getContext('2d');
  const attributes = { width: window.innerWidth, height: window.innerHeight };

  window.addEventListener('resize', () => {
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;
  });

  Object.assign(context.canvas, attributes);

  return (callback, infinite = true) => {
    const infiniteLoop = () => {
      requestAnimationFrame(infiniteLoop);
      callback(context);
    };

    const finiteLoop = (n = 0) => {
      if (n > 0) requestAnimationFrame(partial(finiteLoop, --n));
      callback(context);
    };

    return infinite ? infiniteLoop : finiteLoop;
  };
}
