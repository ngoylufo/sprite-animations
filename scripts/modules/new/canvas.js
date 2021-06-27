import * as utils from "./utils.js";

export const init = (canvas, configurations = {}) => {
  const context = canvas.getContext("2d");

  return (callback) => {
    const loop = (timestamp) => {
      requestAnimationFrame(loop);

      callback(context);
    };

    loop(0);
  };
};

const getCanvasContext = ((uid = 0) => {
  const isCanvas = utils.is(HTMLCanvasElement);

  const getCanvas = (canvas) =>
    isCanvas(canvas) ? canvas : document.querySelector(canvas);

  const setId = utils.rightApply(
    utils.tap,
    (canvas) => canvas.id || (canvas.id = `ruckus_${uid++}`)
  );

  const getContext = utils.memoize(
    (canvas) => canvas.getContext("2d"),
    ([canvas]) => canvas.id
  );

  return utils.compose(getContext, setId, getCanvas);
})();
