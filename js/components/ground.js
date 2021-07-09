import { Mesh, MeshBasicMaterial, PlaneGeometry } from '../lib/build/three.module.js';

export function createGround() {
	const floor = new Mesh(
		new PlaneGeometry(100, 50, 25, 25),
		new MeshBasicMaterial({ color: 0xffff00, wireframe: true })
	);
	floor.rotation.x -= Math.PI / 2;
	floor.position.x = 0;
	floor.position.y = 0;
	floor.position.z = 0;

	return floor;
}
