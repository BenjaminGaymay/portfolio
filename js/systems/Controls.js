export class Controls {
	constructor(state) {
		this.state = state;

		this.mapping = {
			demo: {
				81: 'player.moveLeft',
				37: 'player.moveLeft',
				68: 'player.moveRight',
				39: 'player.moveRight',
				90: 'player.moveForward',
				38: 'player.moveForward',
				83: 'player.moveBackward',
				40: 'player.moveBackward',
				32: 'player.regularShoot',
				mouse_1: 'player.regularShoot',
				mouse_3: 'player.lookBehind'
			}
		};

		this.events = new Set();

		window.addEventListener('keydown', e => this.keyDown(e));
		window.addEventListener('keyup', e => this.keyUp(e));
		window.addEventListener('mousedown', e => this.mouseDown(e));
		window.addEventListener('mouseup', e => this.mouseUp(e));
	}

	keyDown(event) {
		event.preventDefault;
		console.log(event.keyCode);
		if (this.mapping[this.state][event.keyCode])
			this.events.add(JSON.stringify({ name: this.mapping[this.state][event.keyCode] }));
	}

	keyUp(event) {
		event.preventDefault;
		if (this.mapping[this.state][event.keyCode])
			this.events.delete(JSON.stringify({ name: this.mapping[this.state][event.keyCode] }));
	}

	mouseDown(event) {
		event.preventDefault;
		if (this.mapping[this.state][`mouse_${event.which}`])
			this.events.add(JSON.stringify({ name: this.mapping[this.state][`mouse_${event.which}`] }));
	}

	mouseUp(event) {
		event.preventDefault;
		if (this.mapping[this.state][`mouse_${event.which}`])
			this.events.delete(JSON.stringify({ name: this.mapping[this.state][`mouse_${event.which}`] }));
	}
}
