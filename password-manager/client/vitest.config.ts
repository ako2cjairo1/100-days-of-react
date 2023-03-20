import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
	resolve: {
		alias: [
			{
				find: '@',
				replacement: path.resolve(__dirname, 'src'),
			},
		],
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: './src/services/Utils/test.util.ts',
		include: ['./src/**/*.test.*'],
		reporters: 'verbose',
		// css: true,
	},
})
