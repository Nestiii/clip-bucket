import { clipboard, Notification } from 'electron'
import { addClipToBucket, getLastUsedBucket, getBuckets, getBucket } from '../storage/storage.ts'
import { execSync } from 'child_process'

let isCapturing = false
let lastCaptureTime = 0
const CAPTURE_DEBOUNCE_MS = 500

export const quickCaptureClip = async (): Promise<void> => {
    const now = Date.now()
    if (isCapturing || (now - lastCaptureTime) < CAPTURE_DEBOUNCE_MS) {
        console.log('📋 Quick capture debounced - ignoring duplicate trigger')
        return
    }
    
    isCapturing = true
    lastCaptureTime = now
    try {
        console.log('📋 Quick capture triggered - copy and save')
        await simulateCopyAction()
        await new Promise((resolve) => setTimeout(resolve, 150))
        const clipboardText = clipboard.readText()
        console.log(
            '📋 Captured content:',
            clipboardText ? `"${clipboardText.slice(0, 50)}..."` : 'EMPTY'
        )
        if (!clipboardText || !clipboardText.trim()) {
            showNotification('Nothing Selected', 'No text was selected to copy and save', 'warning')
            return
        }
        const targetBucketId = await getTargetBucket()
        if (!targetBucketId) {
            showNotification(
                'No Bucket',
                'No buckets found - open ClipBucket to create one',
                'error'
            )
            return
        }
        const savedClip = addClipToBucket(targetBucketId, clipboardText)
        if (savedClip) {
            const bucket = getBucket(targetBucketId)
            const bucketName = bucket?.name || 'Unknown Bucket'
            showNotification(
                'Copied & Saved!',
                `Copied to clipboard and saved to "${bucketName}"\n${clipboardText.slice(0, 50)}${clipboardText.length > 50 ? '...' : ''}`,
                'success'
            )

            console.log(`✅ Copy and capture successful: ${bucketName}`)
        } else {
            // Still copied to clipboard, just failed to save
            showNotification(
                'Copied (Save Failed)',
                'Text copied to clipboard but could not save to bucket',
                'warning'
            )
        }
    } catch (error) {
        console.error('❌ Quick capture failed:', error)
        showNotification('Error', 'Copy and capture failed - please try again', 'error')
    } finally {
        isCapturing = false
    }
}

const simulateCopyAction = async (): Promise<void> => {
    try {
        if (process.platform === 'darwin') {
            execSync(
                `osascript -e 'tell application "System Events" to keystroke "c" using command down'`
            )
        } else if (process.platform === 'win32') {
            execSync(
                `powershell -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait('^c')"`
            )
        } else {
            try {
                execSync('xdotool key ctrl+c')
            } catch (error) {
                console.warn('xdotool not available on this Linux system')
                throw new Error('Copy simulation not supported on this platform')
            }
        }
        console.log('📋 Copy command sent to system')
    } catch (error) {
        console.error('❌ Failed to simulate copy action:', error)
        throw error
    }
}

const getTargetBucket = async (): Promise<string | null> => {
    try {
        const lastUsedBucketId = getLastUsedBucket()
        if (lastUsedBucketId) {
            const bucket = getBucket(lastUsedBucketId)
            if (bucket) {
                console.log(`📌 Using last used bucket: ${bucket.name}`)
                return lastUsedBucketId
            }
        }
        const availableBuckets = getBuckets()
        if (availableBuckets.length > 0) {
            console.log(`📌 Using first available bucket: ${availableBuckets[0].name}`)
            return availableBuckets[0].id
        }
        return null
    } catch (error) {
        console.error('❌ Error determining target bucket:', error)
        return null
    }
}

const showNotification = (
    title: string,
    body: string,
    type: 'success' | 'warning' | 'error'
): void => {
    try {
        console.log(`🔔 [${type.toUpperCase()}] ${title}: ${body}`)
        const notification = new Notification({
            title: title,
            body: body,
            silent: type === 'success',
            timeoutType: 'default',
        })
        notification.show()
        if (type === 'success') {
            setTimeout(() => {
                notification.close()
            }, 3000)
        }
    } catch (error) {
        console.error('❌ Error showing notification:', error)
    }
}
