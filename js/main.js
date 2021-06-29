import { World } from './World.js'
import { loadModels } from './systems/models.js'

async function main() {
	const container = document.querySelector('#scene-container');

	const models = await loadModels()

	console.log(models)

	const world = new World(container);

	world.render();
	world.start();
}

window.onload = main;
