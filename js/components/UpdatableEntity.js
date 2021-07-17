import { Group } from '../lib/build/three.module.js';

export class UpdatableEntity {
	constructor() {
		this.life = 100;
		this.damages = 0;

		this.collision = [];
		this.events = null;

		this.group = new Group();
	}

	hit(damages) {
		this.life -= damages;
	}

	hitEntity(entity) {
		return this.collision.includes(entity);
	}

	tick() {}
}
