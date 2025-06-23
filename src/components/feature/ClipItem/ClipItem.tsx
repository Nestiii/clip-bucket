import React, { useState, useRef } from 'react'
import styles from './ClipItem.module.css'
import { Input } from '../../common/Input/Input.tsx'
import { Text } from '../../common/Text/Text.tsx'
import { Button } from '../../common/Button/Button.tsx'
import { Textarea } from '../../common/TextArea/TextArea.tsx'
import { CornersInIcon, CornersOutIcon, PencilIcon, TrashIcon } from '@phosphor-icons/react'

export interface ClipItemProps {
    id?: string
    label?: string
    content?: string
    onLabelChange?: (label: string) => void
    onContentChange?: (content: string) => void
    onCopy?: () => void
    onDelete?: () => void
    isEditing?: boolean
    fullscreen?: boolean
    onEditToggle?: () => void
    setFullscreenClip?: () => void
    className?: string
    style?: React.CSSProperties
}

export const ClipItem: React.FC<ClipItemProps> = ({
                                                      id,
                                                      label = '',
                                                      content = '',
                                                      onLabelChange,
                                                      onContentChange,
                                                      onCopy,
                                                      onDelete,
                                                      isEditing = false,
                                                      fullscreen = false,
                                                      onEditToggle,
                                                      setFullscreenClip,
                                                      className,
                                                      style,
                                                  }) => {
    const [localLabel, setLocalLabel] = useState(label)
    const [localContent, setLocalContent] = useState(content)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newLabel = e.target.value
        setLocalLabel(newLabel)
        onLabelChange?.(newLabel)
    }

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value
        setLocalContent(newContent)
        onContentChange?.(newContent)
    }

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(localContent)
            onCopy?.()
        } catch (error) {
            console.error('Failed to copy to clipboard:', error)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            handleCopy()
        }
        if (e.key === 'Escape' && isEditing) {
            onEditToggle?.()
        }
    }

    const classes = [styles.clipItem, fullscreen && styles.fullscreen, isEditing && styles.editing, className]
        .filter(Boolean)
        .join(' ')

    return (
        <div className={classes} style={style} id={id}>
            <div className={styles.header}>
                <div className={styles.labelSection}>
                    {isEditing ? (
                        <Input
                            value={localLabel}
                            onChange={handleLabelChange}
                            placeholder={'Enter a label for this clip...'}
                            autoFocus
                            variant={'bordered'}
                            size={'md'}
                        />
                    ) : (
                        <div className={styles.labelDisplay}>
                            <Text as={'span'} size={'md'} weight={'bold'} truncate>
                                {localLabel}
                            </Text>
                        </div>
                    )}
                </div>
                <div className={styles.actions}>
                    <Button
                        icon={fullscreen ? <CornersInIcon size={16} /> : <CornersOutIcon size={16} />}
                        variant={'transparent'}
                        size={'sm'}
                        onClick={setFullscreenClip}
                        title={'Fullscreen'}
                    />
                    <Button
                        icon={<PencilIcon size={16} />}
                        variant={'transparent'}
                        size={'sm'}
                        onClick={onEditToggle}
                        title={'Rename clip'}
                    />
                    <Button
                        icon={<TrashIcon size={16} />}
                        variant={'transparent'}
                        size={'sm'}
                        onClick={onDelete}
                        title={'Delete clip'}
                    />
                </div>
            </div>
            <div
                className={styles.contentDisplay}
                onClick={handleCopy}
                role={'button'}
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        handleCopy()
                    }
                }}
                style={fullscreen ? {height: '100%'} : {}}
            >
                <Textarea
                    ref={textareaRef}
                    value={localContent}
                    onChange={handleContentChange}
                    onKeyDown={handleKeyDown}
                    placeholder={'Paste or type your content here...'}
                    rows={1}
                    variant={'bordered'}
                    autoFocus={!localLabel}
                    resize={'none'}
                    style={fullscreen ? {height: 'calc(100% - 20px)'} : {}}
                />
                {localContent && (
                    <div className={styles.copyHint}>
                        <Text size={'xs'} color={'primary'}>
                            {'Click to copy'}
                        </Text>
                    </div>
                )}
            </div>
            <div className={styles.metadata}>
                <Text size={'xs'} color={'muted'} weight={'medium'}>
                    {localContent.length} characters
                </Text>
            </div>
        </div>
    )
}
