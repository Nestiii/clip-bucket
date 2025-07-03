import { useEffect, useState } from 'react'
import { BucketDTO } from '../../../shared/types.ts'
import { IPC_EVENTS } from '../../../shared/ipcEvents.ts'

export const useBuckets = () => {
    const [buckets, setBuckets] = useState<BucketDTO[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loadBuckets = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await window.api.getData()
            setBuckets(data.buckets)
        } catch (err) {
            console.error('Failed to load buckets:', err)
            setError('Failed to load buckets')
        } finally {
            setLoading(false)
        }
    }

    const createBucket = async (name: string) => {
        try {
            const newBucket = await window.api.createBucket(name)
            if (!newBucket) {
                throw new Error('Failed to create bucket')
            }
            return newBucket
        } catch (err) {
            console.error('Failed to create bucket:', err)
            throw err
        }
    }

    const deleteBucket = async (bucketId: string) => {
        try {
            const success = await window.api.deleteBucket(bucketId)
            if (!success) {
                throw new Error('Failed to delete bucket')
            }
            return true
        } catch (err) {
            console.error('Failed to delete bucket:', err)
            throw err
        }
    }

    const renameBucket = async (bucketId: string, name: string) => {
        try {
            const updatedBucket = await window.api.updateBucket(bucketId, {name})
            if (!updatedBucket) {
                throw new Error('Failed to update bucket')
            }
            return true
        } catch (err) {
            console.error('Failed to update bucket:', err)
            throw err
        }
    }

    useEffect(() => {
        loadBuckets()
        // Set up listeners
        window.api.onBucketsUpdate(setBuckets)
        window.api.onDataUpdate((data) => {
            setBuckets(data.buckets)
        })

        return () => {
            window.api.removeAllListeners(IPC_EVENTS.RENDERER.BUCKETS_UPDATE)
            window.api.removeAllListeners(IPC_EVENTS.RENDERER.DATA_UPDATE)
        }
    }, [])

    return {
        buckets,
        loading,
        error,
        loadBuckets,
        createBucket,
        deleteBucket,
        renameBucket,
    }
}
