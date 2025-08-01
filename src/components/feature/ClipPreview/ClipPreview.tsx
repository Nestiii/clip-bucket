import React, { useState } from 'react'
import './ClipPreview.css'
import { Input } from '../../common/Input/Input.tsx'
import { Button } from '../../common/Button/Button.tsx'
import { BroomIcon, XIcon } from '@phosphor-icons/react'
import { Textarea } from '../../common/TextArea/TextArea.tsx'

import { Clip } from '../../../../shared/types'

interface ClipPreviewProps {
    currentClipboard?: string
    addClip?: (content: string, label?: string) => Promise<Clip | null>
    setShowClipboardPreview?: (show: boolean) => void
}

export const ClipPreview: React.FC<ClipPreviewProps> = ({
    currentClipboard,
    addClip,
    setShowClipboardPreview,
}) => {
    const [addClipName, setAddClipName] = useState<string>('')
    const [isAdding, setIsAdding] = useState<boolean>(false)
    const [localValue, setLocalValue] = useState<string>(currentClipboard || '')

    const handleAddFromClipboard = async () => {
        if (!currentClipboard) return
        try {
            setIsAdding(true)
            await addClip?.(localValue, addClipName)
            setShowClipboardPreview?.(false)
        } catch (error) {
            alert('Failed to add clip from clipboard')
        } finally {
            setIsAdding(false)
        }
    }

    const dismissClipboardPreview = () => {
        setShowClipboardPreview?.(false)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAddFromClipboard()
        }
    }

    return (
        <div className="clip-preview">
            <div className="clip-preview__header">
                <Input
                    placeholder={'Clip name...'}
                    variant={'bordered'}
                    value={addClipName}
                    onChange={(e) => setAddClipName(e.target.value)}
                    onKeyDown={handleKeyPress}
                    autoFocus
                    fullWidth
                />
                <Button
                    variant={'transparent'}
                    icon={<XIcon size={14} />}
                    onClick={dismissClipboardPreview}
                    style={{ padding: '4px', marginLeft: '8px' }}
                />
            </div>
            <div className="clip-preview__content">
                <Textarea
                    value={localValue}
                    onChange={(e) => setLocalValue(e.target.value)}
                    placeholder={'Clip content...'}
                    rows={4}
                    variant={'bordered'}
                    resize={'none'}
                />
                <Button
                    variant={'transparent'}
                    icon={<BroomIcon size={14} />}
                    onClick={() => setLocalValue('')}
                    style={{ padding: '4px', marginLeft: '8px' }}
                    title={'Clear content'}
                />
            </div>
            <Button
                variant={'primary'}
                onClick={handleAddFromClipboard}
                disabled={isAdding || !localValue}
                size={'sm'}
                style={{ marginTop: '8px' }}
                fullWidth
            >
                {isAdding ? 'Adding...' : 'Create clip'}
            </Button>
        </div>
    )
}
