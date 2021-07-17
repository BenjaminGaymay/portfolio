import { WebGLRenderer } from '../lib/build/three.module.js';

export function createRenderer() {
	const renderer = new WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);

	renderer.physicallyCorrectLights = true;

	return renderer;
}
