import { Mesh, SphereGeometry, MeshBasicMaterial, Group, Vector3, Quaternion } from '../lib/build/three.module.js';
import { UpdatableEntity } from './UpdatableEntity.js';

import { loadModel } from '../systems/models.js';

export class Monster extends UpdatableEntity {
	constructor() {
		super();

		this.life = 1000;
		this.damages = 1000;

		this.model = loadModel('XWing');
		// this.model.rotation.y = -Math.PI / 2
		this.group.add(this.model);

		// this.group.rotation.y = -Math.PI / 2

		this.group.lookAt(new Vector3(0, 0, 1));

		this.group.position.x = 0;
		this.group.position.y = 1;
		this.group.position.z = 0;

		// this.group = new Mesh(new SphereGeometry(2, 32, 32), new MeshBasicMaterial({ color: 0xff00ff }));
		// this.group.position.x = 0
		// this.group.position.y = 1.8
		// this.group.position.z = 0

		this.speed = 0;
		this.mSpeed = 20;
		this.strafeDir = 1;
		this.direction = this.group.rotation.y - Math.PI / 2;

		this.counter = 0;
	}

	// hit(damages) {
	// 	this.life -= damages
	// this.group.material.color.set(0xFFB6C1)

	//setTimeout(() => this.group.material.color.set(0xff00ff), 1000)
	// }

	moveRight(delta) {
		// this.model.rotation.z += 0.0025
		this.group.position.x += this.mSpeed * delta;
	}

	moveLeft(delta) {
		// this.model.rotation.z -= 0.0025
		this.group.position.x -= this.mSpeed * delta;
	}

	moveForward(delta) {
		if (this.speed < this.mSpeed) this.speed += 1;
		// this.group.position.z -= this.mSpeed * delta;
	}

	moveBackward(delta) {
		if (this.speed > -this.mSpeed / 2) this.speed -= 0.5;
		// this.group.position.z += this.mSpeed * delta;
	}

	regularShoot() {
		const a = this.group.position.clone();

		const br = {
			x:
				a.x +
				(Math.cos(this.model.rotation.x) * 2.13 - Math.sin(this.model.rotation.x) * 0.7) *
					Math.sin(this.direction),
			y: a.y - (Math.sin(this.model.rotation.x) * 2.13 + Math.cos(this.model.rotation.x) * 0.7),
			z: a.z + 2.13 * Math.cos(this.direction)
		};

		const tr = {
			x:
				a.x +
				(Math.cos(this.model.rotation.x) * 2.13 + Math.sin(this.model.rotation.x) * 0.7) *
					Math.sin(this.direction),
			y: a.y - (Math.sin(this.model.rotation.x) * 2.13 - Math.cos(this.model.rotation.x) * 0.7),
			z: a.z + 2.13 * Math.cos(this.direction)
		};

		const bl = {
			x:
				a.x -
				(Math.cos(this.model.rotation.x) * 2.13 + Math.sin(this.model.rotation.x) * 0.7) *
					Math.sin(this.direction),
			y: a.y + (Math.sin(this.model.rotation.x) * 2.13 - Math.cos(this.model.rotation.x) * 0.7),
			z:
				a.z -
				(Math.cos(this.model.rotation.x) * 2.13 + Math.sin(this.model.rotation.x) * 0.7) *
					Math.cos(this.direction)
		};

		const tl = {
			x:
				a.x -
				(Math.cos(this.model.rotation.x) * 2.13 - Math.sin(this.model.rotation.x) * 0.7) *
					Math.sin(this.direction),
			y: a.y + (Math.sin(this.model.rotation.x) * 2.13 + Math.cos(this.model.rotation.x) * 0.7),
			z:
				a.z -
				(Math.cos(this.model.rotation.x) * 2.13 - Math.sin(this.model.rotation.x) * 0.7) *
					Math.cos(this.direction)
		};

		this.events.add(
			JSON.stringify({ name: 'world.invokeMonsterBullet', params: { position: br, direction: this.direction } })
		);
		this.events.add(
			JSON.stringify({ name: 'world.invokeMonsterBullet', params: { position: tr, direction: this.direction } })
		);
		this.events.add(
			JSON.stringify({ name: 'world.invokeMonsterBullet', params: { position: bl, direction: this.direction } })
		);
		this.events.add(
			JSON.stringify({ name: 'world.invokeMonsterBullet', params: { position: tl, direction: this.direction } })
		);
	}

	tick(delta) {
		if (this.group.position.x >= 30 || this.group.position.x <= -30) this.strafeDir *= -1;
		this.strafeDir > 0 ? this.moveLeft(delta) : this.moveRight(delta);

		if (Math.random() * 100 < 1) this.regularShoot();
	}
}

export class FollowingMonster extends Monster {
	constructor(target) {
		super();

		this.model.rotation.y = 0;
		this.target = target;
	}

	tick(delta) {
		// var direction = new Vector3();
		// direction.subVectors(this.group.position, this.target.group.position);
		// var qrot = new Quaternion();
		// qrot.setFromUnitVectors(this.group.position, this.target.group.position); // (unit vectors)
		logs('distance', 'distance: ' + this.group.position.distanceTo(this.target.group.position));

		const distance = this.group.position.distanceTo(this.target.group.position);
		if (distance > 10) this.moveForward(delta);
		else this.speed = 0;

		this.group.lookAt(this.target.group.position); //= this.group.position.angleTo(this.target.group.position)
		this.direction = this.group.rotation.y + -Math.PI / 2;
		// this.direction = this.group.rotation.y // += Math.PI /
		// this.group.rotation.y = Math.PI / 2

		this.group.position.z += Math.cos(this.group.rotation.z) * this.speed * delta;
		this.group.position.x += Math.sin(this.group.rotation.y) * this.speed * delta;

		if (Math.random() * 100 < 1) this.regularShoot();

		// this.group.position.y += this.group.rotation.y * this.speed * delta;

		// if (this.group.position.x >= 30 || this.group.position.x <= -30) this.strafeDir *= -1
		// this.strafeDir > 0 ? this.moveLeft(delta) : this.moveRight(delta)

		// if (Math.random() * 100 < 1) this.regularShoot()
	}
}
