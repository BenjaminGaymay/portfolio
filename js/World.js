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

import { AmbientLight } from './lib/build/three.module.js';



let camera;
let renderer;
let scene;
let loop;
let stats;
let controls;

export class World {
	constructor(container) {
		this.state = 'demo'

		camera = createCamera();
		renderer = createRenderer();
		scene = createScene();
		stats = createStats()

		controls = new Controls(this.state);
		loop = new Loop(camera, scene, renderer, stats, controls, this);


		container.append(renderer.domElement);
		container.append(stats.domElement);

		// const ground = createGround()
		// scene.add(ground);


		this.invokePlayer()

		const background = new Background()
		loop.updatables.push(background)
		scene.add(background.group)

		const light = new AmbientLight(0xffffff, 1); // soft white light
		scene.add(light);


		this.invokeMonster()

		// setTimeout(() => this.invokeMonster(), 500)
		// setTimeout(() => this.invokeMonster(), 1500)
		// setTimeout(() => this.invokeMonster(), 2500)

	}

	updateState(state) {
		this.state = state
		controls.state = state
	}

	invokePlayer() {
		this.player = new Player(camera);
		loop.updatables.push(this.player)

		for (let entity of loop.updatables) if (entity.target && entity.target.constructor.name === 'Player') entity.target = this.player
		scene.add(this.player.group);
	}

	invokeRegularBullet({ name, params }) {
		const bullet = new LinearBullet(params.position, params.direction)
		loop.updatables.push(bullet)
		scene.add(bullet.group);

		controls.events.delete(name)
	}

	invokeMonster() {
		const monster = new Monster()
		// const monster = new FollowingMonster(this.player)
		loop.updatables.push(monster)
		scene.add(monster.group);
	}

	invokeMonsterBullet({ name, params }) {
		const bullet = new MLinearBullet(params.position, params.direction)
		loop.updatables.push(bullet)
		scene.add(bullet.group);

		controls.events.delete(name)
	}

	render() {
		renderer.render(scene, camera);
	}

	start() {
		loop.start();
	}

	stop() {
		loop.stop();
	}
}
