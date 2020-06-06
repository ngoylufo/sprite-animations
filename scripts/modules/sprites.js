import { Animations, Animation } from './animations.js';
import * as utils from './utils.js';

const image = utils.memoize((src) => Object.assign(new Image(), { src }));

export class Sprite {
  constructor(source, width, height, { scale = 1, x = 0, y = 0 }) {
    this.dimensions = { width, height };
    this.image = image(source);
    this.position = { x, y };
    this.scale = scale;

    this.initial = { position: { x, y }, dimensions: { width, height } };
  }

  changeImage(source) {
    this.image = image(source);
  }

  scaled(value) {
    return this.scale * value;
  }

  move(coordinates) {
    this.position.x += coordinates[0];
    this.position.y += coordinates[1];
  }

  render(context) {
    context.drawImage(
      this.image,
      this.dimensions.width,
      this.dimensions.height,
      this.dimensions.width,
      this.dimensions.height,
      this.position.x,
      this.position.y,
      this.scaled(this.dimensions.width),
      this.scaled(this.dimensions.height)
    );
  }
}

export class AnimatedSprite extends Sprite {
  constructor(image, width, height, { scale = 1, x = 0, y = 0 }) {
    super(image, width, height, { scale, x, y });
    this.animations = new Animations();
  }

  onAnimation(name, callback) {
    this.animations.on(name, utils.partial(callback, this));
  }

  addAnimation(name, frames, { delay }) {
    this.animations.register(name, new Animation(frames, { delay }));
  }

  removeAnimation(name) {
    this.animations.unregister(name);
  }

  render(context) {
    context.drawImage(
      this.image,
      this.animations.frame * this.dimensions.width,
      (this.animations.row - 1) * this.dimensions.height,
      this.dimensions.width,
      this.dimensions.height,
      this.position.x,
      this.position.y,
      this.scaled(this.dimensions.width),
      this.scaled(this.dimensions.height)
    );
  }
}
