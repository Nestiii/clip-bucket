import { IPC_EVENTS } from '../../shared/ipcEvents.ts'
import { ipcMain } from 'electron'
import { searchBuckets, searchClips } from '../storage/storage.ts'

export const setupSearchHandlers = (): void => {
    ipcMain.handle(IPC_EVENTS.SEARCH.SEARCH_BUCKETS, async (_event, query: string) => {
        try {
            return searchBuckets(query)
        } catch (error) {
            console.error('Error searching buckets:', error)
            return []
        }
    })

    ipcMain.handle(
        IPC_EVENTS.SEARCH.SEARCH_CLIPS,
        async (_event, bucketId: string, query: string) => {
            try {
                return searchClips(bucketId, query)
            } catch (error) {
                console.error(`Error searching items in bucket ${bucketId}:`, error)
                return []
            }
        }
    )
}
