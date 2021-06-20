/**
 * Class for objects with data management properties and methods.
 */
class Model extends Eventful {

	/**
	 * Initialize the data property.
	 */
	constructor(data = {}) {
		super();

		this.data = data;
	}

	/**
	 * Sets a value for a key.
	 * @param {number|string} key
	 * @param {any} value
	 */
	set(key, value) {
		if (this.data[key] !== value) {
			if (value === undefined) {
				delete this.data[key];
			} else {
				this.data[key] = value;
			}

			this.trigger('change', key);
			this.trigger(`change:${key}`);
		}
	}

	/**
	 * Unsets a value for a key.
	 * @param {number|string} key
	 */
	unset(key) {
		return this.set(key);
	}

	/**
	 * Returns the value for a key.
	 * @param {number|string} key
	 * @returns {any}
	 */
	get(key) {
		return this.data[key];
	}

	/**
	 * Use object or array method on data.
	 * @param {string} method
	 * @param {...any} [args]
	 */
	useMethod(method, ...args) {
		const stringified = JSON.stringify(this.data);

		let returnValue;

		if (Array.isArray(this.data)) {
			returnValue = Array.prototype[method].call(this.data, ...args);
		} else {
			returnValue = Object.prototype[method].call(this.data, ...args);
		}

		if (stringified !== JSON.stringify(this.data)) {
			this.trigger('change', key);
		}

		return returnValue;
	}
}
