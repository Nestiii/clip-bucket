import fs from 'node:fs'
import { APP_CONFIG } from '../config/config.ts'

export type Buckets = Record<string, string[]>

let buckets: Buckets = {}

export const loadBuckets = (): void => {
    try {
        if (fs.existsSync(APP_CONFIG.storage.bucketsFile)) {
            const data = fs.readFileSync(APP_CONFIG.storage.bucketsFile, 'utf8')
            buckets = JSON.parse(data)
        }
    } catch (error) {
        console.error('Error loading buckets:', error)
        buckets = {}
    }
}

export const saveBuckets = (): void => {
    try {
        fs.writeFileSync(APP_CONFIG.storage.bucketsFile, JSON.stringify(buckets, null, 2))
    } catch (error) {
        console.error('Error saving buckets:', error)
    }
}

export const getBuckets = (): Buckets => buckets

export const createBucket = (bucketName: string): boolean => {
    if (bucketName && !buckets[bucketName]) {
        buckets[bucketName] = []
        saveBuckets()
        return true
    }
    return false
}

export const deleteBucket = (bucketName: string): boolean => {
    if (buckets[bucketName]) {
        delete buckets[bucketName]
        saveBuckets()
        return true
    }
    return false
}

export const addItemToBucket = (bucketName: string, item: string): boolean => {
    if (!item || !item.trim()) return false

    if (!buckets[bucketName]) {
        buckets[bucketName] = []
    }

    if (!buckets[bucketName].includes(item)) {
        buckets[bucketName].push(item)
        saveBuckets()
        return true
    }
    return false
}

export const deleteItemFromBucket = (bucketName: string, itemIndex: number): boolean => {
    if (buckets[bucketName] && buckets[bucketName][itemIndex] !== undefined) {
        buckets[bucketName].splice(itemIndex, 1)
        saveBuckets()
        return true
    }
    return false
}
