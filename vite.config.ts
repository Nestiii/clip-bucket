import { defineConfig } from 'vite'
import path from 'node:path'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'

export default defineConfig({
    base: './',
    plugins: [
        react(),
        electron({
            main: {
                entry: 'electron/main.ts',
            },
            preload: {
                input: path.join(__dirname, 'electron/preload.ts'),
            },
            renderer: process.env.NODE_ENV === 'test' ? undefined : {},
        }),
    ],
    build: {
        cssCodeSplit: false,
        rollupOptions: {
            output: {
                assetFileNames: 'assets/[name].[hash].[ext]',
            },
        },
    },
    css: {
        modules: false,
    },
})
