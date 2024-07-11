<template>
	<main class="p-8">
		<div class="absolute inset-0 overflow-clip">
			<UiRandom v-for="index in 4" :key="index" />
		</div>

		<div class="text-white text-6xl absolute top-10">Portfolio</div>
		<UiCard class="mx-auto w-full h-1/2"> Hello </UiCard>
	</main>
</template>
