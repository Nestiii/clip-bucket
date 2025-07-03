import { app, BrowserWindow } from 'electron'
import {
    initializeStorage,
    loadConfig,
    loadBuckets,
    saveConfig, createDefaultBucketIfNeeded,
} from './storage/storage.ts'
import { cleanupGlobalShortcuts, createWindow, setupGlobalShortcuts } from './ui/window.ts'
import { createTray, destroyTray } from './ui/tray.ts'
import { setupIpcHandlers } from './ipc/handlers.ts'

// App lifecycle management
const initializeApp = (): void => {
    console.log('Initializing ClipBucket...')

    // Initialize storage system
    initializeStorage()
    loadConfig()
    loadBuckets()

    // Create default bucket if none exist
    createDefaultBucketIfNeeded()

    // Setup app components
    setupIpcHandlers()
    setupGlobalShortcuts()
    createTray()
    createWindow()

    // Hide dock icon on macOS
    if (process.platform === 'darwin') {
        app.dock?.hide()
    }

    console.log('ClipBucket initialized successfully')
}

// Event handlers
app.on('window-all-closed', () => {
    // Keep app running for tray functionality
    // Don't quit the app when windows are closed
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

app.on('before-quit', () => {
    console.log('Shutting down ClipBucket...')
    saveConfig()
    cleanupGlobalShortcuts()
    destroyTray()
})

// Handle app errors
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error)
})

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason)
})

// Initialize when ready
app.whenReady().then(initializeApp)
