export interface Clip {
    id: string
    content: string
    timestamp: string
    label?: string
}

export interface BucketDTO {
    id: string
    name: string
    timestamp: string
}

export interface Bucket extends BucketDTO {
    clips: Clip[]
}

export interface AppConfig {
    version: string
    lastModified: string
    settings: {
        theme: 'dark' | 'light'
        autoHide: boolean
        shortcuts: Record<string, string>
        lastUsedBucketId?: string
        autoNavigateToLastBucket?: boolean
        windowSize?: 'small' | 'medium' | 'large'
        hasSeenWelcome?: boolean
    }
}

export interface BucketStats {
    totalBuckets: number
    totalClips: number
    lastModified: string
}

export interface ClipBucketData {
    buckets: Bucket[]
    currentClipboard: string
    config: AppConfig
    stats: BucketStats
}

export interface WindowSizeOption {
    value: 'small' | 'medium' | 'large'
    label: string
    description: string
    dimensions: { width: number; height: number }
}

export interface ShortcutValidation {
    valid: boolean
    reason?: string
}

export interface ClipBucketAPI {
    // Data operations
    getData: () => Promise<ClipBucketData>
    getBucket: (bucketId: string) => Promise<Bucket | null>
    getBucketStats: () => Promise<BucketStats>
    getBucketName: (bucketId: string) => Promise<string | null>

    // Bucket operations
    createBucket: (name: string) => Promise<Bucket | null>
    updateBucket: (bucketId: string, updates: { name?: string }) => Promise<Bucket | null>
    deleteBucket: (bucketId: string) => Promise<boolean>

    // Clip operations
    saveToBucket: (bucketId: string, label?: string) => Promise<Clip | null>
    addClipToBucket: (bucketId: string, content: string, label?: string) => Promise<Clip | null>
    updateClip: (
        bucketId: string,
        itemId: string,
        updates: { content?: string; label?: string }
    ) => Promise<Clip | null>
    deleteClip: (bucketId: string, itemId: string) => Promise<boolean>
    copyItem: (text: string, hideAfterCopy?: boolean) => Promise<boolean>

    // Search operations
    searchBuckets: (query: string) => Promise<Bucket[]>
    searchClips: (bucketId: string, query: string) => Promise<Clip[]>

    // Config operations
    getConfig: () => Promise<AppConfig | null>
    updateConfig: (updates: Partial<AppConfig>) => Promise<AppConfig | null>
    setLastUsedBucket: (bucketId: string) => Promise<boolean>
    getLastUsedBucket: () => Promise<string | null>

    // Clipboard operations
    getClipboard: () => Promise<string>
    setClipboard: (text: string) => Promise<boolean>
    clearClipboard: () => Promise<boolean>

    // Import/Export operations
    importLegacyBuckets: (
        legacyData: Record<string, string[]>
    ) => Promise<{ success: boolean; importedCount: number }>
    exportBuckets: () => Promise<any>

    // Settings operations
    updateWelcome: () => Promise<{ success: boolean; error?: string }>
    updateWindowSize: (
        size: 'small' | 'medium' | 'large'
    ) => Promise<{ success: boolean; error?: string }>
    updateShortcuts: (
        shortcuts: Record<string, string>
    ) => Promise<{ success: boolean; error?: string }>
    validateShortcut: (shortcut: string) => Promise<ShortcutValidation>
    getWindowSizes: () => Promise<WindowSizeOption[]>

    // Quick capture operation
    quickCaptureClip: () => Promise<{ success: boolean; error?: string }>

    // Window operations
    hideWindow: () => Promise<void>

    // Event listeners
    onDataUpdate: (callback: (data: ClipBucketData) => void) => void
    onBucketsUpdate: (callback: (buckets: BucketDTO[]) => void) => void
    onBucketUpdate: (callback: (bucket: Bucket) => void) => void
    onBucketDeleted: (callback: (data: { bucketId: string }) => void) => void
    onClipUpdate: (callback: (data: { bucketId: string; clip: Clip }) => void) => void
    onClipDeleted: (callback: (data: { bucketId: string; clipId: string }) => void) => void
    onConfigUpdate: (callback: (config: AppConfig) => void) => void
    onStatsUpdate: (callback: (stats: BucketStats) => void) => void

    // Remove event listeners
    removeAllListeners: (event: string) => void
}
