import { Clock, Box3 } from '../lib/build/three.module.js';

const clock = new Clock();


class Loop {
  constructor(camera, scene, renderer, stats, controls, world) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.stats = stats
    this.controls = controls
    this.updatables = []

    this.world = world
  }

  start() {
    this.renderer.setAnimationLoop(() => {
      this.tick()
      this.renderer.render(this.scene, this.camera);

      if (this.stats) this.stats.update();
    });
  }

  stop() {
    this.renderer.setAnimationLoop(null);
  }

  tick() {
    const delta = clock.getDelta();

    this.handleEvents(delta)

    for (const i in this.updatables) {
      this.updatables[i].events = this.controls.events
      this.updatables[i].tick(delta);

      if (this.updatables[i].constructor.name.includes('Bullet') || this.updatables[i].constructor.name === 'Player') this.checkCollision(this.updatables[i])


      if (this.updatables[i].life !== undefined && this.updatables[i].life <= 0) {
        if (this.updatables[i].constructor.name === 'Player') {
          setTimeout(() => this.world.invokePlayer(), 2000)
        }

        this.scene.remove(this.updatables[i].group)
        delete this.updatables[i]
      }
    }

    this.updatables = this.updatables.filter(Boolean)
  }

  checkCollision(bullet) {
    for (const object of this.updatables) {
      // (object.constructor.name === 'Monster' || object.constructor.name === 'Player')
      if (object && object.constructor && bullet.hitEntity(object.constructor.name)) {
        const bulletBox = new Box3().setFromObject(bullet.group);
        const monsterBox = new Box3().setFromObject(object.group);

        if (bulletBox.intersectsBox(monsterBox)) {
          object.hit(bullet.damages)
          bullet.hit(object.damages)
        };
      }
    }
  }

  handleEvents(delta) {
    for (const name of this.controls.events) {
      const event = JSON.parse(name)

      if (event.name.includes('world')) this.world[event.name.split('.')[1]]({ name, delta, params: event.params });
      if (event.name.includes('player')) this.world.player[event.name.split('.')[1]]({ name, delta, params: event.params });
    }
  }
}

export { Loop }