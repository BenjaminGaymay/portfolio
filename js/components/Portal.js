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
	Vector3,
	FrontSide,
	BackSide,
	MeshPhysicalMaterial
} from '../lib/build/three.module.js';
import { UpdatableEntity } from './UpdatableEntity.js';

import { loadShader } from '../systems/shaders.js';
import { loadImage } from '../systems/images.js';

// import vertexShader from '../../assets/shaders/waves/vertex.glsl'
// import fragmentShader from '../../assets/shaders/waves/fragment.glsl'

export class Portal extends UpdatableEntity {
	constructor(position = { x: 0, y: 0, z: 0 }, image = undefined) {
		super();

		this.life = undefined;

		const torus = new Mesh(
			new TorusGeometry(15, 2, 30, 100),
			new MeshStandardMaterial({
				color: 0x454545,
				emissive: 0x454545,
				emissiveIntensity: 0.7
				// roughness: 0
			})
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

		const texture = loadImage(image);

		if (texture) {
			const circleFront = new Mesh(
				new CircleGeometry(13, 32),
				new MeshBasicMaterial({
					map: texture,
					transparent: true,
					opacity: 0.8,
					side: FrontSide
				})
			);

			const circleBack = circleFront.clone();
			circleBack.rotateY(Math.PI);

			this.group.add(circleFront);
			this.group.add(circleBack);
		}

		const circle = new Mesh(
			new CircleGeometry(13, 32),
			new MeshStandardMaterial({
				transparent: true,
				opacity: 0.3,
				color: 0x006699,
				side: DoubleSide,
				emissive: 0x006699,
				emissiveIntensity: 1
			})
		);

		this.group.add(circle);
		this.group.add(torus);

		this.group.position.x = position.x;
		this.group.position.y = position.y;
		this.group.position.z = position.z;

		this.group.rotation.y = Math.random() * Math.PI;
	}

	hit() {}

	tick() {
		// const elapsedMilliseconds = Date.now() - this.startDate;
		// const elapsedSeconds = elapsedMilliseconds / 1000;
		// this.uniforms.time.value = 60 * elapsedSeconds;
	}
}

export class LinkPortal extends Portal {
	constructor(position, url, image = undefined) {
		super(position, image);

		this.url = url;
		this.collision = ['Player'];

		this.previousHit = Date.now();
		this.hitInterval = 2000;
	}

	hit() {
		if (Date.now() - this.previousHit < this.hitInterval) return;

		window.open(this.url, '_blank');
		this.previousHit = Date.now();
	}
}
