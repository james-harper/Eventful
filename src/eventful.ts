/**
 * Add the ability to listen to and dispatch events from an object.
 */
class Eventful {
  /**
   * Maintain references to all subscribed events.
   * This will be used internally to keep track of any registered events
   * and provide references that can be used to remove event listeners.
   *
   * @private
   */
  _listeners:Dictionary<EventListener[]> = {};

  /**
   * Maintain references to single use event listeners.
   *
   * @private
   */
  _onceListeners:Dictionary<number[]> = {};

  /**
   * A dom element is required for sending events
   *
   * @private
   */
  _eventTarget:Text = document.createTextNode('');

  /**
   * Remove empty values from an array
   * eg. keys that have been removed using the 'delete' keyword
   *
   * @private
   * @param {Array} arr
   * @returns {Array}
   */
  _removeEmptyElements(arr:Array<any>) : Array<any> {
    if (!arr) { return [];}
    return arr.filter(el => el);
  };

  /**
   * Register an event listener
   *
   * @param {string} name - The name of the event to be subscribed to.
   * @param {EventListener} fnc - Callback that will be executed when the event is fired.
   *                         This will have access to the Event object as its first argument.
   */
  on(name:string, fnc:EventListener) {
    if (!this._listeners[name]) {
      this._listeners[name] = [];
    }

    this._listeners[name].push(fnc.bind(this));
    let index:number = this._listeners[name].length - 1;

    this._eventTarget.addEventListener(name, this._listeners[name][index]);
  };

  /**
   * Register a single-use event listener
   *
   * @param {string} name - The name of the event to be subscribed to.
   * @param {EventListener} fnc - Callback that will be executed when the event is fired.
   *                         This will have access to the Event object as its first argument.
   */
  once(name:string, fnc:EventListener) {
    if (!this._listeners[name]) {
      this._listeners[name] = [];
    }

    this._listeners[name].push(fnc.bind(this));
    var index = this._listeners[name].length - 1;

    if (!this._onceListeners[name]) {
      this._onceListeners[name] = [];
    }

    this._onceListeners[name].push(index);
    this._eventTarget.addEventListener(name, this._listeners[name][index], {once: true});
  };


  /**
   * Remove an event listener by its name
   *
   * @param {string} name - The name of the event to be unsubscribed from.
   */
  off(name:string) {
    if (this._listeners[name].length) {
      this._listeners[name].forEach(event => {
        this._eventTarget.removeEventListener(name, event);
      });
    }

    delete this._listeners[name];
    this._listeners[name] = this._removeEmptyElements(this._listeners[name]);
    delete this._onceListeners[name];
    this._onceListeners[name] = this._removeEmptyElements(this._onceListeners[name]);
  };

  /**
   * Create a new event
   *
   * @private
   * @param {string} name The name of the event
   * @param {Object} data Any data associated with the event
   * @returns {CustomEvent|Event}
   */
  _createEvent(name:string, data:object = {}) {
    let event;

    if (typeof CustomEvent === 'function') {
      event = new CustomEvent(name, {detail: data});
    } else {
      // IE compatibility
      event = document.createEvent("Event");
      event.initEvent(name, false, true);
      event.detail = data;
    }

    return event;
  };

  /**
   * Fire an event
   *
   * @param {string} name - The name of the event that is being fired
   * @param {Object} data - Any details related to the event can be included here.
   */
  fireEvent(name:string, data:object) {
    this._eventTarget.dispatchEvent(this._createEvent(name, data));

    if (this._onceListeners[name]) {
      let indices:number[] = this._onceListeners[name];

      indices.forEach(index => {
        this._eventTarget.removeEventListener(name, this._listeners[name][index]);
        delete this._listeners[name][index];
      });

      this._listeners[name] = this._removeEmptyElements(this._listeners[name]);

      delete this._onceListeners[name];
    }
  };

  /**
   * Does this Eventful object have any event listeners registered?
   *
   * @returns {Boolean}
   */
  hasListeners() : boolean {
    return !!(this._listeners && Object.keys(this._listeners).length);
  };

  /**
   * Get all registered event listeners
   *
   * @returns {object}
   */
  getListeners() : Dictionary<EventListener[]> {
    return this._listeners;
  };
}
