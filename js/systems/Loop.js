import { Clock, Box3, Box3Helper } from '../lib/build/three.module.js';

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
	}

	start() {
		this.renderer.setAnimationLoop(() => {
			this.tick();
			this.renderer.render(this.scene, this.camera);

			if (this.stats) this.stats.update();
		});
	}

	stop() {
		this.renderer.setAnimationLoop(null);
	}

	tick() {
		const delta = clock.getDelta();

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
				const entityBox = new Box3().setFromObject(entity.group);
				const objectBox = new Box3().setFromObject(object.group);

				if (entityBox != objectBox && entityBox.intersectsBox(objectBox)) {
					object.hit(entity.damages, entity.constructor.name);
					entity.hit(object.damages, object.constructor.name);
				}

				// if (entity.group.geometry) {
				//   console.log('aaa')
				//   for (let vertexIndex = 0; vertexIndex < entity.group.geometry.vertices.length; vertexIndex++) {
				//     var localVertex = entity.group.geometry.vertices[vertexIndex].clone();
				//     var globalVertex = entity.group.matrix.multiplyVector3(localVertex);
				//     var directionVector = globalVertex.subSelf(entity.group.position);

				//     var ray = new THREE.Ray(entity.group.position, directionVector.clone().normalize());
				//     var collisionResults = ray.intersectObjects([object.group]);
				//     if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
				//       console.log('HIT nouveau')

				//       // a collision occurred... do something...
				//     }
				//   }
				// }
			}
		}
	}

	handleEvents(delta) {
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
