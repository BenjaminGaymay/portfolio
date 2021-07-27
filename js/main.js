import { World } from './World.js';
import { loadModels } from './systems/models.js';
import { loadShaders } from './systems/shaders.js';
import { loadImages } from './systems/images.js';

async function main() {
	const container = document.querySelector('#scene-container');

	const models = await loadModels();
	const shaders = await loadShaders();
	const images = await loadImages();

	console.log(models);
	console.log(shaders);
	console.log(images);

	const world = new World(container);

	world.render();
	world.start();

	window.onblur = () => world.pause();
	window.onfocus = () => world.restart();
	document.addEventListener('visibilitychange', () => (document.hidden ? world.pause() : world.restart()));
}

window.onload = main;
