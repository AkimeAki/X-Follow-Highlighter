import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [],
	server: {
		host: "0.0.0.0"
	},
	root: "./src/",
	build: {
		outDir: "../dist/",
		emptyOutDir: true,
		rollupOptions: {
			output: {
				entryFileNames: "[name].js",
				chunkFileNames: "[name].js",
				assetFileNames: "[name].[ext]"
			},
			input: {
				content: "./src/content.ts"
			}
		}
	}
});
