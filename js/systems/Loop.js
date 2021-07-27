import { Player } from '../components/Player.js';
import { RingPlanet, Sphere } from '../components/Sphere.js';
import {
	Clock,
	Box3,
	Box3Helper,
	MeshBasicMaterial,
	SphereGeometry,
	Mesh,
	Vector3
} from '../lib/build/three.module.js';

const clock = new Clock();

class Loop {
	constructor(camera, scene, renderer, stats, controls, world) {
		this.camera = camera;
		this.scene = scene;
		this.renderer = renderer;
		this.stats = stats;
		this.controls = controls;
		this.updatables = [];

		this.world = world;
		this.paused = false;
	}

	start() {
		this.renderer.setAnimationLoop(() => {
			this.tick();
			this.renderer.render(this.scene, this.camera);

			if (this.stats) this.stats.update();
		});
	}

	restart() {
		document.title = 'Portfolio';

		// setInterval(() => (this.paused = false), 1000);
	}

	pause() {
		document.title = 'PAUSE - Portfolio';
		this.paused = true;
		this.controls.events.clear();
	}

	stop() {
		this.controls.events.clear();
		this.renderer.setAnimationLoop(null);
	}

	tick() {
		const delta = clock.getDelta();

		if (delta > 0.5) return;

		this.handleEvents(delta);

		for (const i in this.updatables) {
			this.updatables[i].events = this.controls.events;
			this.updatables[i].tick(delta);

			// if (this.updatables[i].constructor.name.includes('Bullet') || this.updatables[i].constructor.name === 'Player')
			this.checkCollision(this.updatables[i]);

			if (this.updatables[i].life !== undefined && this.updatables[i].life <= 0) {
				if (this.updatables[i].constructor.name === 'Player') {
					setTimeout(() => this.world.invokePlayer(), 2000);
				}

				this.scene.remove(this.updatables[i].group);
				delete this.updatables[i];
			}
		}

		this.updatables = this.updatables.filter(Boolean);
	}

	checkCollision(entity) {
		for (const object of this.updatables) {
			if (object && object.constructor && entity.hitEntity && entity.hitEntity(object.constructor.name)) {
				let entityBox;
				const objectBox = new Box3().setFromObject(object.group);

				if (entity instanceof Sphere) {
					const collisionDot = entity.group.position
						.clone()
						.add(
							object.group.position
								.clone()
								.sub(entity.group.position)
								.normalize()
								.multiplyScalar(entity.size)
						);

					entityBox = new Box3().setFromCenterAndSize(collisionDot, new Vector3(1, 1, 1));
				} else entityBox = new Box3().setFromObject(entity.group);

				if (entityBox != objectBox && entityBox.intersectsBox(objectBox)) {
					object.hit(entity.damages, entity);
					entity.hit(object.damages, object);
				}
			}
		}
	}

	handleEvents(delta) {
		if (delta > 0.1) logs('delta', 'delta: ' + delta);
		for (const name of this.controls.events) {
			const event = JSON.parse(name);

			if (event.name.includes('world'))
				this.world[event.name.split('.')[1]]({ name, delta, params: event.params });
			if (event.name.includes('player'))
				this.world.player[event.name.split('.')[1]]({ name, delta, params: event.params });
		}
	}
}

export { Loop };
