import { keys } from './keypress.js';
import * as utils from './modules/utils.js';
import { createLooper } from './modules/kanvas.js';
import { adventurer } from './characters/index.js';

const canvas = document.querySelector('#canvas');
const looper = createLooper(canvas);
const characters = [adventurer];

const global = { particles: [], stance: 'casual' };

class Particle {
  constructor(pos, speed, size, colour) {
    Object.assign(this, { pos, speed, size, colour });
  }

  render(ctx) {
    const { x, y } = this.pos;
    const size = this.size;
    ctx.beginPath();
    // ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2, false);
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x, y - size, x + size, y - size); // E1
    ctx.quadraticCurveTo(x + size, y - size * 2, x + size * 2, y - size * 2); // E2
    ctx.quadraticCurveTo(x + size * 3, y - size * 2, x + size * 3, y - size); // E3
    ctx.quadraticCurveTo(x + size * 4, y - size, x + size * 4, y); // 4
    ctx.quadraticCurveTo(x + size * 4, y + size, x + size * 3, y + size); // 5
    ctx.quadraticCurveTo(
      x + size * 3,
      y + size * 2,
      x + size * 2,
      y + size * 2
    ); // 6
    ctx.quadraticCurveTo(x + size, y + size * 2, x + size, y + size); //7

    ctx.fillStyle = this.colour;
    ctx.fill();
  }

  update(ctx) {
    let { x, y } = adventurer.position;
    let scaledHeight = adventurer.scaled(adventurer.dimensions.height - 5);
    x = x + 50;
    y = y + scaledHeight;

    this.pos.x += this.speed.x;
    this.pos.y += this.speed.y;

    if (this.size < 12) {
      this.size -= 0.05;
    }

    this.render(ctx)
  }
}

window.addEventListener('keydown', () => {
  if (keys.ArrowRight) {
    characters.forEach((sprite) => sprite.animations.play('run'));
  }

  if (keys.KeyQ) {
    characters.forEach((sprite) => sprite.animations.play('draw-sword'));
  }
});

window.addEventListener('keyup', () => {
  if (Object.values(keys).every(x => x === false)) {
    characters.forEach((sprite) => sprite.animations.play('idle'));
  }
});

const makeParticles = (n) => {
  const { x, y } = adventurer.position;
  const { height } = adventurer.dimensions;

  const colours = [
    'rgba(93, 54, 10, 0.1)',
    'rgba(93, 54, 10, 0.2)',
    'rgba(93, 54, 10, 0.3)',
  ];

  return utils.unfold((number) => {
    if (!number) return null;
    
    const size = utils.random(5)(10);
    const speed = { x: utils.random(-1)(1), y: utils.random(-2)(0) };

    const px = utils.random(x)(x + 100);
    const pos = { x: px, y: y + adventurer.scaled(height - 3) };

    return [
      new Particle(pos, speed, size, utils.randomElement(colours)),
      --number,
    ];
  }, n);
};

global.particles = makeParticles(2);

adventurer.onAnimation('run', (sprite) => {
  global.particles = [...global.particles, ...makeParticles(1)];
});

looper((ctx) => {
  ctx.fillStyle = '#E2E2E2';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  characters.forEach((sprite) => sprite.render(ctx));

  global.particles.map((p) => p.update(ctx));
  global.particles = global.particles.filter((p) => p.size > 2);
})();
