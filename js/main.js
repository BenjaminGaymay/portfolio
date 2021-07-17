import { World } from './World.js';
import { loadModels } from './systems/models.js';
import { loadShaders } from './systems/shaders.js';

async function main() {
	const container = document.querySelector('#scene-container');

	const models = await loadModels();
	const shaders = await loadShaders();

	console.log(models);
	console.log(shaders);

	const world = new World(container);

	world.render();
	world.start();

	window.onblur = () => world.pause();
	document.addEventListener('visibilitychange', () => (document.hidden ? world.pause() : undefined));
}

window.onload = main;
