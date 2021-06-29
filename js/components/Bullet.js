import { Mesh, SphereGeometry, MeshBasicMaterial } from '../lib/build/three.module.js'
import { UpdatableObject } from './UpdatableObject.js'

export class LinearBullet extends UpdatableObject {
	constructor({ x, y, z }, direction) {
		super()

		this.life = 200
		this.damages = 100
		this.collision = ['Monster']

		this.group = new Mesh(new SphereGeometry(0.1, 32, 32), new MeshBasicMaterial({ color: 0xffff00 }));
		this.group.position.x = x
		this.group.position.y = y
		this.group.position.z = z

		this.direction = direction
		this.speed = 150
	}

	tick(delta) {
		this.group.position.z -= Math.sin(this.direction) * this.speed * delta;
		this.group.position.x += Math.cos(this.direction) * this.speed * delta;

		this.life -= 1 * delta * 100
	}
}

export class MLinearBullet extends LinearBullet {
	constructor({ x, y, z }, direction) {
		super({ x, y, z }, direction)

		this.collision = ['Player']
		// this.direction = -1
	}
}