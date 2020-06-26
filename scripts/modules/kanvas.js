import * as utils from './utils.js';

function setFullscreen(canvas) {
  Object.assign(canvas, { width: innerWidth, height: innerHeight });
}

export function initialize(canvas, options = {}) {
  const context = canvas.getContext('2d');

  setFullscreen(context.canvas);

  window.addEventListener('resize', () => {
    setFullscreen(context.canvas);
  });

  return function looper(callback) {
    const metrics = { start: 0, timestamp: 0, frames: {} };

    function updateMetrics(metrics, timestamp) {
      const currFrame = Math.round(timestamp - metrics.start);
      const { total = 0 } = metrics.frames;
      const dropped = currFrame - (total + 1);

      metrics.timestamp = timestamp;
      metrics.frames = { dropped, frame: currFrame, total: total + 1 };

      return metrics;
    }

    return function loop(timestamp = 0) {
      requestAnimationFrame(loop);
      callback(context, updateMetrics(metrics, timestamp));
    };
  };
}

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
      if (n > 0) requestAnimationFrame(utils.partial(finiteLoop, --n));
      callback(context);
    };

    return infinite ? infiniteLoop : finiteLoop;
  };
}
