/**
 * Class for objects with event management properties and methods.
 */
class Eventful {

	/**
	 * Sets the id and initialize the events and listeningTo properties.
	 */
	constructor() {
		// this.id = this.constructor.getId();
		this.id = Eventful.getId();
		this.events = {};
		this.listeningTo = {};
	}

	/**
	 * Add an event handler.
	 * @param {string} event
	 * @param {function} handler
	 * @param {boolean} [once]
	 * @param {Eventful} [owner]
	 */
	on(event, handler, once, owner) {
		if (!this.events[event]) {
			this.events[event] = { handlers: [] };
		}

		const item = { handler, once, owner };

		this.events[event].handlers.push(item);

		if (owner) {
			if (!owner.listeningTo[this.id]) {
				owner.listeningTo[this.id] = { other: this, handlers: [] };
			}

			owner.listeningTo[this.id].handlers.push(item);
		}
	}

	/**
	 * Removes zero or more event handlers.
	 * @param {string} [event]
	 * @param {function} [handler]
	 * @param {boolean} [once]
	 * @param {Eventful} [owner]
	 */
	off(event, handler, once, owner) {
		const process = (handlers) => {
			let index = 0;
			while (index < handlers.length) {
				const item = handlers[index];
				if ((handler == null || handler === item.handler)
					&& (once == null || once === item.once)
					&& (owner == null || owner === item.owner)) {

					handlers.splice(index, 1);

					// this.constructor.removeListeningTo(item, this.id);
					Eventful.removeListeningTo(item, this.id);

					if (event != null && handler != null) {
						return;
					}
				} else {
					index++;
				}
			}
		}

		if (event == null) {
			for (const key in this.events) {
				const handlers = this.events[key].handlers;
				process(handlers);
			}
		} else if (this.events[event]) {
			const handlers = this.events[event].handlers;
			process(handlers);
		}
	}

	/**
	 * Trigger zero or more event handlers. Once event handlers are removed.
	 * @param {string} event
	 * @param  {...any} [args]
	 */
	trigger(event, ...args) {
		if (this.events[event]) {
			const handlers = [...this.events[event].handlers];

			let index = 0;
			while (index < handlers.length) {
				const item = handlers[index];

				const context = item.owner ? item.owner : this;
				item.handler.call(context, ...args);

				if (item.once) {
					handlers.splice(index, 1);

					// this.constructor.removeListeningTo(item, this.id);
					Eventful.removeListeningTo(item, this.id);
				} else {
					index++;
				}
			}

			if (handlers.length === 0) {
				delete this.events[event];
			} else {
				this.events[event].handlers = handlers;
			}
		}
	}

	/**
	 * Add an event handler on another Eventful.
	 * @param {Eventful} other
	 * @param {string} event
	 * @param {function} handler
	 * @param {boolean} [once]
	 */
	listenTo(other, event, handler, once) {
		other.on(event, handler, once, this);
	}

	/**
	 * Removes zero or more event handlers on another Eventful.
	 * @param {Eventful} [other]
	 * @param {string} [event]
	 * @param {function} [handler]
	 * @param {boolean} [once]
	 */
	stopListeningTo(other, event, handler, once) {
		if (other) {
			other.off(event, handler, once, this);
		} else {
			for (const key in this.listeningTo) {
				const other = this.listeningTo[key].other;
				other.off(event, handler, once, this);
			}
		}
	}

	/**
	 * Remove all event handlers associated with the Eventful.
	 */
	terminate() {
		this.off();
		this.stopListeningTo();
	}

	/**
	 * Generate a unique ID.
	 * @returns {number}
	 */
	static getId() {
		if (this.idCounter == null) {
			this.idCounter = 0;
		}

		return this.idCounter++;
	}

	/**
	 * Common function for removing a listening to item.
	 * @param {Object} handler
	 * @param {number} id
	 */
	static removeListeningTo(handler, id) {
		if (handler.owner) {
			if (handler.owner.listeningTo[id]) {
				const index = handler.owner.listeningTo[id].handlers.indexOf(handler);
				if (index !== -1) {
					handler.owner.listeningTo[id].handlers.splice(index, 1);
					if (handler.owner.listeningTo[id].handlers.length === 0) {
						delete handler.owner.listeningTo[id];
					}
				}
			}
		}
	}
}
