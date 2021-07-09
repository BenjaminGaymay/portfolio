class Resizer {
	constructor(container, camera, renderer) {
		// set initial size on load
		setSize(container, camera, renderer);

		window.addEventListener('resize', () => {
			// set the size again if a resize occurs
			setSize(container, camera, renderer);
			// perform any custom actions
			this.onResize();
		});
	}

	onResize() {}
}

export { Resizer };
