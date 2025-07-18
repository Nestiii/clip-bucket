import fs from 'node:fs'
import path from 'node:path'
import { APP_CONFIG } from '../config/config.ts'
import { AppConfig, Bucket, BucketDTO, Clip } from '../../shared/types.ts'
import { v4 as uuidv4 } from 'uuid'
import { cloneDeep, merge } from 'lodash'
import {execSync} from 'child_process'

const DEFAULT_SHORTCUTS = {
    toggleWindow: 'CommandOrControl+Shift+P',
    quickCapture: 'CommandOrControl+Shift+C'
}

const DEFAULT_CONFIG: AppConfig = {
    version: '0.0.0',
    lastModified: new Date().toISOString(),
    settings: {
        theme: 'dark',
        autoHide: true,
        shortcuts: DEFAULT_SHORTCUTS,
        hasSeenWelcome: false
    }
}

let buckets: Map<string, Bucket> = new Map()
let appConfig: AppConfig = cloneDeep(DEFAULT_CONFIG)

const ensureDirectoryExists = (dirPath: string): void => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true, mode: 0o700 })
    }
}

const generateId = (): string => {
    return uuidv4()
}

export const initializeStorage = (): void => {
    try {
        console.log(`🔧 Initializing ${APP_CONFIG.environment.mode.toUpperCase()} storage...`)
        ensureDirectoryExists(APP_CONFIG.storage.appDataDir)
        ensureDirectoryExists(APP_CONFIG.storage.configDir)
        ensureDirectoryExists(APP_CONFIG.storage.bucketsDir)
        hideDirectories()
        console.log('✅ Storage directories initialized:')
        console.log(`📁 Mode: ${APP_CONFIG.environment.mode.toUpperCase()}`)
        console.log(`📁 Storage: ${APP_CONFIG.storage.appDataDir}`)
    } catch (error) {
        console.error('❌ Error initializing storage directories:', error)
        throw new Error(`Storage initialization failed: ${error}`)
    }
}

const hideDirectories = (): void => {
    const { appDataDir } = APP_CONFIG.storage
    try {
        switch (process.platform) {
            case 'win32':
                hideWindowsDirectory(appDataDir)
                break
            case 'darwin':
                hideMacOSDirectory(appDataDir)
                break
            case 'linux':
                console.log('🐧 Linux: Using dot-prefixed directory (hidden by default)')
                break
            default:
                console.log('🤷 Unknown platform: Directory created but not specifically hidden')
        }
    } catch (error) {
        console.warn('⚠️ Could not apply platform-specific hiding:', error)
    }
}

const hideWindowsDirectory = (dirPath: string): void => {
    try {
        execSync(`attrib +H +S "${dirPath}"`, { stdio: 'ignore', timeout: 5000 })
        console.log('🪟 Windows: Applied hidden+system attributes')
    } catch (error) {
        console.warn('🪟 Windows: Could not set hidden attribute:', error)
    }
}

const hideMacOSDirectory = (dirPath: string): void => {
    try {
        execSync(`chflags hidden "${dirPath}"`, { stdio: 'ignore', timeout: 5000 })
        console.log('🍎 macOS: Applied hidden flag')
    } catch (error) {
        console.warn('🍎 macOS: Could not set hidden flag:', error)
    }
}

export const loadConfig = (): void => {
    try {
        if (fs.existsSync(APP_CONFIG.storage.configFile)) {
            const data = fs.readFileSync(APP_CONFIG.storage.configFile, 'utf8')
            const loadedConfig = JSON.parse(data)
            appConfig = merge({}, DEFAULT_CONFIG, loadedConfig)
            console.log(`⚙️ ${APP_CONFIG.environment.mode.toUpperCase()} config loaded`)
            saveConfig()
        } else {
            appConfig = cloneDeep(DEFAULT_CONFIG)
            saveConfig()
            console.log(`⚙️ Default ${APP_CONFIG.environment.mode.toUpperCase()} config created`)
        }
    } catch (error) {
        console.error('❌ Error loading config:', error)
        appConfig = cloneDeep(DEFAULT_CONFIG)
    }
}

export const saveConfig = (): void => {
    try {
        appConfig.lastModified = new Date().toISOString()
        fs.writeFileSync(APP_CONFIG.storage.configFile, JSON.stringify(appConfig, null, 2))
    } catch (error) {
        console.error('❌ Error saving config:', error)
    }
}

export const getConfig = (): AppConfig => appConfig

export const updateConfig = (updates: Partial<AppConfig>): void => {
    appConfig = merge({}, appConfig, updates)
    saveConfig()
}

export const loadBuckets = (): void => {
    try {
        const bucketFiles = fs
            .readdirSync(APP_CONFIG.storage.bucketsDir)
            .filter((file) => file.endsWith('.json'))
        buckets.clear()
        for (const file of bucketFiles) {
            const bucketPath = path.join(APP_CONFIG.storage.bucketsDir, file)
            const data = fs.readFileSync(bucketPath, 'utf8')
            const bucket: Bucket = JSON.parse(data)
            buckets.set(bucket.id, bucket)
        }
        console.log(
            `📦 Loaded ${buckets.size} buckets in ${APP_CONFIG.environment.mode.toUpperCase()} mode`
        )
    } catch (error) {
        console.error('❌ Error loading buckets:', error)
        buckets.clear()
    }
}

export const saveBucket = (bucket: Bucket): void => {
    try {
        const bucketPath = APP_CONFIG.storage.getBucketPath(bucket.id)
        fs.writeFileSync(bucketPath, JSON.stringify(bucket, null, 2))
        buckets.set(bucket.id, bucket)
    } catch (error) {
        console.error(`❌ Error saving bucket ${bucket.id}:`, error)
    }
}

export const deleteBucketFile = (bucketId: string): void => {
    try {
        const bucketPath = APP_CONFIG.storage.getBucketPath(bucketId)
        if (fs.existsSync(bucketPath)) fs.unlinkSync(bucketPath)
        buckets.delete(bucketId)
    } catch (error) {
        console.error(`❌ Error deleting bucket file ${bucketId}:`, error)
    }
}

export const getBuckets = (): BucketDTO[] => {
    return Array.from(buckets.values())
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .map((bucket) => ({ name: bucket.name, id: bucket.id, timestamp: bucket.timestamp }))
}

export const getBucket = (bucketId: string): Bucket | undefined => {
    return buckets.get(bucketId)
}

export const getBucketName = (bucketId: string): string | null => {
    const bucket = buckets.get(bucketId)
    return bucket ? bucket.name : null
}

export const createBucket = (name: string): Bucket | null => {
    if (!name || !name.trim()) return null
    const existingBucket = Array.from(buckets.values()).find((b) => b.name === name.trim())
    if (existingBucket) return null
    const bucket: Bucket = {
        id: generateId(),
        name: name.trim(),
        timestamp: new Date().toISOString(),
        clips: [],
    }
    saveBucket(bucket)
    return bucket
}

export const updateBucket = (
    bucketId: string,
    updates: Partial<Omit<Bucket, 'id'>>
): Bucket | null => {
    const bucket = buckets.get(bucketId)
    if (!bucket) return null
    const updatedBucket: Bucket = {
        ...bucket,
        ...updates,
        id: bucketId,
    }
    saveBucket(updatedBucket)
    return updatedBucket
}

export const deleteBucket = (bucketId: string): boolean => {
    const bucket = buckets.get(bucketId)
    if (!bucket) return false
    deleteBucketFile(bucketId)
    return true
}

export const addClipToBucket = (bucketId: string, content: string, label?: string): Clip | null => {
    if (!content || !content.trim()) return null
    const bucket = buckets.get(bucketId)
    if (!bucket) return null
    const item: Clip = {
        id: generateId(),
        content: content.trim(),
        timestamp: new Date().toISOString(),
        label: label?.trim() || content.trim().split(' ')[0],
    }
    bucket.clips.unshift(item)
    saveBucket(bucket)
    return item
}

export const updateClip = (
    bucketId: string,
    itemId: string,
    updates: Partial<Omit<Clip, 'id'>>
): Clip | null => {
    const bucket = buckets.get(bucketId)
    if (!bucket) return null
    const itemIndex = bucket.clips.findIndex((item) => item.id === itemId)
    if (itemIndex === -1) return null
    const updatedItem: Clip = {
        ...bucket.clips[itemIndex],
        ...updates,
        id: itemId,
    }
    bucket.clips[itemIndex] = updatedItem
    saveBucket(bucket)
    return updatedItem
}

export const deleteClipFromBucket = (bucketId: string, itemId: string): boolean => {
    const bucket = buckets.get(bucketId)
    if (!bucket) return false
    const itemIndex = bucket.clips.findIndex((item) => item.id === itemId)
    if (itemIndex === -1) return false
    bucket.clips.splice(itemIndex, 1)
    saveBucket(bucket)
    return true
}

export const getBucketStats = () => {
    const stats = {
        totalBuckets: buckets.size,
        totalClips: 0,
        lastModified: new Date(0).toISOString(),
    }
    for (const bucket of buckets.values()) {
        stats.totalClips += bucket.clips.length
        if (bucket.timestamp > stats.lastModified) {
            stats.lastModified = bucket.timestamp
        }
    }
    return stats
}

export const searchBuckets = (query: string): { name: string; id: string; timestamp: string }[] => {
    if (!query.trim()) return getBuckets()
    const searchTerm = query.toLowerCase()
    return getBuckets().filter((bucket) => bucket.name.toLowerCase().includes(searchTerm))
}

export const searchClips = (bucketId: string, query: string): Clip[] => {
    const bucket = buckets.get(bucketId)
    if (!bucket) return []
    if (!query.trim()) return bucket.clips
    const searchTerm = query.toLowerCase()
    return bucket.clips.filter(
        (item) =>
            item.content.toLowerCase().includes(searchTerm) ||
            item.label?.toLowerCase().includes(searchTerm)
    )
}

export const createDefaultBucketIfNeeded = (): void => {
    try {
        const existingBuckets = getBuckets()
        if (existingBuckets.length === 0) {
            console.log(
                `📝 Creating default bucket in ${APP_CONFIG.environment.mode.toUpperCase()} mode...`
            )
            const defaultBucket = createBucket('My Clips')
            if (defaultBucket) {
                console.log('✅ Default bucket created successfully')
            } else {
                console.error('❌ Failed to create default bucket')
            }
        }
    } catch (error) {
        console.error('❌ Error creating default bucket:', error)
    }
}

export const setLastUsedBucket = (bucketId: string): void => {
    try {
        const config = getConfig()
        updateConfig({
            settings: {
                ...config.settings,
                lastUsedBucketId: bucketId,
            },
        })
    } catch (error) {
        console.error('❌ Error setting last used bucket:', error)
    }
}

export const getLastUsedBucket = (): string | null => {
    try {
        const config = getConfig()
        return config.settings.lastUsedBucketId || null
    } catch (error) {
        console.error('❌ Error getting last used bucket:', error)
        return null
    }
}
