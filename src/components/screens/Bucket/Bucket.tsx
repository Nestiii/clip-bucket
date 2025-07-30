import React, { useState, useEffect } from 'react'
import './Bucket.css'
import { Column } from '../../common/Column/Column.tsx'
import { ClipItem } from '../../feature/ClipItem/ClipItem.tsx'
import { ScreenWrapper } from '../../common/ScreenWrapper/ScreenWrapper.tsx'
import { Input } from '../../common/Input/Input.tsx'
import { MagnifyingGlassIcon, ClipboardIcon, PlusIcon } from '@phosphor-icons/react'
import { useSearch } from '../../../hooks/utils/useSearch.ts'
import { useClips } from '../../../hooks/api/useClips.ts'
import { useParams } from 'react-router-dom'
import { ClipPreview } from '../../feature/ClipPreview/ClipPreview.tsx'
import { Row } from '../../common/Row/Row.tsx'
import { Button } from '../../common/Button/Button.tsx'
import { Clip } from '../../../../shared/types.ts'

export const Bucket: React.FC = () => {
    const { bucketId } = useParams<{ bucketId: string }>()
    const [fullscreenClip, setFullscreenClip] = useState<string>('')
    const [currentClipboard, setCurrentClipboard] = useState<string>('')
    const [showClipboardPreview, setShowClipboardPreview] = useState<boolean>(false)
    const { clips, loading, error, addClip, deleteClip, updateClip } = useClips()
    const { filteredData, searchTerm, handleSearchChange } = useSearch({
        data: clips || [],
        searchFields: ['label', 'content'],
        debounceMs: 300,
    })

    useEffect(() => {
        if (bucketId) window.api.setLastUsedBucket(bucketId)
    }, [bucketId])

    useEffect(() => {
        const loadClipboard = async () => {
            try {
                const clipboardText = await window.api.getClipboard()
                if (clipboardText && clipboardText.trim()) {
                    setCurrentClipboard(clipboardText.trim())
                } else {
                    setCurrentClipboard('')
                }
            } catch (error) {
                console.error('Failed to load clipboard:', error)
                setCurrentClipboard('')
            }
        }
        loadClipboard()
    }, [])

    const renderClip = (clip: Clip, fullscreen?: boolean) => {
        return (
            <ClipItem
                key={clip.id}
                onDelete={() => {
                    deleteClip(clip.id)
                    setFullscreenClip('')
                }}
                setFullscreenClip={() => setFullscreenClip(fullscreenClip ? '' : clip.id)}
                onLabelChange={(label) => updateClip(clip.id, { label })}
                onContentChange={(content) => updateClip(clip.id, { content })}
                fullscreen={fullscreen}
                {...clip}
            />
        )
    }

    const clipsContainerClasses = [
        'bucket-screen__clips-container',
        fullscreenClip && 'bucket-screen__clips-container--fullscreen',
        showClipboardPreview && 'bucket-screen__clips-container--with-preview',
    ]
        .filter(Boolean)
        .join(' ')

    const safeFilteredData = filteredData || []
    const safeClips = clips || []

    if (loading) return null
    if (error) return <div>Error: {error}</div>

    return (
        <ScreenWrapper>
            {!fullscreenClip && (
                <>
                    <Row className="bucket-screen__header">
                        <Input
                            placeholder={'Search clip...'}
                            rightIcon={<MagnifyingGlassIcon size={16} />}
                            variant={'bordered'}
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            fullWidth
                        />
                        <Button
                            onClick={() => setShowClipboardPreview(true)}
                            variant={'transparent-bordered'}
                            icon={<PlusIcon />}
                            title={'Create clip'}
                            style={{ height: 36 }}
                        />
                    </Row>
                    {showClipboardPreview && currentClipboard && (
                        <ClipPreview
                            addClip={addClip}
                            setShowClipboardPreview={setShowClipboardPreview}
                            currentClipboard={currentClipboard}
                        />
                    )}
                </>
            )}
            <Column className={clipsContainerClasses}>
                {safeFilteredData.map((clip) => {
                    if (fullscreenClip) {
                        if (fullscreenClip === clip.id) return renderClip(clip, true)
                        else return null
                    } else return renderClip(clip)
                })}
                {filteredData.length === 0 && safeClips.length === 0 && (
                    <div className="bucket-screen__empty-state">
                        <ClipboardIcon size={48} />
                        <h3>No clips yet</h3>
                        <p>
                            Copy something to your clipboard and hit the "+" button to add quickly
                        </p>
                    </div>
                )}
            </Column>
        </ScreenWrapper>
    )
}
