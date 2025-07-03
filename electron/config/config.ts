import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { homedir } from 'node:os'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Environment setup
process.env.APP_ROOT = path.join(__dirname, '..')

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
    ? path.join(process.env.APP_ROOT, 'public')
    : RENDERER_DIST

// New directory structure
const APP_DATA_DIR = path.join(homedir(), 'clipbucket')
const CONFIG_DIR = path.join(APP_DATA_DIR, 'config')
const BUCKETS_DIR = path.join(APP_DATA_DIR, 'buckets')

export const APP_CONFIG = {
    window: {
        width: process.env.DEVTOOLS ? 1000 : 400,
        height: process.env.DEVTOOLS ? 600 : 600,
        backgroundColor: '#111111',
        screenMargin: 10
    },
    storage: {
        appDataDir: APP_DATA_DIR,
        configDir: CONFIG_DIR,
        bucketsDir: BUCKETS_DIR,
        configFile: path.join(CONFIG_DIR, 'config.json'),
        getBucketPath: (bucketId: string) => path.join(BUCKETS_DIR, `${bucketId}.json`)
    },
    paths: {
        preload: path.join(__dirname, 'preload.mjs'),
        icon: path.join(process.env.VITE_PUBLIC, 'icon.png'),
        renderer: VITE_DEV_SERVER_URL || path.join(RENDERER_DIST, 'index.html'),
    },
    shortcuts: {
        toggleWindow: 'CommandOrControl+Shift+P'
    }
}
