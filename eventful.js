/**
 * Add the ability to listen to and dispatch events from an object.
 */
var Eventful = /** @class */ (function () {
    function Eventful() {
        /**
         * Maintain references to all subscribed events.
         * This will be used internally to keep track of any registered events
         * and provide references that can be used to remove event listeners.
         *
         * @private
         */
        this._listeners = {};
        /**
         * Maintain references to single use event listeners.
         *
         * @private
         */
        this._onceListeners = {};
        /**
         * A dom element is required for sending events
         *
         * @private
         */
        this._eventTarget = document.createTextNode('');
    }
    /**
     * Remove empty values from an array
     * eg. keys that have been removed using the 'delete' keyword
     *
     * @private
     * @param {Array} arr
     * @returns {Array}
     */
    Eventful.prototype._removeEmptyElements = function (arr) {
        if (!arr) {
            return [];
        }
        return arr.filter(function (el) { return el; });
    };
    ;
    /**
     * Register an event listener
     *
     * @param {string} name - The name of the event to be subscribed to.
     * @param {EventListener} fnc - Callback that will be executed when the event is fired.
     *                         This will have access to the Event object as its first argument.
     */
    Eventful.prototype.on = function (name, fnc) {
        if (!this._listeners[name]) {
            this._listeners[name] = [];
        }
        this._listeners[name].push(fnc.bind(this));
        var index = this._listeners[name].length - 1;
        this._eventTarget.addEventListener(name, this._listeners[name][index]);
    };
    ;
    /**
     * Register a single-use event listener
     *
     * @param {string} name - The name of the event to be subscribed to.
     * @param {EventListener} fnc - Callback that will be executed when the event is fired.
     *                         This will have access to the Event object as its first argument.
     */
    Eventful.prototype.once = function (name, fnc) {
        if (!this._listeners[name]) {
            this._listeners[name] = [];
        }
        this._listeners[name].push(fnc.bind(this));
        var index = this._listeners[name].length - 1;
        if (!this._onceListeners[name]) {
            this._onceListeners[name] = [];
        }
        this._onceListeners[name].push(index);
        this._eventTarget.addEventListener(name, this._listeners[name][index], { once: true });
    };
    ;
    /**
     * Remove an event listener by its name
     *
     * @param {string} name - The name of the event to be unsubscribed from.
     */
    Eventful.prototype.off = function (name) {
        var _this = this;
        if (this._listeners[name].length) {
            this._listeners[name].forEach(function (event) {
                _this._eventTarget.removeEventListener(name, event);
            });
        }
        delete this._listeners[name];
        this._listeners[name] = this._removeEmptyElements(this._listeners[name]);
        delete this._onceListeners[name];
        this._onceListeners[name] = this._removeEmptyElements(this._onceListeners[name]);
    };
    ;
    /**
     * Create a new event
     *
     * @private
     * @param {string} name The name of the event
     * @param {Object} data Any data associated with the event
     * @returns {CustomEvent|Event}
     */
    Eventful.prototype._createEvent = function (name, data) {
        if (data === void 0) { data = {}; }
        var event;
        if (typeof CustomEvent === 'function') {
            event = new CustomEvent(name, { detail: data });
        }
        else {
            // IE compatibility
            event = document.createEvent("Event");
            event.initEvent(name, false, true);
            event.detail = data;
        }
        return event;
    };
    ;
    /**
     * Fire an event
     *
     * @param {string} name - The name of the event that is being fired
     * @param {Object} data - Any details related to the event can be included here.
     */
    Eventful.prototype.fireEvent = function (name, data) {
        var _this = this;
        this._eventTarget.dispatchEvent(this._createEvent(name, data));
        if (this._onceListeners[name]) {
            var indices = this._onceListeners[name];
            indices.forEach(function (index) {
                _this._eventTarget.removeEventListener(name, _this._listeners[name][index]);
                delete _this._listeners[name][index];
            });
            this._listeners[name] = this._removeEmptyElements(this._listeners[name]);
            delete this._onceListeners[name];
        }
    };
    ;
    /**
     * Does this Eventful object have any event listeners registered?
     *
     * @returns {Boolean}
     */
    Eventful.prototype.hasListeners = function () {
        return !!(this._listeners && Object.keys(this._listeners).length);
    };
    ;
    /**
     * Get all registered event listeners
     *
     * @returns {object}
     */
    Eventful.prototype.getListeners = function () {
        return this._listeners;
    };
    ;
    return Eventful;
}());
/**
 * Helper function for creating a new Eventful prototype
 * @returns {Eventful}
 */
function EventfulPrototype() {
    return Object.create(Eventful.prototype);
}
;
/**
 * Helper function for turning an object into an Eventful object
 * @param {object} obj
 * @returns {object}
 */
function Eventify(obj) {
    Object.setPrototypeOf(obj, Eventful.prototype);
    Eventful.apply(obj);
    return obj;
}
