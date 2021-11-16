import {
	Group,
	Mesh,
	SphereGeometry,
	MeshBasicMaterial,
	PointLight,
	Box3,
	Box3Helper,
	BoxHelper,
	RingGeometry,
	DoubleSide,
	MeshStandardMaterial,
	Vector3,
	Matrix4,
	ShaderMaterial,
	Color
} from '../lib/build/three.module.js';

import { loadShader } from '../systems/shaders.js';
import { UpdatableEntity } from './UpdatableEntity.js';

export class Sphere extends UpdatableEntity {
	constructor() {
		super();

		this.life = undefined;
		this.damages = 99999;
	}
}

export class Star extends Sphere {
	constructor({ x, y, z }, size = 10, color = 0xffffff, intensity = 1, speed = 0.005) {
		super();
		this.collision = ['Player', 'MBullet', 'LinearBullet'];

		this.defaultPos = {
			x,
			y,
			z
		};

		this.rotation = 0;
		this.speed = speed;

		const distance = size * 100 * intensity;
		const decay = intensity / size;

		const pointLight1 = new PointLight(color, intensity, distance, decay);
		pointLight1.position.set(size, 0, 0);

		const pointLight2 = new PointLight(color, intensity, distance, decay);
		pointLight2.position.set(size, 0, 0);

		const pointLight3 = new PointLight(color, intensity, distance, decay);
		pointLight3.position.set(0, size, 0);

		const pointLight4 = new PointLight(color, intensity, distance, decay);
		pointLight4.position.set(0, size, 0);

		const pointLight5 = new PointLight(color, intensity, distance, decay);
		pointLight5.position.set(0, 0, size);

		const pointLight6 = new PointLight(color, intensity, distance, decay);
		pointLight6.position.set(0, 0, size);

		const { vertexShader, fragmentShader } = loadShader('star');

		this.material = new ShaderMaterial({
			vertexShader,
			fragmentShader,
			side: DoubleSide,
			uniforms: {
				color: { type: 'vec3', value: new Color(color) },
				time: { value: Math.random() }
			}
			// wireframe: true,
		});

		this.group.add(new Mesh(new SphereGeometry(size, 64, 64), this.material));
		// new MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.7 })

		this.group.add(pointLight1);
		this.group.add(pointLight2);
		this.group.add(pointLight3);
		this.group.add(pointLight4);
		this.group.add(pointLight5);
		this.group.add(pointLight6);

		this.calcPosition();

		this.rotationSpeed = Math.random() * speed + 0.005;
		this.size = size;

		// const helper = new Box3Helper(new Box3().setFromObject(this.group), color);
		// this.group.add(helper);
	}

	calcPosition() {
		this.group.position.x =
			Math.sin(this.rotation) * this.defaultPos.x + Math.sin(this.rotation) * this.defaultPos.z;
		this.group.position.y = Math.cos(this.rotation) * this.defaultPos.y;
		this.group.position.z =
			Math.cos(this.rotation) * this.defaultPos.z + Math.cos(this.rotation) * this.defaultPos.x;
	}

	tick(delta) {
		this.rotation += this.speed * delta;
		this.calcPosition();
		this.group.rotation.y += this.rotationSpeed * delta;

		this.material.uniforms.time.value += delta;
	}
}

export class Planet extends Star {
	constructor({ x, y, z }, size, color, speed) {
		super({ x, y, z }, size, color, 0.5, speed);
	}

	tick(delta) {
		this.rotation += this.speed * delta;
		this.calcPosition();
		this.group.rotation.y += this.rotationSpeed * delta;

		// this.material.uniforms.time.value += delta;
	}
}

export class RingPlanet extends Planet {
	constructor({ x, y, z }, size, color, speed, ring_size, ring_color, rotation = Math.PI / 2) {
		super({ x, y, z }, size, color, speed);

		const ring = new Mesh(
			new RingGeometry(size + (ring_size - size) / 3, ring_size, 64),
			new MeshStandardMaterial({ color: ring_color || color, side: DoubleSide })
		);

		ring.rotation.x = rotation;
		this.group.add(ring);
	}
}
