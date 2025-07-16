import { ipcRenderer, contextBridge } from 'electron'
import { IPC_EVENTS } from '../shared/ipcEvents';
import { AppConfig, Bucket, BucketDTO, BucketStats, Clip, ClipBucketAPI, ClipBucketData } from '../shared/types.ts'

contextBridge.exposeInMainWorld('api', {
    // Data operations
    getData: (): Promise<ClipBucketData> => ipcRenderer.invoke(IPC_EVENTS.DATA.GET_DATA),
    getBucket: (bucketId: string): Promise<Bucket | null> => ipcRenderer.invoke(IPC_EVENTS.DATA.GET_BUCKET, bucketId),
    getBucketStats: (): Promise<BucketStats> => ipcRenderer.invoke(IPC_EVENTS.DATA.GET_BUCKET_STATS),
    getBucketName: (bucketId: string): Promise<string | null> => ipcRenderer.invoke(IPC_EVENTS.DATA.GET_BUCKET_NAME, bucketId),

    // Bucket operations
    createBucket: (name: string): Promise<Bucket | null> => ipcRenderer.invoke(IPC_EVENTS.BUCKET.CREATE_BUCKET, name),
    updateBucket: (bucketId: string, updates: { name?: string }): Promise<Bucket | null> =>
        ipcRenderer.invoke(IPC_EVENTS.BUCKET.UPDATE_BUCKET, bucketId, updates),
    deleteBucket: (bucketId: string): Promise<boolean> => ipcRenderer.invoke(IPC_EVENTS.BUCKET.DELETE_BUCKET, bucketId),

    // Clip operations
    saveToBucket: (bucketId: string, label?: string): Promise<Clip | null> =>
        ipcRenderer.invoke(IPC_EVENTS.CLIP.SAVE_TO_BUCKET, bucketId, label),
    addClipToBucket: (bucketId: string, content: string, label?: string): Promise<Clip | null> =>
        ipcRenderer.invoke(IPC_EVENTS.CLIP.ADD_ITEM_TO_BUCKET, bucketId, content, label),
    updateClip: (bucketId: string, itemId: string, updates: { content?: string; label?: string }): Promise<Clip | null> =>
        ipcRenderer.invoke(IPC_EVENTS.CLIP.UPDATE_CLIP, bucketId, itemId, updates),
    deleteClip: (bucketId: string, itemId: string): Promise<boolean> =>
        ipcRenderer.invoke(IPC_EVENTS.CLIP.DELETE_CLIP, bucketId, itemId),
    copyItem: (text: string, hideAfterCopy: boolean = true): Promise<boolean> =>
        ipcRenderer.invoke(IPC_EVENTS.CLIP.COPY_ITEM, text, hideAfterCopy),

    // Search operations
    searchBuckets: (query: string): Promise<Bucket[]> => ipcRenderer.invoke(IPC_EVENTS.SEARCH.SEARCH_BUCKETS, query),
    searchClips: (bucketId: string, query: string): Promise<Clip[]> =>
        ipcRenderer.invoke(IPC_EVENTS.SEARCH.SEARCH_CLIPS, bucketId, query),

    // Config operations
    getConfig: (): Promise<AppConfig | null> => ipcRenderer.invoke(IPC_EVENTS.CONFIG.GET_CONFIG),
    updateConfig: (updates: Partial<AppConfig>): Promise<AppConfig | null> =>
        ipcRenderer.invoke(IPC_EVENTS.CONFIG.UPDATE_CONFIG, updates),
    setLastUsedBucket: (bucketId: string): Promise<boolean> =>
        ipcRenderer.invoke(IPC_EVENTS.CONFIG.SET_LAST_USED_BUCKET, bucketId),
    getLastUsedBucket: (): Promise<string | null> =>
        ipcRenderer.invoke(IPC_EVENTS.CONFIG.GET_LAST_USED_BUCKET),

    // Clipboard operations
    getClipboard: (): Promise<string> => ipcRenderer.invoke(IPC_EVENTS.CLIPBOARD.GET_CLIPBOARD),
    setClipboard: (text: string): Promise<boolean> => ipcRenderer.invoke(IPC_EVENTS.CLIPBOARD.SET_CLIPBOARD, text),
    clearClipboard: (): Promise<boolean> => ipcRenderer.invoke(IPC_EVENTS.CLIPBOARD.CLEAR_CLIPBOARD),

    // Import/Export operations
    importLegacyBuckets: (legacyData: Record<string, string[]>) =>
        ipcRenderer.invoke(IPC_EVENTS.IMPORT_EXPORT.IMPORT_LEGACY_BUCKETS, legacyData),
    exportBuckets: () => ipcRenderer.invoke(IPC_EVENTS.IMPORT_EXPORT.EXPORT_BUCKETS),

    // Event listeners
    onDataUpdate: (callback: (data: ClipBucketData) => void): void => {
        ipcRenderer.on(IPC_EVENTS.RENDERER.DATA_UPDATE, (_event, data) => callback(data))
    },
    onBucketsUpdate: (callback: (buckets: BucketDTO[]) => void): void => {
        ipcRenderer.on(IPC_EVENTS.RENDERER.BUCKETS_UPDATE, (_event, buckets) => callback(buckets))
    },
    onBucketUpdate: (callback: (bucket: Bucket) => void): void => {
        ipcRenderer.on(IPC_EVENTS.RENDERER.BUCKET_UPDATE, (_event, bucket) => callback(bucket))
    },
    onBucketDeleted: (callback: (data: { bucketId: string }) => void): void => {
        ipcRenderer.on(IPC_EVENTS.RENDERER.BUCKET_DELETED, (_event, data) => callback(data))
    },
    onClipUpdate: (callback: (data: { bucketId: string; clip: Clip }) => void): void => {
        ipcRenderer.on(IPC_EVENTS.RENDERER.CLIP_UPDATE, (_event, data) => callback(data))
    },
    onClipDeleted: (callback: (data: { bucketId: string; clipId: string }) => void): void => {
        ipcRenderer.on(IPC_EVENTS.RENDERER.CLIP_DELETED, (_event, data) => callback(data))
    },
    onConfigUpdate: (callback: (config: AppConfig) => void): void => {
        ipcRenderer.on(IPC_EVENTS.RENDERER.CONFIG_UPDATE, (_event, config) => callback(config))
    },
    onStatsUpdate: (callback: (stats: BucketStats) => void): void => {
        ipcRenderer.on(IPC_EVENTS.RENDERER.STATS_UPDATE, (_event, stats) => callback(stats))
    },

    // Remove event listeners
    removeAllListeners: (event: string): void => {
        ipcRenderer.removeAllListeners(event)
    }
} satisfies ClipBucketAPI)

declare global {
    interface Window {
        ipcRenderer: Electron.IpcRenderer
        api: ClipBucketAPI
    }
}
