import Actor from '../modules/actor.js';
import * as vector from '../modules/vector.js';
import { AnimatedSprite } from '../modules/sprites.js';

const adventurer = (function () {
  const filename = 'assets/images/adventurer.png';
  const sprite = new AnimatedSprite(filename, {
    width: 50,
    height: 37,
    scale: 1.5,
  });
  return new Actor(sprite, 40, [150, -110]);
})();

adventurer.setInitialState({
  direction: 1,
});

adventurer.setUpdate(function (world) {
  const { direction: d } = this.state;

  if (vector.mag(this.velocity) > 1) {
    const [vx, vy] = this.velocity;
    this.velocity = vector.vector(vx ? vx * 0.8 : vx, vy ? vy * 0.15 : vy);
    this.velocity = vector.limitComponents(this.velocity, [d * 5, 12]);
  } else {
    this.velocity = vector.vector(0, 0);
  }

  this.position = vector.add(this.position, this.velocity);
});

adventurer.addAnimation('idle', ['0:0:3'], { delay: 10 });
adventurer.addAnimation('draw-sword', ['9:6', '10:0:3'], { delay: 9 });
adventurer.addAnimation('run', ['1:1:6'], { delay: 5 });

adventurer.onAnimation('run', () => {
  adventurer.apply(vector.vector(1, 0));
})

adventurer.playAnimation('idle');

export default adventurer;
