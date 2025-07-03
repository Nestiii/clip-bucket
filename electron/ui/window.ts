import { BrowserWindow, screen, globalShortcut } from 'electron'
import { APP_CONFIG, VITE_DEV_SERVER_URL, RENDERER_DIST } from '../config/config.ts'
import path from 'node:path'
import { sendDataUpdate } from '../ipc/updaters.ts'

let win: BrowserWindow | null = null

export const createWindow = (): void => {
    win = new BrowserWindow({
        width: APP_CONFIG.window.width,
        height: APP_CONFIG.window.height,
        show: false,
        backgroundColor: APP_CONFIG.window.backgroundColor,
        movable: true,
        frame: false,
        resizable: false,
        skipTaskbar: true,
        icon: APP_CONFIG.paths.icon,
        webPreferences: {
            preload: APP_CONFIG.paths.preload,
            nodeIntegration: false,
            contextIsolation: true,
        },
    })

    // Hide window when it loses focus
    win.on('blur', () => {
        if (win && !win.isDestroyed()) {
            win.hide()
        }
    })

    // Hide window on esc
    // win.webContents.on('before-input-event', (_event, input) => {
    //     if (input.key === 'Escape' && input.type === 'keyDown') {
    //         hideWindow()
    //     }
    // })

    // Only show when content is ready
    win.once('ready-to-show', () => {
        if (win && !win.isDestroyed()) {
            showWindow()
        }
    })

    if (VITE_DEV_SERVER_URL) {
        if (process.env.DEVTOOLS) win.webContents.openDevTools()
        win.loadURL(VITE_DEV_SERVER_URL)
    } else {
        win.loadFile(path.join(RENDERER_DIST, 'index.html'))
    }
}

export const showWindow = (): void => {
    if (!win) return
    const cursor = screen.getCursorScreenPoint()
    const display = screen.getDisplayNearestPoint(cursor)
    let x = cursor.x
    let y = cursor.y
    if (cursor.x + APP_CONFIG.window.width > display.workArea.x + display.workArea.width) {
        x = display.workArea.x + display.workArea.width - APP_CONFIG.window.width
    }
    if (cursor.y + APP_CONFIG.window.height > display.workArea.y + display.workArea.height) {
        y = display.workArea.y + display.workArea.height - APP_CONFIG.window.height
    }
    win.setPosition(x, y, false)
    win.show()
    win.focus()
    // Send initial data to renderer
    sendDataUpdate()
}

export const hideWindow = (): void => {
    if (win && !win.isDestroyed()) {
        win.hide()
    }
}

export const toggleWindow = (): void => {
    if (win && win.isVisible()) {
        hideWindow()
    } else {
        // Destroy and recreate window each time
        if (win) {
            win.destroy()
            win = null
        }
        createWindow()
        showWindow()
    }
}

export const getWindow = (): BrowserWindow | null => win

export const setupGlobalShortcuts = (): void => {
    globalShortcut.register(APP_CONFIG.shortcuts.toggleWindow, toggleWindow)
}

export const cleanupGlobalShortcuts = (): void => {
    globalShortcut.unregisterAll()
}
