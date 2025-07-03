import { ipcMain } from 'electron'
import { IPC_EVENTS } from '../../shared/ipcEvents.ts'
import { getConfig, updateConfig } from '../storage/storage.ts'
import { sendConfigUpdate } from './updaters.ts'

export const setupConfigHandlers = (): void => {
    ipcMain.handle(IPC_EVENTS.CONFIG.GET_CONFIG, async () => {
        try {
            return getConfig()
        } catch (error) {
            console.error('Error getting config:', error)
            return null
        }
    })

    ipcMain.handle(IPC_EVENTS.CONFIG.UPDATE_CONFIG, async (_event, updates: any) => {
        try {
            updateConfig(updates)
            sendConfigUpdate() // Send specific config update
            return getConfig()
        } catch (error) {
            console.error('Error updating config:', error)
            return null
        }
    })
}
