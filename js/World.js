import { createRenderer } from './systems/renderer.js';
import { createStats } from './systems/stats.js';
import { createCamera } from './components/camera.js';
import { createScene } from './components/scene.js';
import { createGround } from './components/ground.js';

import { Loop } from './systems/Loop.js';
import { Controls } from './systems/Controls.js';

import { Background } from './components/Background.js';
import { Player } from './components/Player.js';
import { LinearBullet, MLinearBullet } from './components/Bullet.js';
import { FollowingMonster, Monster } from './components/Monster.js';
import { LinkPortal } from './components/Portal.js';
import { Star, Planet, RingPlanet } from './components/Sphere.js';

import { AmbientLight, PointLight, Vector3 } from './lib/build/three.module.js';

let camera;
let renderer;
let scene;
let loop;
let stats;
let controls;

export class World {
	constructor(container) {
		this.state = 'demo';

		camera = createCamera();
		renderer = createRenderer();
		scene = createScene();
		stats = createStats();

		controls = new Controls(this.state);
		loop = new Loop(camera, scene, renderer, stats, controls, this);

		container.append(renderer.domElement);
		container.append(stats.domElement);

		// const ground = createGround()
		// scene.add(ground);

		this.invokePlayer();

		const background = new Background();
		loop.updatables.push(background);
		scene.add(background.group);

		const portal = new LinkPortal(new Vector3(-350, 0, 1700), 'https://www.google.fr');
		loop.updatables.push(portal);
		scene.add(portal.group);

		// const light = new AmbientLight(0xffffff, 1); // soft white light
		// scene.add(light);

		// const moon = new Star(new Vector3(50, 10, -150), 10, 0xdddddd);
		// loop.updatables.push(moon);
		// scene.add(moon.group);

		const sun = new Star(new Vector3(0, 0, 0), 300, 0xffff66);
		loop.updatables.push(sun);
		scene.add(sun.group);

		const bigBlue = new Planet(new Vector3(0, -100, 1000), 20, 0x006090, 0.02);
		loop.updatables.push(bigBlue);
		scene.add(bigBlue.group);

		const bigGreen = new Planet(new Vector3(60, 50, -3000), 20, 0x009050, 0.01);
		loop.updatables.push(bigGreen);
		scene.add(bigGreen.group);

		const bigOrange = new RingPlanet(new Vector3(-1000, 0, 2000), 100, 0x995000, 0.01, 200, 0x804000, -Math.PI / 3);
		loop.updatables.push(bigOrange);
		scene.add(bigOrange.group);

		const ambientLight = new AmbientLight(0x505050);
		scene.add(ambientLight);

		// const pointLight = new PointLight(0xffffff, 1, 0, 0.01)
		// pointLight.position.set(0, 10, 0);

		// scene.add(pointLight)

		// this.invokeMonster()
		// setTimeout(() => this.invokeMonster(), 500)
		// setTimeout(() => this.invokeMonster(), 1500)
		// setTimeout(() => this.invokeMonster(), 2500)
	}

	updateState(state) {
		this.state = state;
		controls.state = state;
	}

	invokePlayer() {
		this.player = new Player(camera, { x: -400, y: 0, z: 1750, rotation: Math.PI / 2 });
		loop.updatables.push(this.player);

		for (let entity of loop.updatables)
			if (entity.target && entity.target.constructor.name === 'Player') entity.target = this.player;
		scene.add(this.player.group);
	}

	invokeRegularBullet({ name, params }) {
		const bullet = new LinearBullet(params.position, params.direction);
		loop.updatables.push(bullet);
		scene.add(bullet.group);

		controls.events.delete(name);
	}

	invokeMonster() {
		// const monster = new Monster()
		const monster = new FollowingMonster(this.player);
		loop.updatables.push(monster);
		scene.add(monster.group);
	}

	invokeMonsterBullet({ name, params }) {
		const bullet = new MLinearBullet(params.position, params.direction);
		loop.updatables.push(bullet);
		scene.add(bullet.group);

		controls.events.delete(name);
	}

	render() {
		renderer.render(scene, camera);
	}

	start() {
		loop.start();
	}

	restart() {
		loop.restart();
	}

	pause() {
		loop.pause();
	}

	stop() {
		loop.stop();
	}
}
