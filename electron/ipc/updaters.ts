import { getBucket, getBuckets, getBucketStats, getConfig } from '../storage/storage.ts'
import { getWindow } from '../ui/window.ts'
import { IPC_EVENTS } from '../../shared/ipcEvents.ts'

// Send all data
export const sendDataUpdate = (): void => {
    try {
        const win = getWindow()
        if (win && !win.isDestroyed()) {
            win.webContents.send(IPC_EVENTS.RENDERER.DATA_UPDATE, {
                buckets: getBuckets(),
                config: getConfig(),
                stats: getBucketStats()
            })
        }
    } catch (error) {
        console.error('Error sending data to renderer:', error)
    }
}

// Send specific bucket update
export const sendBucketUpdate = (bucketId: string): void => {
    try {
        const bucket = getBucket(bucketId)
        if (bucket) {
            const win = getWindow()
            if (win && !win.isDestroyed()) {
                win.webContents.send(IPC_EVENTS.RENDERER.BUCKET_UPDATE, bucket)
            }
        }
    } catch (error) {
        console.error(`Error sending bucket update for ${bucketId}:`, error)
    }
}

// Send all buckets update
export const sendBucketsUpdate = (): void => {
    try {
        const win = getWindow()
        if (win && !win.isDestroyed()) {
            win.webContents.send(IPC_EVENTS.RENDERER.BUCKETS_UPDATE, getBuckets())
        }
    } catch (error) {
        console.error('Error sending buckets update:', error)
    }
}

// Send config update
export const sendConfigUpdate = (): void => {
    try {
        const config = getConfig()
        const win = getWindow()
        if (win && !win.isDestroyed()) {
            win.webContents.send(IPC_EVENTS.RENDERER.CONFIG_UPDATE, config)
        }
    } catch (error) {
        console.error('Error sending config update:', error)
    }
}
