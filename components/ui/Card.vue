<template>
	<div ref="card">
		<slot />
	</div>
</template>

<script lang="ts" setup>
const card = ref<HTMLElement>();
</script>

<style lang="scss" scoped>
div {
	background-color: rgba(255, 255, 255, 0.1);
	border-radius: 0.75rem;

	padding-inline: 1rem;
	padding-block: 0.75rem;

	border: 1px solid rgba(255, 255, 255, 0.1);

	box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
	backdrop-filter: blur(1rem);
	-webkit-backdrop-filter: blur(1rem);
}
</style>
