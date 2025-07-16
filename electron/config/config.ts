import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { app } from 'electron'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '..')

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
    ? path.join(process.env.APP_ROOT, 'public')
    : RENDERER_DIST

const isDevelopment = (): boolean => {
    return (
        process.env.NODE_ENV === 'development' ||
        !!VITE_DEV_SERVER_URL ||
        process.env.ELECTRON_IS_DEV === 'true' ||
        !app.isPackaged
    )
}

const getEnvironmentStoragePath = (): string => {
    const platform = process.platform
    const isDevMode = isDevelopment()
    console.log(`🔧 Running in ${isDevMode ? 'DEVELOPMENT' : 'PRODUCTION'} mode`)
    switch (platform) {
        case 'win32':
            return isDevMode
                ? path.join(app.getPath('appData'), '.clipbucket-dev')
                : path.join(app.getPath('appData'), '.clipbucket-data')
        case 'darwin':
            return isDevMode
                ? path.join(app.getPath('appData'), 'ClipBucket-Dev', '.storage')
                : path.join(app.getPath('appData'), 'ClipBucket', '.storage')
        case 'linux':
            return isDevMode
                ? path.join(app.getPath('home'), '.config', 'clipbucket-dev', '.data')
                : path.join(app.getPath('home'), '.config', 'clipbucket', '.data')
        default:
            return isDevMode
                ? path.join(app.getPath('userData'), '.clipbucket-dev')
                : path.join(app.getPath('userData'), '.clipbucket-secure')
    }
}

const STORAGE_DIR = getEnvironmentStoragePath()
const CONFIG_DIR = path.join(STORAGE_DIR, '.config')
const BUCKETS_DIR = path.join(STORAGE_DIR, '.buckets')

export const WINDOW_SIZE_CONFIG = {
    small: { width: 320, height: 480 },
    medium: { width: 400, height: 600 },
    large: { width: 520, height: 720 }
}

export const APP_CONFIG = {
    environment: {
        isDevelopment: isDevelopment(),
        mode: isDevelopment() ? 'development' : 'production'
    },
    window: {
        width: WINDOW_SIZE_CONFIG.medium.width,
        height: WINDOW_SIZE_CONFIG.medium.height,
        backgroundColor: '#111111',
        screenMargin: 10
    },
    storage: {
        appDataDir: STORAGE_DIR,
        configDir: CONFIG_DIR,
        bucketsDir: BUCKETS_DIR,
        configFile: path.join(CONFIG_DIR, '.config.json'),
        getBucketPath: (bucketId: string) => path.join(BUCKETS_DIR, `.${bucketId}.json`)
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

console.log('📁 Storage paths:', {
    mode: APP_CONFIG.environment.mode,
    storageDir: APP_CONFIG.storage.appDataDir,
    configFile: APP_CONFIG.storage.configFile,
    bucketsDir: APP_CONFIG.storage.bucketsDir
})
