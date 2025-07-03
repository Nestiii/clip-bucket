import { ipcMain } from 'electron'
import { IPC_EVENTS } from '../../shared/ipcEvents.ts'
import { addClipToBucket, createBucket, getBuckets } from '../storage/storage.ts'
import { sendBucketsUpdate } from './updaters.ts'

export const setupImportExportHandlers = (): void => {
    ipcMain.handle(IPC_EVENTS.IMPORT_EXPORT.IMPORT_LEGACY_BUCKETS, async (_event, legacyData: Record<string, string[]>) => {
        try {
            let importedCount = 0
            for (const [bucketName, items] of Object.entries(legacyData)) {
                const bucket = createBucket(bucketName)
                if (bucket) {
                    for (const item of items) {
                        addClipToBucket(bucket.id, item)
                    }
                    importedCount++
                }
            }
            if (importedCount > 0) {
                sendBucketsUpdate() // Send updated buckets list
            }
            return { success: true, importedCount }
        } catch (error) {
            console.error('Error importing legacy buckets:', error)
            return { success: false, importedCount: 0 }
        }
    })

    ipcMain.handle(IPC_EVENTS.IMPORT_EXPORT.EXPORT_BUCKETS, async () => {
        try {
            const buckets = getBuckets()
            const exportData = {
                version: '2.0',
                exportDate: new Date().toISOString(),
                buckets: buckets
            }
            return exportData
        } catch (error) {
            console.error('Error exporting buckets:', error)
            return null
        }
    })
}
