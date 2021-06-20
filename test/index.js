class SectionView extends View {
	render(model) {
		if (model) {
			if (model.get('random') && model.get('random').get('number')) {
				this.el.innerHTML = `
					<p>${model.get('text')}</p>
					<p>${model.get('random').get('number')}</p>
				`;
			} else {
				this.el.innerHTML = `<p>${model.get('text')}</p>`;
			}
		} else {
			this.el.innerHTML = '';
		}
	}
}

class Controller extends Eventful {
	constructor() {
		super();

		this.model = null;

		this.section = new SectionView();

		this.listenTo(this.section, 'click', () => {
			if (this.model) {
				const number =  Math.floor(Math.random() * 1000);
				const random = this.model.get('random');
				if (random) {
					random.set('number', number);
				} else {
					const newRandom = new Model({ number });
					this.model.set('random', newRandom);
				}
			}
		});
	}

	setModel(model) {
		if (this.model) {
			this.model.terminate();
		}

		this.model = model;

		this.listenTo(this.model, 'change', () => {
			this.section.render(this.model);
		});

		this.section.render(this.model);
	}

	appendTo(el) {
		el.append(this.section.el);
	}

	terminate() {
		if (this.model) {
			this.model.terminate();
		}

		this.section.terminate();
	}
}

////////////////////////////////////////////////////////////////////////////////
// MAIN
////////////////////////////////////////////////////////////////////////////////

const model = new Model({ text: 'HELLO WORLD' });

const controller = new Controller();
controller.appendTo(document.body);
controller.setModel(model);
// controller.terminate();
