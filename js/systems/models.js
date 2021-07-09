import { GLTFLoader } from '../lib/jsm/loaders/GLTFLoader.js';

const models = {
	XWing: {
		path: '../../../assets/models/X-WING.glb',
		object: null
	}
};

export function loadModel(key) {
	if (!models[key]) return null;
	return models[key].object.scene.clone();
}

// function matchScene()

export async function loadModels() {
	const GLTF = new GLTFLoader();

	await Promise.all(
		Object.keys(models).map(
			e =>
				new Promise(resolve => {
					if (models[e].path.match(/\.(glb|gltf)$/)) {
						GLTF.load(
							models[e].path,
							gltf => {
								models[e].object = gltf;
								resolve();
							},
							undefined,
							resolve
						);
					}
				})
		)
	);

	return models;
}
