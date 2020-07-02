import Actor from '../modules/actor.js';
import * as vector from '../modules/vector.js';
import { AnimatedSprite } from '../modules/sprites.js';

const adventurer = (function () {
  const filename = 'assets/images/adventurer.png';
  const sprite = new AnimatedSprite(filename, { width: 32, height: 32 });
  return new Actor(sprite, 10, [150, -110]);
})();

adventurer.setInitialState({
  direction: 1,
});

adventurer.setUpdate(function(world) {
  const { direction: d } = this.state;

  if (vector.mag(this.velocity) > 1) {
    const [vx, vy] = this.velocity;
    this.velocity = vector.vector(vx ? vx * 0.95 : vx, vy ? vy * 0.15 : vy);
    this.velocity = vector.limitComponents(this.velocity, [d * 5, 15]);
  } else {
    this.velocity = vector.vector(0, 0);
  }

  this.position = vector.add(this.position, this.velocity);
});


adventurer.addAnimation('idle', ['1:0:3'], { delay: 10 });
adventurer.addAnimation('draw-sword', ['10:6', '11:0:3'], { delay: 9 });
adventurer.addAnimation('run', ['2:1:6'], { delay: 5 });

adventurer.onAnimation('run', (sprite) => {
  sprite.move([2.75, 0]);
});

adventurer.animations.play('idle');

export default adventurer;
