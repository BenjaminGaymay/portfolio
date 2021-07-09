// precision mediump float;
// varying vec2 vUv;
// varying float wave;
// uniform float uTime;
// uniform float uProg;
// uniform float uIndex;

// #pragma glslify: noise = require(glsl - noise / simplex / 3d)

// void main() {
// 	vec3 pos = position;

// 	if (uIndex < 3.) {
// 		pos.z += noise(vec3(pos.x * 4. + uTime, pos.y, 0.)) * uProg;
// 		wave = pos.z;
// 		pos.z *= 3.;
// 	} else if (uIndex < 6.) {
// 		float pr = smoothstep(0., 0.5 - sin(pos.y), uProg) * 5.;
// 		pos.z += pr;
// 	} else {
// 		pos.z += sin(pos.y * 5. + uTime) * 2. * uProg;
// 		wave = pos.z;
// 	}

// 	vUv = uv;

// 	gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
// }

uniform float time;
varying vec3 vUv;

void main() {

	vec3 pos = position;
	// pos.z = (mod(pos.x + pos.y + time, 2.) - 1.) * 10.;
	vUv = pos;

	vec4 modelViewPosition = modelViewMatrix * vec4(pos, 1.);
	gl_Position = projectionMatrix * modelViewPosition;
}