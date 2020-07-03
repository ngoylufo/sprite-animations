import * as utils from '../modules/utils.js';
import * as vector from '../modules/vector.js';
import { AnimatedSprite } from '../modules/sprites.js';

export default function Actor(sprite, mass, position) {
  this.mass = mass;
  this.sprite = sprite;
  this.position = position;
  this.velocity = vector.uniform(0);
}

/* Actor State */

Actor.prototype.setInitialState = utils.maybe(function (state) {
  if (!this.state) {
    this.state = state;
  }
});

Actor.prototype.setState = utils.maybe(function (state) {
  this.state = Object.assign({}, this.state, state);
});

/* Actor Force Behavior? */

Actor.prototype.apply = utils.maybe(function (...forces) {
  const acceleration = vector.multiply(vector.add(...forces), this.mass);
  this.velocity = vector.add(this.velocity, acceleration);
});

/* Actor Animation */

Actor.prototype.addAnimation = utils.maybe(function (name, frames, { delay }) {
  if (utils.is(AnimatedSprite)(this.sprite) && utils.is(Array)(frames)) {
    this.sprite.addAnimation(name, frames, { delay });
  }
});

Actor.prototype.removeAnimation = utils.maybe(function (name) {
  if (utils.is(AnimatedSprite)(this.sprite)) {
    this.sprite.removeAnimation(name);
  }
});

Actor.prototype.onAnimation = utils.maybe(function (name, callback) {
  this.sprite.onAnimation(name, callback);
});

Actor.prototype.playAnimation = utils.maybe(function (name) {
  if (utils.is(AnimatedSprite)(this.sprite)) {
    this.sprite.playAnimation(name);
  }
});

Actor.prototype.stopAnimation = utils.maybe(function (name) {
  if (utils.is(AnimatedSprite)(this.sprite) && utils.is(Array)(frames)) {
    this.sprite.stopAnimation(name);
  }
});

Actor.prototype.setUpdate = utils.maybe(function (updateFn) {
  if (!this.update) {
    this.update = updateFn;
  }
});

Actor.prototype.render = utils.maybe(function (context) {
  if (this.update && utils.is(Function)(this.update)) {
    this.update(context);
  }

  if (this.position[0] > context.canvas.width) {
    this.position[0] = 0 - this.sprite.width;
  } else if (this.position[0] < -this.sprite.width) {
    this.position[0] = context.canvas.width;
  }

  if (this.position[1] > context.canvas.height) {
    this.position[1] = 0 - this.sprite.height;
  } else if (this.position[1] < -this.sprite.height) {
    this.position[1] = context.canvas.height;
  }

  this.sprite.render(context, this.position);
});
