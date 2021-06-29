import { SphereGeometry, MeshBasicMaterial, Mesh, Group } from '../lib/build/three.module.js';

export class Background {
	constructor() {
		this.stars = []
		this.group = new Group()

		const geometry = new SphereGeometry(0.5, 32, 32)
		const material = new MeshBasicMaterial({ color: 0xffffff });

		for (let z = -2000; z < 2000; z += 10) {
			const sphere = new Mesh(geometry, material)

			sphere.position.x = Math.random() * 1000 - 500;
			sphere.position.y = Math.random() * 1000 - 500;
			sphere.position.z = z;

			sphere.scale.x = sphere.scale.y = 2;

			this.group.add(sphere);
			this.stars.push(sphere);
		}
	}

	tick(delta) {
		this.group.rotation.z += delta * 0.005

		this.stars.map(e => {
			if (e.position.z > 1000) e.position.z -= 2000
			return e
		})
	}
}