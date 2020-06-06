/** The global event registry for all scribes except those who went rogue. */
const registry = {};

/**
 * A (mostly) faithful EventScribe that does your biding.
 *
 * EventScribes manage (custom) events and their handlers (listeners), executing
 * them when you tell them to.
 *
 * - All scribes share the same registry of custom events. Unless...
 *
 * [NOTE] They can go rogue, so be careful.
 *
 * @param {Boolean} rogue Flag determining if the scribe should go rogue.
 */
export default function EventScribe(rogue = false) {
  if (rogue) {
    this.registry = {}; // This badass made it's own registry
    this.getGlobalRegistry = () => ({ ...registry });
  }
  //? Secret Property
  Object.defineProperty(this, 'isRogue', { value: rogue, writable: false });
  Object.assign(this, { debug: false });
}

/**
 * Returns a copy of the registry the scribe has access to.
 */
EventScribe.prototype.getRegistry = function () {
  return this.isRogue ? { ...this.registry } : { ...registry };
};

/**
 * Registers a handler for an event on the registry the scribe has access to.
 *
 * @param {String} event The name of the event.
 * @param {Function} callback The handler to register for the event.
 */
EventScribe.prototype.registerEventHandler = function (event, callback) {
  const __registry = this.isRogue ? this.registry : registry;

  if (!__registry.hasOwnProperty(event)) {
    __registry[event] = [];
  }

  if (typeof callback === 'function') {
    if (this.debug) console.log(`[Register] ${event}`);
    __registry[event].push(callback);
  } else {
    throw Error(
      'EventHandlers are expected to be functions, the scribe is upset!'
    );
  }
};

/**
 * Scrubs a handler for an event from the registry the scribe has access to.
 *
 * @param {String} event The name of the event.
 * @param {Function} callback The handler to register for the event.
 */
EventScribe.prototype.unregisterEventHandler = function (event, callback) {
  const __registry = this.isRogue ? this.registry : registry;

  if (!__registry[event]) return; // Silent but deadly

  if (typeof callback === 'function') {
    let i = __registry[event].indexOf(callback);
    if (i >= 0) {
      __registry[event].splice(i, 1);
    }
  } else {
    delete __registry[event];
  }

  if (this.debug) console.log(`[Unregister] ${event}`);
};

/**
 * Do stuff
 */
EventScribe.prototype.handle = function (event, ...args) {
  const __registry = this.isRogue ? this.registry : registry;

  if (!__registry[event]) {
    return;
  }
  if (this.debug) console.log(`[Handle] ${event}!`);
  __registry[event].forEach((cb) => cb(...args));
};
