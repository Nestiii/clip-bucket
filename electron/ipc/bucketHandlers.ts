import { ipcMain } from 'electron'
import { IPC_EVENTS } from '../../shared/ipcEvents.ts'
import { createBucket, deleteBucket, updateBucket } from '../storage/storage.ts'
import { sendBucketsUpdate } from './updaters.ts'

export const setupBucketHandlers = (): void => {
    ipcMain.handle(IPC_EVENTS.BUCKET.CREATE_BUCKET, async (_event, bucketName: string) => {
        try {
            const bucket = createBucket(bucketName)
            if (bucket) {
                sendBucketsUpdate() // Send updated buckets list
                return bucket
            }
            return null
        } catch (error) {
            console.error('Error creating bucket:', error)
            return null
        }
    })

    ipcMain.handle(
        IPC_EVENTS.BUCKET.UPDATE_BUCKET,
        async (_event, bucketId: string, updates: { name?: string }) => {
            try {
                const bucket = updateBucket(bucketId, updates)
                if (bucket) {
                    sendBucketsUpdate() // Send updated buckets list
                    return bucket
                }
                return null
            } catch (error) {
                console.error(`Error updating bucket ${bucketId}:`, error)
                return null
            }
        }
    )

    ipcMain.handle(IPC_EVENTS.BUCKET.DELETE_BUCKET, async (_event, bucketId: string) => {
        try {
            const success = deleteBucket(bucketId)
            if (success) {
                sendBucketsUpdate() // Send updated buckets list
            }
            return success
        } catch (error) {
            console.error(`Error deleting bucket ${bucketId}:`, error)
            return false
        }
    })
}
