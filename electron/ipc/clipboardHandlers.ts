import { clipboard, ipcMain } from 'electron'
import { IPC_EVENTS } from '../../shared/ipcEvents.ts'

export const setupClipboardHandlers = (): void => {
    ipcMain.handle(IPC_EVENTS.CLIPBOARD.GET_CLIPBOARD, async () => {
        try {
            return clipboard.readText()
        } catch (error) {
            console.error('Error getting clipboard:', error)
            return ''
        }
    })

    ipcMain.handle(IPC_EVENTS.CLIPBOARD.SET_CLIPBOARD, async (_event, text: string) => {
        try {
            clipboard.writeText(text)
            return true
        } catch (error) {
            console.error('Error setting clipboard:', error)
            return false
        }
    })

    ipcMain.handle(IPC_EVENTS.CLIPBOARD.CLEAR_CLIPBOARD, async () => {
        try {
            clipboard.writeText('')
            return true
        } catch (error) {
            console.error('Error clearing clipboard:', error)
            return false
        }
    })
}
