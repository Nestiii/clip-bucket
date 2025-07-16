import { clipboard, ipcMain } from 'electron'
import { IPC_EVENTS } from '../../shared/ipcEvents.ts'
import { addClipToBucket, deleteClipFromBucket, updateClip } from '../storage/storage.ts'
import { hideWindow } from '../ui/window.ts'
import { sendBucketUpdate } from './updaters.ts'

export const setupClipHandlers = (): void => {
    ipcMain.handle(
        IPC_EVENTS.CLIP.SAVE_TO_BUCKET,
        async (_event, bucketId: string, label?: string) => {
            try {
                const currentClipboard = clipboard.readText()
                if (!currentClipboard.trim()) return null
                const item = addClipToBucket(bucketId, currentClipboard, label)
                if (item) {
                    sendBucketUpdate(bucketId) // Send specific bucket update
                    return item
                }
                return null
            } catch (error) {
                console.error(`Error saving to bucket ${bucketId}:`, error)
                return null
            }
        }
    )

    ipcMain.handle(
        IPC_EVENTS.CLIP.ADD_ITEM_TO_BUCKET,
        async (_event, bucketId: string, content: string, label?: string) => {
            try {
                const item = addClipToBucket(bucketId, content, label)
                if (item) {
                    sendBucketUpdate(bucketId) // Send specific bucket update
                    return item
                }
                return null
            } catch (error) {
                console.error(`Error adding item to bucket ${bucketId}:`, error)
                return null
            }
        }
    )

    ipcMain.handle(
        IPC_EVENTS.CLIP.UPDATE_CLIP,
        async (
            _event,
            bucketId: string,
            itemId: string,
            updates: { content?: string; label?: string }
        ) => {
            try {
                const item = updateClip(bucketId, itemId, updates)
                if (item) {
                    sendBucketUpdate(bucketId) // Send specific bucket update
                    return item
                }
                return null
            } catch (error) {
                console.error(`Error updating item ${itemId} in bucket ${bucketId}:`, error)
                return null
            }
        }
    )

    ipcMain.handle(
        IPC_EVENTS.CLIP.COPY_ITEM,
        async (_event, text: string, hideAfterCopy: boolean = true) => {
            try {
                clipboard.writeText(text)
                if (hideAfterCopy) {
                    hideWindow()
                }
                return true
            } catch (error) {
                console.error('Error copying item:', error)
                return false
            }
        }
    )

    ipcMain.handle(
        IPC_EVENTS.CLIP.DELETE_CLIP,
        async (_event, bucketId: string, itemId: string) => {
            try {
                const success = deleteClipFromBucket(bucketId, itemId)
                if (success) {
                    sendBucketUpdate(bucketId) // Send updated bucket
                }
                return success
            } catch (error) {
                console.error(`Error deleting item ${itemId} from bucket ${bucketId}:`, error)
                return false
            }
        }
    )
}
