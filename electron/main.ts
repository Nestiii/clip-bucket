import { app, BrowserWindow } from 'electron'
import { loadBuckets, saveBuckets } from './storage/storage.ts'
import { cleanupGlobalShortcuts, createWindow, setupGlobalShortcuts } from './ui/window.ts'
import { createTray, destroyTray } from './ui/tray.ts'
import { setupIpcHandlers } from './ipc/handlers.ts'

// App lifecycle management
const initializeApp = (): void => {
    loadBuckets()
    setupIpcHandlers()
    setupGlobalShortcuts()
    createTray()
    createWindow()

    // Hide dock icon on macOS
    if (process.platform === 'darwin') {
        app.dock?.hide()
    }
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
    saveBuckets()
    cleanupGlobalShortcuts()
    destroyTray()
})

// Initialize when ready
app.whenReady().then(initializeApp)
