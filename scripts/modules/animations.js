import * as utils from './utils.js';
import EventScribe from './eventscribe.js';

const parseFrames = (data) => {
  const frames = data.map((x) => x.split(':').map((x) => +x));
  const fn = (min) => (n) => (n < min ? null : [n, --n]);

  return frames.reduce((a, b) => {
    const fr = b.slice(1);
    return [...a, [b[0], utils.unfold(fn(fr[0]), fr[fr.length - 1]).reverse()]];
  }, []);
};

export class Animation {
  constructor(frames, { delay = 20, interrupt = true }) {
    this.frameSet = parseFrames(frames);
    [this.row, this.frames] = this.frameSet[0];
    Object.assign(this, { delay, count: 0, index: 0 });
    Object.assign(this, { interrupt, requestId: 0, rowIndex: 0 });
  }

  nextFrame(callback) {
    this.count += 1;

    if (this.count >= this.delay) {
      const frameSetLength = this.frameSet.length;
      this.index = this.index === this.frames.length - 1 ? 0 : this.index + 1;

      if (this.index === 0 && frameSetLength > 1) {
        if (this.rowIndex === frameSetLength - 1) {
          this.rowIndex = 0;
        } else {
          this.rowIndex = this.rowIndex + 1; 
        }
      }
      
      this.frames = this.frameSet[this.rowIndex][1];
      this.row = this.frameSet[this.rowIndex][0];
      this.frame = this.frames[this.index];
      this.count = 0;
    }

    if (callback) callback(this.frame, this.row);
  }

  play(callback) {
    this.requestId = requestAnimationFrame(this.play.bind(this, callback));
    this.nextFrame(callback);
  }

  stop() {
    cancelAnimationFrame(this.requestId);
  }
}

export class Animations {
  constructor() {
    this.animations = new Map();
    this.animation = { name: null, frame: 0, row: 0 };
    this.scribe = new EventScribe(true);
  }

  register(name, animation) {
    if (animation instanceof Animation) {
      this.animations.set(name, animation);
    }
  }

  unregister(name) {
    this.animations.delete(name);
  }

  on(name, callback) {
    this.scribe.registerEventHandler(name, callback);
  }

  play(name) {
    if (this.animation.name !== name && this.animations.has(name)) {
      this.stop(this.animation.name);
      this.animation.name = name;

      this.animations.get(name).play((frame, row) => {
        this.animation.frame = frame;
        this.animation.row = row;
        this.scribe.handle(name);
      });
    }
  }

  stop(name) {
    const animation = this.animations.get(name);
    if (animation instanceof Animation) animation.stop();
  }

  nextFrame() {
    if (this.animation.name && this.animations.has(name)) {
      this.animations.get(name).nextFrame((frame, row) => {
        this.animation.frame = frame;
        this.animation.row = row;
        this.scribe.handle(name);
      });
    }
  }

  get frame() {
    return this.animation.frame;
  }

  get row() {
    return this.animation.row;
  }
}
