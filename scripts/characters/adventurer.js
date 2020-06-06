import { AnimatedSprite } from '../modules/sprites.js';

const adventurer = (() => {
  const attributes = { scale: 3, x: 150, y: 300 };
  const source = 'assets/images/adventurer.png';
  return new AnimatedSprite(source, 50, 37, attributes);
})();

adventurer.addAnimation('idle', ['1:0:3'], { delay: 10 });
adventurer.addAnimation('draw-sword', ['10:6', '11:0:3'], { delay: 9 });
adventurer.addAnimation('run', ['2:1:6'], { delay: 5 });

adventurer.onAnimation('run', (sprite) => {
  sprite.move([2.75, 0]);
});

adventurer.animations.play('idle');

export default adventurer;
