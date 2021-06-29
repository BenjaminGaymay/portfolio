export class UpdatableObject {
	constructor() {
		this.life = 100
		this.damages = 0

		this.collision = []
		this.events = null
	}

	hit(damages) {
		this.life -= damages
		console.log('HIT ' + this.constructor.name)
	}

	hitEntity(entity) {
		return this.collision.includes(entity)
	}

	tick() { }
}