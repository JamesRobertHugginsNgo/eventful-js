class SectionView extends View {
	render(model) {
		if (model) {
			this.el.innerHTML = `<p>${model.get('text')}</p>`;
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
				this.model.set('text', Math.floor(Math.random() * 1000))
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

const controller = new Controller();
controller.appendTo(document.body);

const model = new Model({ text: 'HELLO WORLD' });
controller.setModel(model);

controller.terminate();
