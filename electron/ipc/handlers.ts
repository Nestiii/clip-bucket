import { ipcMain, clipboard, dialog } from 'electron'
import {
    getBuckets,
    createBucket,
    deleteBucket,
    addItemToBucket,
    deleteItemFromBucket
} from '../storage/storage.ts'
import { getWindow, sendDataToRenderer, hideWindow } from '../ui/window.ts'

export const setupIpcHandlers = (): void => {
    // Get current data
    ipcMain.handle('get-data', () => ({
        buckets: getBuckets(),
        currentClipboard: clipboard.readText(),
    }))

    // Create new bucket
    ipcMain.handle('create-bucket', async (_event, bucketName: string) => {
        const success = createBucket(bucketName)
        if (success) {
            sendDataToRenderer()
        }
        return success
    })

    // Delete bucket with confirmation
    ipcMain.handle('delete-bucket', async (_event, bucketName: string) => {
        const win = getWindow()
        if (!win) return false

        const response = dialog.showMessageBoxSync(win, {
            type: 'warning',
            buttons: ['Delete', 'Cancel'],
            defaultId: 1,
            message: 'Delete Bucket',
            detail: `Are you sure you want to delete '${bucketName}' and all its contents?`,
        })

        if (response === 0) {
            const success = deleteBucket(bucketName)
            if (success) {
                sendDataToRenderer()
            }
            return success
        }
        return false
    })

    // Save current clipboard to bucket
    ipcMain.handle('save-to-bucket', async (_event, bucketName: string) => {
        const currentClipboard = clipboard.readText()
        const success = addItemToBucket(bucketName, currentClipboard)
        if (success) {
            sendDataToRenderer()
        }
        return success
    })

    // Copy item to clipboard and hide window
    ipcMain.handle('copy-item', async (_event, text: string) => {
        clipboard.writeText(text)
        hideWindow()
    })

    // Delete item from bucket
    ipcMain.handle('delete-item', async (_event, bucketName: string, itemIndex: number) => {
        const success = deleteItemFromBucket(bucketName, itemIndex)
        if (success) {
            sendDataToRenderer()
        }
        return success
    })
}
