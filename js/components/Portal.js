import {
	Group,
	Mesh,
	MeshBasicMaterial,
	TorusGeometry,
	CircleGeometry,
	DoubleSide,
	ShaderMaterial,
	PlaneGeometry,
	Color,
	MeshStandardMaterial,
	Vector3
} from '../lib/build/three.module.js';
import { UpdatableEntity } from './UpdatableEntity.js';

import { loadShader } from '../systems/shaders.js';

// import vertexShader from '../../assets/shaders/waves/vertex.glsl'
// import fragmentShader from '../../assets/shaders/waves/fragment.glsl'

export class Portal extends UpdatableEntity {
	constructor(position = { x: 0, y: 0, z: 0 }) {
		super();

		this.life = undefined;

		const torus = new Mesh(
			new TorusGeometry(15, 2, 15, 100),
			new MeshStandardMaterial({ color: 0x454545, emissive: 0x454545, emissiveIntensity: 0.7 })
		);

		// const wavesShader = loadShader('waves');

		// this.startDate = Date.now();

		// this.uniforms = {
		// 	colorB: { type: 'vec3', value: new Color(0xff0000) },
		// 	colorA: { type: 'vec3', value: new Color(0x0000ff) },
		// 	time: { type: 'f', value: 1.0 }
		// };

		// const material = new ShaderMaterial({
		// 	vertexShader: wavesShader.vertex,
		// 	fragmentShader: wavesShader.fragment, // vertexShader,
		// 	// fragmentShader,
		// 	uniforms: this.uniforms,
		// 	side: DoubleSide
		// 	// {
		// 	// 	uTime: { value: 0.0 }
		// 	// },
		// 	// wireframe: true,
		// });

		const circle = new Mesh(
			// new PlaneGeometry(30, 30, 16, 16),
			new CircleGeometry(15, 32),
			new MeshStandardMaterial({ color: 0x006699, side: DoubleSide, emissive: 0x006699, emissiveIntensity: 0.5 })
			// material
		);

		this.group.position.x = position.x;
		this.group.position.y = position.y;
		this.group.position.z = position.z;

		// circle.position.x = torus.position.x = position.x;
		// circle.position.y = torus.position.y = position.y;
		// circle.position.z = torus.position.z = position.z;

		this.group.rotation.y = Math.random() * Math.PI;

		this.group.add(torus);
		this.group.add(circle);
	}

	hit() {}

	tick() {
		// const elapsedMilliseconds = Date.now() - this.startDate;
		// const elapsedSeconds = elapsedMilliseconds / 1000;
		// this.uniforms.time.value = 60 * elapsedSeconds;
	}
}

export class LinkPortal extends Portal {
	constructor(position, url) {
		super(position);

		this.url = url;
		this.collision = ['Player'];
	}

	hit() {
		window.open(this.url, '_blank');
	}
}
