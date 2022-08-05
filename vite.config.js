import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import {VitePWA} from "vite-plugin-pwa"
import path from "path"


// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		svelte(),
	],
	resolve: {
		alias: {
			'components': path.resolve('./src/components'),
			'utility': path.resolve('./src/utility'),
			'stores': path.resolve('./src/stores'),
			'help': path.resolve('./src/help'),
			'events': path.resolve('./src/events')
		}
	}
})
