import { ipcMain } from 'electron'
import { IPC_EVENTS } from '../../shared/ipcEvents.ts'
import { quickCaptureClip } from '../ui/quickCapture.ts'

export const setupQuickCaptureHandlers = (): void => {
    ipcMain.handle(IPC_EVENTS.QUICK_CAPTURE.CAPTURE_CLIP, async () => {
        try {
            await quickCaptureClip()
            return { success: true }
        } catch (error) {
            console.error('Quick capture failed:', error)
            return { success: false, error: error }
        }
    })
}
