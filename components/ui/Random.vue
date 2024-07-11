<template>
	<div :style="style" :class="form"></div>
</template>

<script lang="ts" setup>
const FORMS = ['square', 'triangle', 'rectangle'];
const COLORS = ['#FF00FF', '#00FFFF', '#FFFFFF', '#FFFF00', '#00FF00'];

const form = ref(FORMS.at(Math.floor(Math.random() * FORMS.length)));

const style = {
	'--x': Math.random(),
	'--y': Math.random(),
	'--width': Math.random() * 0.2 + 0.05,
	'--color': COLORS.at(Math.floor(Math.random() * COLORS.length))
};
</script>

<style lang="scss" scoped>
div {
	position: absolute;

	top: calc(100dvh * var(--y, 0));
	left: calc(100dvw * var(--x, 0));

	background-color: var(--color, #ffffff);
	width: calc(100dvw * var(--width, 0));
	aspect-ratio: 1 / 1;
}

.triangle {
	clip-path: polygon(50% 0, 100% 100%, 0 100%);
}

.rectangle {
	aspect-ratio: 2 / 1;
}
</style>
