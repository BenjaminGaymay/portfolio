// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-04-03',
	devtools: { enabled: true },

	css: ['~/assets/scss/reset.scss', '~/assets/scss/tailwind.scss', '~/assets/scss/main.scss'],

	modules: ['@nuxtjs/tailwindcss']
});
