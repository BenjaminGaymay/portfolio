import { UpdatableEntity } from './UpdatableEntity.js';
import { loadModel } from '../systems/models.js';

import { Group, DirectionalLight, Box3Helper, Box3, BoxHelper } from '../lib/build/three.module.js';

const mode = 'Star wars';

export class Player extends UpdatableEntity {
	constructor(camera, position = { x: 0, y: 0, z: 500, rotation: Math.PI / 2 }) {
		super();

		this.life = 1500;
		this.damages = 500;
		this.collision = ['Monster'];

		this.camera = camera;
		this.speed = 0;
		this.mSpeed = 50;
		this.cooldown = 0;

		this.model = loadModel('XWing');
		this.model.rotation.y = Math.PI / 2;
		this.group.add(this.model);

		this.group.position.x = position.x;
		this.group.position.y = position.y;
		this.group.position.z = position.z;
		this.group.rotation.y = position.rotation;

		// const pointLight = new DirectionalLight(0xffffff)
		// pointLight.position.set(0, 1, 30)
		// this.group.add(pointLight)

		// this.jump = {
		// 	position: 0,
		// 	speed: 1.5,
		// 	maxHeight: 5,
		// 	active: false
		// }

		this.direction = this.group.rotation.y;
	}

	moveRight({ delta }) {
		this.model.rotation.x += Math.abs(this.model.rotation.x) < Math.PI / 3 ? 0.01 : 0;
		// rot en fonction du %tage de la vitesse max
		if (mode === 'Star wars') {
			this.group.rotation.y = this.direction -= (Math.abs(this.speed) > this.mSpeed / 4 ? 1 : 0.5) * delta; // produit en croix pour la viesse de rot par rapport a la vitesse
		} else if (!this.boost) this.group.position.x += this.mSpeed * delta;
	}

	moveLeft({ delta }) {
		this.model.rotation.x -= Math.abs(this.model.rotation.x) < Math.PI / 3 ? 0.01 : 0;

		if (mode === 'Star wars') {
			this.group.rotation.y = this.direction += (Math.abs(this.speed) > this.mSpeed / 4 ? 1 : 0.5) * delta;
		} else if (!this.boost) this.group.position.x -= this.mSpeed * delta;
	}

	moveForward({ delta }) {
		// if (mode === 'Star wars') {
		if (this.speed < this.mSpeed) this.speed += 1;
		// this.group.position.z -= Math.sin(this.direction) * this.speed * delta;
		// this.group.position.x += Math.cos(this.direction) * this.speed * delta;
		// } else this.speed += 1 // this.group.position.z -= this.mSpeed * delta;
	}

	moveBackward({ delta }) {
		// if (mode === 'Star wars') {
		if (this.speed > -this.mSpeed / 2) this.speed -= 0.5;
		// this.group.position.z += Math.sin(this.direction) * this.speed * 0.5 * delta;
		// this.group.position.x += -Math.cos(this.direction) * this.speed * 0.5 * delta;
		// } else this.group.position.z += this.mSpeed * delta;
	}

	// startJump() {
	// 	if (!this.jump.active) {
	// 		this.jump.position = this.jump.speed
	// 		this.jump.active = true
	// 	}
	// }

	hit(damages, entity) {
		if (!this.boost || entity === 'Star') super.hit(damages);
	}

	lookBehind() {}

	regularShoot() {
		if (this.life <= 0 || this.cooldown > 0) return;

		this.cooldown = 10;

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
			JSON.stringify({ name: 'world.invokeRegularBullet', params: { position: br, direction: this.direction } })
		);
		this.events.add(
			JSON.stringify({ name: 'world.invokeRegularBullet', params: { position: tr, direction: this.direction } })
		);
		this.events.add(
			JSON.stringify({ name: 'world.invokeRegularBullet', params: { position: bl, direction: this.direction } })
		);
		this.events.add(
			JSON.stringify({ name: 'world.invokeRegularBullet', params: { position: tl, direction: this.direction } })
		);
	}

	tick(delta) {
		if (this.cooldown > 0) this.cooldown -= 1 * delta * 100;

		// if (this.jump.active) {
		// 	this.jump.position = (this.jump.position + this.jump.speed) % 180
		// 	this.jump.active = this.jump.position !== 0

		// 	this.group.position.y = Math.sin(Math.PI / 180 * this.jump.position) * this.jump.maxHeight
		// }

		if (!this.events.has(JSON.stringify({ name: 'player.moveForward' })) && this.speed > 0)
			this.speed -= this.mSpeed * 0.01;
		else if (!this.events.has(JSON.stringify({ name: 'player.moveBackward' })) && this.speed < 0)
			this.speed += this.mSpeed * 0.005;

		// logs('rota', 'rota: ' + this.model.rotation.x)

		if (this.events.has(JSON.stringify({ name: 'player.lookBehind' }))) this.look = -1;
		else this.look = 1;

		if (this.boost) {
			// ajouter du son
			// ajouter l'hyper espace
			// faire des fct pour les animations
			// balles spéciales
			// des monstres
			// monstres qui suivent ? y a une fct pour calculer la distance entre 2 vecteur
			// ajouter du decors, asteroides ? planete ?
			// systeme de stage
			// liens vers pour le portfolio :)))))
			// mettre events en global ? (comme logs)
			// pouvoir casser les etoiles/planete, easter egg ?
			this.model.rotation.x += this.model.rotation.x > 0 ? 0.07 : -0.07;
			this.speed += this.speed > 100 ? 0 : 2;
			if (Math.abs(this.model.rotation.x) > 4 * Math.PI) {
				this.speed = 50;
				this.boost = false;
				this.model.rotation.x = 0;
			}
		}

		// logs('a', this.speed + ' ' + this.mSpeed + ' ' + this.model.rotation.x + ' ' + Math.PI / 3)
		if (!this.events.has(JSON.stringify({ name: 'player.moveRight' })) && this.model.rotation.x > 0) {
			if (this.speed >= this.mSpeed && Math.abs(this.model.rotation.x) >= Math.PI / 3) {
				this.boost = true;
			} else this.model.rotation.x -= 0.005;
		} else if (!this.events.has(JSON.stringify({ name: 'player.moveLeft' })) && this.model.rotation.x < 0) {
			if (this.speed >= this.mSpeed && Math.abs(this.model.rotation.x) >= Math.PI / 3) {
				this.boost = true;
			} else this.model.rotation.x += 0.005;
		}

		this.group.position.z -= Math.sin(this.direction) * this.speed * delta;
		this.group.position.x += Math.cos(this.direction) * this.speed * delta;

		// logs('angle', 'angle: ' + this.model.rotation.x + ' | sin: ' + Math.sin(this.model.rotation.x) + ' | cos: ' + Math.cos(this.model.rotation.x))
		// logs('dir', 'dir: ' + this.direction)

		// this.events.add(JSON.stringify({ name: 'player.regularShoot' }))
		// this.events.add(JSON.stringify({ name: 'playqer.moveLeft' }))

		// FPS
		// this.camera.position.set(this.group.position.x - 2, this.group.position.y - 0.5, this.group.position.z + 0.5 + 0.2);

		// TPS
		this.camera.position.set(
			this.group.position.x - 2.5 * Math.cos(this.direction) * this.look,
			this.group.position.y + 1.5,
			this.group.position.z + 2.5 * Math.sin(this.direction) * this.look
		);
		this.camera.lookAt(this.group.position);
		// this.camera.rotation.y += Math.PI

		logs('xpos', 'x: ' + this.group.position.x);
		logs('ypos', 'y: ' + this.group.position.y);
		logs('zpos', 'z: ' + this.group.position.z);

		if (this.boost) this.normalized = (Math.abs(this.model.rotation.x) + 24) / (24 + 24);
		else if (!this.boost && this.normalized) {
			if (this.normalized < Math.abs(this.model.rotation.x)) this.normalized = undefined;
			else this.normalized = this.normalized < 0 ? undefined : this.normalized - 0.01;
		}

		this.camera.position.z +=
			(Math.sin(this.direction) * Math.cos(Math.abs(this.normalized || this.model.rotation.x)) * 4 * this.speed) /
			100;
		this.camera.position.y += ((this.normalized || Math.abs(this.model.rotation.x)) * 1.5 * this.speed) / 100;
		this.camera.position.x -=
			(Math.cos(this.direction) * Math.cos(Math.abs(this.normalized || this.model.rotation.x)) * 4 * this.speed) /
			100;
	}
}
