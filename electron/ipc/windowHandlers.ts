import { ipcMain } from 'electron'
import { IPC_EVENTS } from '../../shared/ipcEvents.ts'
import { hideWindow } from '../ui/window.ts'

export const setupWindowHandlers = (): void => {
    ipcMain.handle(IPC_EVENTS.WINDOW.HIDE_WINDOW, async () => {
        hideWindow()
    })
}