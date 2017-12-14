/**
 * Helper function for creating a new Eventful prototype
 * @returns {Eventful}
 */
function EventfulPrototype() : Eventful {
  return Object.create(Eventful.prototype);
};

/**
 * Helper function for turning an object into an Eventful object
 * @param {object} obj
 * @returns {object}
 */
function Eventify(obj:object) : object {
  (<any>Object).setPrototypeOf(obj, Eventful.prototype);
  Eventful.apply(obj);
  return obj;
}
