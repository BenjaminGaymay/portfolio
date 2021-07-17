const shaders = {
	waves: {
		fragmentPath: '/assets/shaders/waves/fragment.glsl',
		vertexPath: '/assets/shaders/waves/vertex.glsl',
		object: null
	}
};

export function loadShader(key) {
	if (!shaders[key]) return null;
	return shaders[key].object;
}

export async function loadShaders() {
	await Promise.all(
		Object.keys(shaders).map(
			e =>
				new Promise(async resolve => {
					if (shaders[e].fragmentPath.match(/\.glsl$/) && shaders[e].vertexPath.match(/\.glsl$/)) {
						const response = await Promise.all([
							fetch(shaders[e].fragmentPath),
							fetch(shaders[e].vertexPath)
						]);
						const text = await Promise.all([response[0].text(), response[1].text()]);
						shaders[e].object = { fragment: text[0], vertex: text[1] };
						resolve();
					}
				})
		)
	);

	return shaders;
}
