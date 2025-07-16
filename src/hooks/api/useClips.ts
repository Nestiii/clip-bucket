import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Clip } from '../../../shared/types.ts'
import { IPC_EVENTS } from '../../../shared/ipcEvents.ts'

export const useClips = () => {
    const { bucketId } = useParams<{ bucketId: string }>()
    const [clips, setClips] = useState<Clip[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loadClips = async () => {
        if (!bucketId) {
            setError('No bucket ID provided')
            setLoading(false)
            return
        }
        try {
            setLoading(true)
            setError(null)
            const bucketData = await window.api.getBucket(bucketId)
            if (!bucketData) {
                setError('Bucket not found')
                setClips([])
            } else {
                setClips(bucketData.clips)
            }
        } catch (err) {
            console.error('Failed to load clips:', err)
            setError('Failed to load clips')
            setClips([])
        } finally {
            setLoading(false)
        }
    }

    const addClip = async (content: string, label?: string): Promise<Clip | null> => {
        if (!bucketId) throw new Error('No bucket ID')
        try {
            const newClip = await window.api.addClipToBucket(bucketId, content, label)
            if (!newClip) {
                throw new Error('Failed to add clip')
            }
            return newClip
        } catch (err) {
            console.error('Failed to add clip:', err)
            throw err
        }
    }

    const updateClip = async (
        clipId: string,
        updates: { content?: string; label?: string }
    ): Promise<Clip | null> => {
        if (!bucketId) throw new Error('No bucket ID')
        try {
            const updatedClip = await window.api.updateClip(bucketId, clipId, updates)
            if (!updatedClip) {
                throw new Error('Failed to update clip')
            }
            return updatedClip
        } catch (err) {
            console.error('Failed to update clip:', err)
            throw err
        }
    }

    const deleteClip = async (clipId: string): Promise<boolean> => {
        if (!bucketId) throw new Error('No bucket ID')
        try {
            const success = await window.api.deleteClip(bucketId, clipId)
            if (!success) {
                throw new Error('Failed to delete clip')
            }
            return true
        } catch (err) {
            console.error('Failed to delete clip:', err)
            throw err
        }
    }

    const copyClip = async (content: string, hideAfterCopy: boolean = true): Promise<boolean> => {
        try {
            const success = await window.api.copyItem(content, hideAfterCopy)
            if (!success) {
                throw new Error('Failed to copy clip')
            }
            return true
        } catch (err) {
            console.error('Failed to copy clip:', err)
            throw err
        }
    }

    const searchClips = async (query: string): Promise<Clip[]> => {
        if (!bucketId) return []
        try {
            const results = await window.api.searchClips(bucketId, query)
            return results
        } catch (err) {
            console.error('Failed to search clips:', err)
            return []
        }
    }

    useEffect(() => {
        if (!bucketId) return
        const handleBucketUpdate = (updatedBucket: any) => {
            if (updatedBucket.id === bucketId) {
                console.log('Received clips update from bucket update')
                console.log(updatedBucket)
                setClips(updatedBucket.clips)
            }
        }
        const handleClipUpdate = ({
            bucketId: updatedBucketId,
            clip,
        }: {
            bucketId: string
            clip: Clip
        }) => {
            if (updatedBucketId === bucketId) {
                console.log('Received clip update:', clip)
                setClips((prevClips) =>
                    prevClips.map((existingClip) =>
                        existingClip.id === clip.id ? clip : existingClip
                    )
                )
            }
        }
        const handleClipDeleted = ({
            bucketId: updatedBucketId,
            clipId,
        }: {
            bucketId: string
            clipId: string
        }) => {
            if (updatedBucketId === bucketId) {
                console.log('Clip deleted:', clipId)
                setClips((prevClips) => prevClips.filter((clip) => clip.id !== clipId))
            }
        }
        const handleDataUpdate = (data: any) => {
            const updatedBucket = data.buckets.find((b: any) => b.id === bucketId)
            if (updatedBucket) {
                setClips(updatedBucket.clips)
            }
        }

        window.api.onBucketUpdate(handleBucketUpdate)
        window.api.onClipUpdate(handleClipUpdate)
        window.api.onClipDeleted(handleClipDeleted)
        window.api.onDataUpdate(handleDataUpdate)

        return () => {
            window.api.removeAllListeners(IPC_EVENTS.RENDERER.BUCKET_UPDATE)
            window.api.removeAllListeners(IPC_EVENTS.RENDERER.CLIP_UPDATE)
            window.api.removeAllListeners(IPC_EVENTS.RENDERER.CLIP_DELETED)
            window.api.removeAllListeners(IPC_EVENTS.RENDERER.DATA_UPDATE)
        }
    }, [bucketId])

    useEffect(() => {
        loadClips()
    }, [bucketId])

    return {
        clips,
        loading,
        error,
        bucketId,
        addClip,
        updateClip,
        deleteClip,
        copyClip,
        loadClips,
        searchClips,
    }
}
