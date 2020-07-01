import * as utils from './utils.js';
import { Animations, Animation } from './animations.js';

export function Sprite(filename, { width, height, scale = 1 }) {
  this.image = utils.createImage({ src: filename });
  Object.assign(this, { width, height });

  this.scale = utils.maybe(function (value) {
    return scale * value;
  });
}

Sprite.prototype.setImage = utils.maybe(function (filename) {
  this.image = utils.createImage({ src: filename });
});

Sprite.prototype.render = utils.maybe(function (context, position) {
  context.drawImage(
    this.image,
    this.width,
    this.height,
    this.width,
    this.height,
    position[0],
    position[1],
    this.scale(this.width),
    this.scale(this.height)
  );
});

export function AnimatedSprite(filename, { width, height, scale }) {
  Sprite.call(this, filename, { width, height, scale });
  this.animations = new Animations();
}

AnimatedSprite.prototype = Object.create(Sprite.prototype);

AnimatedSprite.prototype.playAnimation = utils.maybe(function (name) {
  this.animations.play(name);
});

AnimatedSprite.prototype.stopAnimation = utils.maybe(function (name) {
  this.animations.stop(name);
});

AnimatedSprite.prototype.onAnimation = utils.maybe(function (name, callback) {
  this.animations.on(name, utils.partial(callback, this));
});

AnimatedSprite.prototype.addAnimation = utils.maybe(function (
  name,
  frames,
  { delay }
) {
  this.animations.register(name, new Animation(frames, { delay }));
});

AnimatedSprite.prototype.removeAnimation = utils.maybe(function (name) {
  this.animations.unregister(name);
});

AnimatedSprite.prototype.render = utils.maybe(function (context, position) {
  context.drawImage(
    this.image,
    this.animations.frame * this.width,
    this.animations.row * this.height,
    this.width,
    this.height,
    position[0],
    position[1],
    this.scale(this.width),
    this.scale(this.height)
  );
});
