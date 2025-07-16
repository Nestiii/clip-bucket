import { BrowserWindow, screen, globalShortcut } from 'electron'
import {
    APP_CONFIG,
    VITE_DEV_SERVER_URL,
    RENDERER_DIST,
    WINDOW_SIZE_CONFIG,
} from '../config/config.ts'
import path from 'node:path'
import { sendDataUpdate } from '../ipc/updaters.ts'
import { getConfig } from '../storage/storage.ts'

let win: BrowserWindow | null = null

export const createWindow = (): void => {
    const windowSize = getWindowSizeFromConfig()
    const dimensions = WINDOW_SIZE_CONFIG[windowSize]
    win = new BrowserWindow({
        width: dimensions.width + (process.env.DEVTOOLS ? 400 : 0),
        height: dimensions.height,
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

    win.on('blur', () => {
        if (win && !win.isDestroyed()) {
            win.hide()
        }
    })

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
    const config = getConfig()
    const shortcuts = config.settings.shortcuts
    if (shortcuts.toggleWindow) globalShortcut.register(shortcuts.toggleWindow, toggleWindow)
}

export const cleanupGlobalShortcuts = (): void => {
    globalShortcut.unregisterAll()
}

export const updateWindowSize = (size: 'small' | 'medium' | 'large'): void => {
    if (!win || win.isDestroyed()) return
    const dimensions = WINDOW_SIZE_CONFIG[size]
    if (dimensions) {
        win.setSize(dimensions.width, dimensions.height)
        APP_CONFIG.window.width = dimensions.width + (process.env.DEVTOOLS ? 400 : 0)
        APP_CONFIG.window.height = dimensions.height
    }
}

export const getWindowSizeFromConfig = (): 'small' | 'medium' | 'large' => {
    const config = getConfig()
    return config.settings.windowSize || 'medium'
}
