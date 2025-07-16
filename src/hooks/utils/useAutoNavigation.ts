import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBuckets } from '../api/useBuckets.ts'

export const useAutoNavigation = () => {
    const navigate = useNavigate()
    const { buckets, loading } = useBuckets()
    const [isAutoNavigating, setIsAutoNavigating] = useState(true)

    useEffect(() => {
        const checkAutoNavigation = async () => {
            if (loading || buckets.length === 0) return
            try {
                const lastUsedBucketId = await window.api.getLastUsedBucket()
                if (lastUsedBucketId) {
                    const bucketExists = buckets.some((bucket) => bucket.id === lastUsedBucketId)
                    if (bucketExists) {
                        navigate(`/bucket/${lastUsedBucketId}`)
                        return
                    } else {
                        await window.api.setLastUsedBucket('')
                    }
                }
            } catch (error) {
                console.error('Error during auto-navigation:', error)
            } finally {
                setIsAutoNavigating(false)
            }
        }

        checkAutoNavigation()
    }, [buckets, loading, navigate])

    return { isAutoNavigating: loading || isAutoNavigating }
}
