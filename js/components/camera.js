import { PerspectiveCamera } from '../lib/build/three.module.js'

export function createCamera() {
	const camera = new PerspectiveCamera(
		90, // fov
		window.innerWidth / window.innerHeight, // aspect ratio
		0.1, // near clipping plane
		1000, // far clipping plane
	);

	camera.position.set(0, 2, 10);

	return camera
}

