import {
	SphereGeometry,
	MeshBasicMaterial,
	Mesh,
	Group,
	BoxGeometry,
	BackSide,
	Texture
} from '../lib/build/three.module.js';

const getRandomStarField = (numberOfStars, width, height) => {
	const canvas = document.createElement('CANVAS');

	canvas.width = width;
	canvas.height = height;

	let ctx = canvas.getContext('2d');

	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, width, height);

	for (let i = 0; i < numberOfStars; ++i) {
		const radius = Math.random() * 3;
		const x = Math.floor(Math.random() * width);
		const y = Math.floor(Math.random() * height);

		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
		ctx.fillStyle = 'white';
		ctx.fill();
	}

	let texture = new Texture(canvas);
	texture.needsUpdate = true;
	return texture;
};

export class Background {
	constructor() {
		// this.stars = [];
		// this.group = new Group();
		// const geometry = new SphereGeometry(0.5, 32, 32);
		// const material = new MeshBasicMaterial({ color: 0xffffff });

		// for (let z = -2000; z < 2000; z += 10) {
		// 	const sphere = new Mesh(geometry, material);

		// 	sphere.position.x = Math.random() * 1000 - 500;
		// 	sphere.position.y = Math.random() * 1000 - 500;
		// 	sphere.position.z = z;

		// 	sphere.scale.x = sphere.scale.y = 2;

		// 	this.group.add(sphere);
		// 	this.stars.push(sphere);
		// }

		this.group = new Mesh(
			new BoxGeometry(10000, 10000, 10000),
			new MeshBasicMaterial({
				map: getRandomStarField(600, 2048, 2048),
				side: BackSide
			})
		);

		// this.group.add(galaxy);
	}

	tick(delta) {
		this.group.rotation.z += delta * 0.002;
		// this.stars.map(e => {
		// 	if (e.position.z > 1000) e.position.z -= 2000;
		// 	return e;
		// });
	}
}
