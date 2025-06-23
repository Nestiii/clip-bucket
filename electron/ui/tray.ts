import { Tray, Menu, app, nativeImage } from 'electron'
import { APP_CONFIG } from '../config/config.ts'
import { toggleWindow } from './window.ts'

let tray: Tray | null = null

export const createTray = (): void => {
    try {
        tray = new Tray(APP_CONFIG.paths.icon)
        tray.setToolTip('ClipBucket')

        tray.on('click', toggleWindow)
        tray.on('right-click', showContextMenu)
    } catch (error) {
        console.error('Failed to create tray:', error)
        // Fallback: create empty tray
        tray = new Tray(nativeImage.createEmpty())
        tray.setToolTip('ClipBucket')
        tray.on('click', toggleWindow)
        tray.on('right-click', showContextMenu)
    }
}

const showContextMenu = (): void => {
    if (!tray) return

    const contextMenu = Menu.buildFromTemplate([
        { label: 'Show ClipBucket', click: toggleWindow },
        { type: 'separator' },
        { label: 'Quit', click: () => app.quit() },
    ])

    tray.popUpContextMenu(contextMenu)
}

export const getTray = (): Tray | null => tray

export const destroyTray = (): void => {
    if (tray) {
        tray.destroy()
        tray = null
    }
}
