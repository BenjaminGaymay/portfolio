import { ImageLoader, Texture } from '../lib/build/three.module.js';

const images = {
	github: {
		path: '../../../assets/img/github.png',
		img: null
	},
	instagram: {
		path: '../../../assets/img/instagram.png',
		img: null
	},
	linkedin: {
		path: '../../../assets/img/lin.png',
		img: null
	},
	malt: {
		path: '../../../assets/img/malt.png',
		img: null
	},
	musiques: {
		path: '../../../assets/img/musiques.png',
		img: null
	},
	quorridor: {
		path: '../../../assets/img/quorridor.png',
		img: null
	}
};

export function loadImage(key) {
	if (!key || !images[key] || !images[key].img) return null;

	const canvas = document.createElement('CANVAS');
	let ctx = canvas.getContext('2d');

	canvas.width = images[key].img.naturalWidth;
	canvas.height = images[key].img.naturalHeight;

	ctx.drawImage(images[key].img, 0, 0);

	let texture = new Texture(canvas);
	texture.needsUpdate = true;

	return texture;
}

export async function loadImages() {
	const loader = new ImageLoader();

	await Promise.all(
		Object.keys(images).map(
			e =>
				new Promise(resolve => {
					if (images[e].path.match(/\.(png|jpg)$/)) {
						loader.load(
							images[e].path,
							img => {
								images[e].img = img;
								resolve();
							},
							undefined,
							resolve
						);
					}
				})
		)
	);

	return images;
}
