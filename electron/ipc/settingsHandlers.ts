import { ipcMain, globalShortcut } from 'electron'
import { IPC_EVENTS } from '../../shared/ipcEvents.ts'
import { updateConfig, getConfig } from '../storage/storage.ts'
import { updateWindowSize, setupGlobalShortcuts, cleanupGlobalShortcuts } from '../ui/window.ts'
import { sendConfigUpdate } from './updaters.ts'
import { WINDOW_SIZE_CONFIG } from '../config/config.ts'

export const setupSettingsHandlers = (): void => {
    ipcMain.handle(IPC_EVENTS.SETTINGS.UPDATE_WINDOW_SIZE, async (_event, size: 'small' | 'medium' | 'large') => {
        try {
            const config = getConfig()
            updateConfig({
                settings: {
                    ...config.settings,
                    windowSize: size
                }
            })
            updateWindowSize(size)
            sendConfigUpdate()
            return { success: true }
        } catch (error) {
            console.error('Error updating window size:', error)
            return { success: false }
        }
    })

    ipcMain.handle(IPC_EVENTS.SETTINGS.UPDATE_SHORTCUTS, async (_event, shortcuts: Record<string, string>) => {
        try {
            const config = getConfig()
            updateConfig({
                settings: {
                    ...config.settings,
                    shortcuts: {
                        ...config.settings.shortcuts,
                        ...shortcuts
                    }
                }
            })
            cleanupGlobalShortcuts()
            setupGlobalShortcuts()
            sendConfigUpdate()
            return { success: true }
        } catch (error) {
            console.error('Error updating shortcuts:', error)
            return { success: false }
        }
    })

    ipcMain.handle(IPC_EVENTS.SETTINGS.VALIDATE_SHORTCUT, async (_event, shortcut: string) => {
        try {
            const isValid = globalShortcut.register(shortcut, () => {})
            if (isValid) {
                globalShortcut.unregister(shortcut)
                return { valid: true }
            } else {
                return { valid: false, reason: 'Shortcut already in use by another application' }
            }
        } catch (error) {
            return { valid: false, reason: 'Invalid shortcut format' }
        }
    })

    ipcMain.handle(IPC_EVENTS.SETTINGS.GET_WINDOW_SIZES, async () => {
        return [
            {
                value: 'small',
                label: 'Small',
                description: 'Compact size for minimal screen usage',
                dimensions: WINDOW_SIZE_CONFIG.small
            },
            {
                value: 'medium',
                label: 'Medium',
                description: 'Balanced size for most workflows',
                dimensions: WINDOW_SIZE_CONFIG.medium
            },
            {
                value: 'large',
                label: 'Large',
                description: 'Spacious for handling longer content',
                dimensions: WINDOW_SIZE_CONFIG.large
            }
        ]
    })
}
