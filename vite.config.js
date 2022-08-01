import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import {VitePWA} from "vite-plugin-pwa"
import path from "path"


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
	svelte(),
	VitePWA({
		registerType: 'autoUpdate',
		includeAssets: ['fonts/*.ttf', 'images/*.*', 'icons/*.*', "agreement/*.html"],
		manifest:{
			"short_name": "Передам.инфо",
			"name": "Передача показаний",
			"description": "Приложение для помощи с передачей показаний",
			"icons": [{
				"src": "/resources/icons/full_128.png",
				"type": "image/png",
				"sizes": "128x128"
			}, {
				"src": "/resources/icons/full_256.png",
				"type": "image/png",
				"sizes": "256x256"
			}, {
				"src": "/resources/icons/full_512.png",
				"type": "image/png",
				"sizes": "512x512"
			},{
				"src": "/resources/icons/maskable_128.png",
				"type": "image/png",
				"purpose": "maskable",
				"sizes": "128x128"
			}, {
				"src": "/resources/icons/maskable_256.png",
				"type": "image/png",
				"purpose": "maskable",
				"sizes": "256x256"
			}, {
				"src": "/resources/icons/maskable_512.png",
				"type": "image/png",
				"purpose": "maskable",
				"sizes": "512x512"
			}],
			"background_color" : "#0E303D",
			"theme_color" : "#0E303D",
			"start_url": "/",
			"id": "/",
			"scope": ".",
			"display": "standalone",
			"orientation": "any"
		},
		devOptions: {
			enabled : true,
		},
	})],
	resolve: {
	  alias: {
		  'components': path.resolve('./src/components'),
		  'utility': path.resolve('./src/utility'),
		  'stores': path.resolve('./src/stores'),
		  'events': path.resolve('./src/events')
	  }
	}
})
