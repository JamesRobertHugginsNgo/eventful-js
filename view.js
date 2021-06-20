/**
 * Class for objects with render properties and methods.
 */
class View extends Eventful {

	/**
	 * Initialize the el property.
	 */
	constructor(el = document.createElement('div')) {
		super();

		this.el = el;
	}

	/**
	 * Adds addEventListener to el property.
	 * @param {string} event
	 * @param {function} handler
	 * @param {boolean} [once]
	 * @param {Eventful} [owner]
	 */
	on(event, handler, once, owner) {
		const events = this.events[event];

		super.on(event, handler, once, owner)

		if (!events) {
			const listener = (...args) => {
				this.trigger(event, ...args);
			}
			this.el.addEventListener(event, listener);
			this.events[event].listener = listener;
		}
	}

	/**
	 * Adds removeEventListener to el property.
	 * @param {string} [event]
	 * @param {function} [handler]
	 * @param {boolean} [once]
	 * @param {Eventful} [owner]
	 */
	off(event, handler, once, owner) {
		const events = (() => {
			if (event) {
				if (this.events[event]) {
					return { [event]: this.events[event] };
				}
				return {};
			}
			return { ...this.events };
		})();

		super.off(event, handler, once, owner)

		for (const key in events) {
			if (!this.events[key]) {
				const listener = events[key].listener;
				this.el.removeEventListener(event, listener);
			}
		}
	}
}
