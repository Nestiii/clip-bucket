import { clipboard, ipcMain } from 'electron'
import { IPC_EVENTS } from '../../shared/ipcEvents.ts'
import {
    getBucket,
    getBucketName,
    getBuckets,
    getBucketStats,
    getConfig,
} from '../storage/storage.ts'

export const setupDataHandlers = (): void => {
    ipcMain.handle(IPC_EVENTS.DATA.GET_DATA, async () => {
        try {
            return {
                buckets: getBuckets(),
                currentClipboard: clipboard.readText(),
                config: getConfig(),
                stats: getBucketStats(),
            }
        } catch (error) {
            console.error('Error getting data:', error)
            return {
                buckets: [],
                currentClipboard: '',
                config: getConfig(),
                stats: { totalBuckets: 0, totalItems: 0, lastModified: new Date().toISOString() },
            }
        }
    })

    ipcMain.handle(IPC_EVENTS.DATA.GET_BUCKET, async (_event, bucketId: string) => {
        try {
            return getBucket(bucketId)
        } catch (error) {
            console.error(`Error getting bucket ${bucketId}:`, error)
            return null
        }
    })

    ipcMain.handle(IPC_EVENTS.DATA.GET_BUCKET_STATS, async () => {
        try {
            return getBucketStats()
        } catch (error) {
            console.error('Error getting bucket stats:', error)
            return { totalBuckets: 0, totalItems: 0, lastModified: new Date().toISOString() }
        }
    })

    ipcMain.handle(IPC_EVENTS.DATA.GET_BUCKET_NAME, async (_event, bucketId: string) => {
        try {
            const bucketName = getBucketName(bucketId)
            if (bucketName) return bucketName
            return null
        } catch (error) {
            console.error('Error getting bucket name:', error)
            return null
        }
    })
}
