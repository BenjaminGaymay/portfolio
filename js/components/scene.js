import { Scene, Color } from '../lib/build/three.module.js';

export function createScene() {
	const scene = new Scene();
	scene.background = new Color('black');

	return scene;
}
