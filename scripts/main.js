import * as utils from './modules/utils.js';
import * as vector from './modules/vector.js';
import * as kanvas from './modules/kanvas.js';

import { keys } from './keypress.js';
import adventurer from './characters/adventurer.js';

const looper = kanvas.initialize(canvas);

window.addEventListener('keydown', () => {
  if (keys.ArrowRight) {
    adventurer.playAnimation('run');
  }

  if (keys.KeyQ) {
    adventurer.playAnimation('draw-sword');
  }
});

window.addEventListener('keyup', () => {
  if (Object.values(keys).every((x) => x === false)) {
    adventurer.playAnimation('idle');
  }
});

looper((context) => {
  context.fillStyle = '#E2E2E2';
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);

  if (adventurer.position[1] < 300 - adventurer.sprite.height) {
    adventurer.apply(vector.vector(0, 6));
  }

  adventurer.render(context);
})();
